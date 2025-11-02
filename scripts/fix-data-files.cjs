#!/usr/bin/env node

/**
 * Script de correction des fichiers de données
 * Corrige uniquement les échappements inutiles dans les fichiers .ts de données
 */

const fs = require('fs');
const path = require('path');

const FILES_TO_FIX = [
  path.join(__dirname, '..', 'src', 'data', 'articles.ts'),
];

/**
 * Supprime les échappements inutiles
 */
function fixUselessEscapes(content) {
  // Supprimer les échappements inutiles de '
  content = content.replace(/\\'/g, "'");
  
  // Supprimer les échappements inutiles de "
  content = content.replace(/\\"/g, '"');
  
  // Supprimer les échappements inutiles de &
  content = content.replace(/\\&/g, '&');
  
  return content;
}

/**
 * Fonction principale
 */
function main() {
  console.log('\n🔧 Correction des fichiers de données\n');

  let fixedCount = 0;

  FILES_TO_FIX.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Fichier non trouvé: ${path.basename(filePath)}`);
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fixedContent = fixUselessEscapes(content);

      if (content !== fixedContent) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        fixedCount++;
        console.log(`✅ ${path.basename(filePath)} corrigé`);
      } else {
        console.log(`ℹ️  ${path.basename(filePath)} déjà correct`);
      }
    } catch (error) {
      console.log(`❌ Erreur lors de la correction de ${path.basename(filePath)}: ${error.message}`);
    }
  });

  console.log(`\n📊 ${fixedCount} fichier(s) corrigé(s)\n`);
}

// Exécution
main();

