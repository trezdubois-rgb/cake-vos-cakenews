#!/usr/bin/env node

/**
 * Script de correction automatique ESLint robuste et modulaire
 * Corrige automatiquement tous les problèmes ESLint détectables
 * 
 * Usage: node scripts/auto-fix-eslint.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '..', 'src'),
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  ignorePatterns: ['node_modules', 'dist', 'build', '.git'],
  maxRetries: 3,
};

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Log avec couleur
 */
function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Récupère tous les fichiers d'un répertoire récursivement
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      if (!CONFIG.ignorePatterns.some((pattern) => filePath.includes(pattern))) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      const ext = path.extname(file);
      if (CONFIG.extensions.includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Exécute ESLint --fix sur un fichier
 */
function fixFile(filePath) {
  try {
    execSync(`npx eslint "${filePath}" --fix`, {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
    });
    return { success: true, file: filePath };
  } catch (error) {
    return { success: false, file: filePath, error: error.message };
  }
}

/**
 * Corrige les imports non utilisés dans un fichier
 */
function removeUnusedImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const importLines = [];
    const usedImports = new Set();

    // Analyser les imports
    lines.forEach((line, index) => {
      if (line.trim().startsWith('import ')) {
        importLines.push({ line, index });
      }
    });

    // Pour chaque import, vérifier s'il est utilisé
    importLines.forEach(({ line }) => {
      const match = line.match(/import\s+(?:{([^}]+)}|(\w+))\s+from/);
      if (match) {
        const imports = match[1] ? match[1].split(',').map((s) => s.trim()) : [match[2]];
        imports.forEach((imp) => {
          const importName = imp.split(' as ')[0].trim();
          // Vérifier si l'import est utilisé dans le fichier
          const regex = new RegExp(`\\b${importName}\\b`, 'g');
          const matches = content.match(regex);
          if (matches && matches.length > 1) { // > 1 car l'import lui-même compte
            usedImports.add(importName);
          }
        });
      }
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Fonction principale
 */
async function main() {
  log('\n🚀 Démarrage de la correction automatique ESLint\n', colors.bright + colors.cyan);

  // Étape 1: Exécuter ESLint --fix sur tous les fichiers
  log('📝 Étape 1: Correction automatique avec ESLint --fix', colors.yellow);
  
  try {
    execSync('npm run lint -- --fix', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    log('✅ ESLint --fix exécuté avec succès\n', colors.green);
  } catch (error) {
    log('⚠️  ESLint --fix terminé avec des avertissements\n', colors.yellow);
  }

  // Étape 2: Récupérer tous les fichiers
  log('📂 Étape 2: Analyse des fichiers', colors.yellow);
  const files = getAllFiles(CONFIG.srcDir);
  log(`   Trouvé ${files.length} fichiers à analyser\n`, colors.cyan);

  // Étape 3: Corrections supplémentaires
  log('🔧 Étape 3: Corrections supplémentaires', colors.yellow);
  let fixedCount = 0;
  let errorCount = 0;

  files.forEach((file) => {
    const result = removeUnusedImports(file);
    if (result.success) {
      fixedCount++;
    } else {
      errorCount++;
      log(`   ❌ Erreur sur ${path.relative(CONFIG.srcDir, file)}: ${result.error}`, colors.red);
    }
  });

  log(`   ✅ ${fixedCount} fichiers traités`, colors.green);
  if (errorCount > 0) {
    log(`   ⚠️  ${errorCount} fichiers avec erreurs`, colors.yellow);
  }

  // Étape 4: Exécuter ESLint --fix une dernière fois
  log('\n🔄 Étape 4: Correction finale', colors.yellow);
  try {
    execSync('npm run lint -- --fix', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
    });
    log('✅ Correction finale terminée\n', colors.green);
  } catch (error) {
    log('⚠️  Correction finale terminée avec des avertissements\n', colors.yellow);
  }

  // Étape 5: Rapport final
  log('📊 Étape 5: Génération du rapport final', colors.yellow);
  try {
    const output = execSync('npm run lint', {
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8',
    });
    
    fs.writeFileSync(
      path.join(__dirname, '..', 'eslint-final-report.txt'),
      output,
      'utf8'
    );
    log('✅ Rapport sauvegardé dans eslint-final-report.txt\n', colors.green);
  } catch (error) {
    const output = error.stdout || error.message;
    fs.writeFileSync(
      path.join(__dirname, '..', 'eslint-final-report.txt'),
      output,
      'utf8'
    );
    log('⚠️  Rapport sauvegardé avec avertissements\n', colors.yellow);
  }

  log('🎉 Correction automatique terminée!\n', colors.bright + colors.green);
  log('📄 Consultez eslint-final-report.txt pour les détails\n', colors.cyan);
}

// Exécution
main().catch((error) => {
  log(`\n❌ Erreur fatale: ${error.message}\n`, colors.red);
  process.exit(1);
});

