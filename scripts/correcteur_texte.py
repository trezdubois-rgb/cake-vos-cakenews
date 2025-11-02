#!/usr/bin/env python3
"""
Script de correction grammaticale automatique pour fichiers texte.

Fonctionnalités :
- Correction avec LanguageTool (nécessite Java)
- Détection automatique d'encodage (avec chardet si disponible)
- Mode séquentiel ou parallèle (--parallel N)
- Dry-run, verbose diff, backup, sortie structurée
- Sécurité contre les path traversals
- Gestion fine des erreurs (fichier par fichier)

Dépendances :
    pip install language-tool-python chardet  # chardet est optionnel

Exemple d'utilisation :
    python correcteur_texte.py ./docs --language fr --parallel 4 --verbose --backup
"""

import os
import argparse
import logging
import multiprocessing
import sys
import signal
import atexit
import subprocess
import pathlib
import difflib

# Import conditionnel de chardet
try:
    import chardet
    HAS_CHARDET = True
except ImportError:
    HAS_CHARDET = False

# Import conditionnel de language_tool_python
try:
    from language_tool_python import LanguageTool
    HAS_LANGUAGETOOL = True
except ImportError:
    HAS_LANGUAGETOOL = False

# Logger nommé
logger = logging.getLogger(__name__)

# Gestion gracieuse de Ctrl+C
def signal_handler(sig, frame):
    logger.warning("Interruption détectée (Ctrl+C). Arrêt en cours...")
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)


def detect_encoding(file_path):
    """Détecte l'encodage du fichier (chardet ou fallback)."""
    try:
        with open(file_path, 'rb') as f:
            raw = f.read(1024 * 1024)  # 1 Mo max
        if HAS_CHARDET:
            result = chardet.detect(raw)
            return result['encoding'] or 'utf-8'
        else:
            return 'utf-8'
    except Exception:
        return 'utf-8'


def correct_text(tool, text):
    """Corrige le texte par paragraphes pour limiter la mémoire."""
    paragraphs = text.split('\n\n')
    corrected = []
    for para in paragraphs:
        if para.strip():
            corrected.append(tool.correct(para))
        else:
            corrected.append(para)
    return '\n\n'.join(corrected)


def process_file(tool, file_path, output_dir, backup, verbose, dry_run, base_dir, strict_encoding):
    """Traite un seul fichier avec gestion d'erreurs robuste."""
    try:
        encoding = detect_encoding(file_path)
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                original_text = f.read()
        except UnicodeDecodeError:
            if strict_encoding:
                logger.error(f"Encodage inconnu pour {file_path} et --strict_encoding activé. Fichier ignoré.")
                return
            else:
                encoding = 'latin1'
                logger.warning(f"Encodage UTF-8 échoué pour {file_path}. Fallback à latin1 (risque de corruption).")
                with open(file_path, 'r', encoding=encoding) as f:
                    original_text = f.read()

        corrected_text = correct_text(tool, original_text)

        if verbose or dry_run:
            diff = difflib.unified_diff(
                original_text.splitlines(),
                corrected_text.splitlines(),
                fromfile=file_path,
                tofile=f"{file_path} (corrigé)",
                lineterm=''
            )
            diff_str = '\n'.join(diff)
            if diff_str:
                logger.info(f"Différences pour {file_path}:\n{diff_str}")
            else:
                logger.info(f"Aucune différence pour {file_path}.")

        if dry_run:
            logger.info(f"[DRY-RUN] {file_path} serait corrigé (sans écriture).")
            return

        if output_dir:
            rel_path = os.path.relpath(file_path, base_dir)
            output_path = os.path.join(output_dir, rel_path)
            # Sécurité : empêcher path traversal
            abs_output = pathlib.Path(output_path).resolve()
            abs_output_dir = pathlib.Path(output_dir).resolve()
            if not str(abs_output).startswith(str(abs_output_dir)):
                raise ValueError(f"Tentative de path traversal détectée pour {file_path}.")
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
        else:
            output_path = file_path

        if backup and not output_dir:
            backup_path = file_path + '.bak'
            os.rename(file_path, backup_path)
            logger.info(f"Backup créé : {backup_path}")

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(corrected_text)

        logger.info(f"Corrigé : {file_path}")

    except PermissionError:
        logger.error(f"Erreur de permission pour {file_path}. Vérifiez les droits.")
    except ValueError as ve:
        logger.error(f"Erreur de sécurité : {ve}")
    except Exception as e:
        logger.error(f"Erreur lors du traitement de {file_path} : {e}")


def check_java():
    """Vérifie que Java est installé et répond rapidement."""
    try:
        subprocess.check_output(['java', '-version'], stderr=subprocess.STDOUT, timeout=5)
        return True
    except subprocess.TimeoutExpired:
        logger.error("Vérification de Java expirée (>5s). Vérifiez votre installation.")
        return False
    except Exception:
        return False


# Variable globale minimale : uniquement l'outil LanguageTool (étatful)
TOOL = None


def worker_init(language):
    """Initialise un worker : démarre LanguageTool et programme sa fermeture."""
    global TOOL
    TOOL = LanguageTool(language)
    atexit.register(TOOL.close)


def worker_process(args):
    """Wrapper pour multiprocessing : unpack les arguments et traite le fichier."""
    file_path, output_dir, backup, verbose, dry_run, base_dir, strict_encoding = args
    process_file(TOOL, file_path, output_dir, backup, verbose, dry_run, base_dir, strict_encoding)


def main():
    parser = argparse.ArgumentParser(
        description="Correcteur grammatical automatique robuste pour fichiers texte."
    )
    parser.add_argument('directory', help="Répertoire à traiter.")
    parser.add_argument(
        '--extensions',
        default='.txt,.md,.rst',
        help="Extensions à traiter (séparées par des virgules)."
    )
    parser.add_argument('--language', default='fr', help="Langue de correction (ex: 'fr', 'en-US').")
    parser.add_argument('--output_dir', help="Répertoire de sortie (préserve la structure).")
    parser.add_argument('--backup', action='store_true', help="Créer un .bak si pas de output_dir.")
    parser.add_argument('--verbose', action='store_true', help="Afficher les différences.")
    parser.add_argument('--dry_run', action='store_true', help="Simuler sans écrire.")
    parser.add_argument('--parallel', type=int, default=1, help="Nombre de processus parallèles.")
    parser.add_argument('--log_file', help="Fichier de log optionnel.")
    parser.add_argument('--strict_encoding', action='store_true', help="Échouer au lieu de fallback sur encodage inconnu.")

    args = parser.parse_args()

    # Configuration du logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        force=True
    )
    
    if not HAS_LANGUAGETOOL:
        logger.error("language-tool-python non installé. Installez avec : pip install language-tool-python")
        sys.exit(1)
    
    if not HAS_CHARDET:
        logger.warning("chardet non installé. Détection d'encodage limitée à UTF-8 / latin1.")

    if args.log_file:
        handler = logging.FileHandler(args.log_file)
        handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        logger.addHandler(handler)

    if not check_java():
        logger.error("Java requis mais non détecté. Installez Java et réessayez.")
        sys.exit(1)

    # Collecte des fichiers
    extensions = [ext.strip() for ext in args.extensions.split(',')]
    files_to_process = []
    for root, _, files in os.walk(args.directory):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                files_to_process.append(os.path.join(root, file))

    if not files_to_process:
        logger.warning(f"Aucun fichier trouvé dans {args.directory} avec les extensions {args.extensions}.")
        return

    logger.info(f"{len(files_to_process)} fichiers à traiter.")

    if args.parallel > 1:
        logger.warning(
            f"Mode parallèle activé ({args.parallel} workers). "
            "Chaque worker lance un serveur Java (~500 Mo–1 Go RAM par worker). "
            "En cas de crash brutal, nettoyez avec : pkill -f LanguageTool"
        )
        with multiprocessing.Pool(
            processes=args.parallel,
            initializer=worker_init,
            initargs=(args.language,)
        ) as pool:
            worker_args = [
                (fp, args.output_dir, args.backup, args.verbose, args.dry_run, args.directory, args.strict_encoding)
                for fp in files_to_process
            ]
            pool.map(worker_process, worker_args)
    else:
        # Mode séquentiel
        tool = LanguageTool(args.language)
        try:
            for fp in files_to_process:
                process_file(
                    tool, fp, args.output_dir, args.backup,
                    args.verbose, args.dry_run, args.directory, args.strict_encoding
                )
        finally:
            tool.close()

    logger.info(f"Traitement terminé. {len(files_to_process)} fichiers analysés.")


if __name__ == "__main__":
    main()

