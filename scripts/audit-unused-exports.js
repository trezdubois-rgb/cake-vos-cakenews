#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Script pour auditer les exports inutilisés en utilisant ts-unused-exports
 * Ce script exécute ts-unused-exports et formate les résultats de manière lisible
 */

const CONFIG = {
  TSCONFIG_PATH: './tsconfig.json',
  EXCLUDE_PATHS: ['node_modules', '.git', 'dist', 'build', 'coverage'],
  IGNORE_TEST_FILES: true,
  SHOW_LINE_NUMBERS: true,
  EXIT_WITH_COUNT: true,
};

function runTsUnusedExports() {
  console.log('🔍 Audit des exports inutilisés...\n');

  // Construire la commande
  const command = [
    'npx',
    'ts-unused-exports',
    CONFIG.TSCONFIG_PATH,
    CONFIG.IGNORE_TEST_FILES ? '--ignoreTestFiles' : '',
    CONFIG.SHOW_LINE_NUMBERS ? '--showLineNumber' : '',
    CONFIG.EXIT_WITH_COUNT ? '--exitWithCount' : '',
    `--excludePathsFromReport=${CONFIG.EXCLUDE_PATHS.join(',')}`,
  ].filter(Boolean).join(' ');

  try {
    // Exécuter la commande
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe']
    });

    // Analyser et formater les résultats
    const results = parseResults(output);
    displayResults(results);
    
    return results;
  } catch (error) {
    if (error.status === 1) {
      // ts-unused-exports retourne 1 quand des exports inutilisés sont trouvés
      const output = error.stdout.toString();
      const results = parseResults(output);
      displayResults(results);
      return results;
    } else {
      console.error('❌ Erreur lors de l\'exécution de ts-unused-exports:', error.message);
      if (error.stderr) {
        console.error('Détails:', error.stderr.toString());
      }
      process.exit(1);
    }
  }
}

function parseResults(output) {
  const lines = output.split('\n').filter(line => line.trim());
  const results = {
    totalFiles: 0,
    totalExports: 0,
    unusedExports: [],
    summary: {}
  };

  let currentFile = null;

  for (const line of lines) {
    // Détecter un nouveau fichier
    if (line.includes(':') && !line.startsWith(' ')) {
      const [filePath, ...exportNames] = line.split(':');
      currentFile = {
        file: filePath.trim(),
        exports: exportNames.map(name => name.trim()).filter(Boolean)
      };
      results.unusedExports.push(currentFile);
      results.totalFiles++;
      results.totalExports += currentFile.exports.length;
    }
  }

  return results;
}

function displayResults(results) {
  console.log('='.repeat(70));
  console.log('📊 RAPPORT D\'AUDIT DES EXPORTS INUTILISÉS');
  console.log('='.repeat(70));

  if (results.totalExports === 0) {
    console.log('✅ Aucun export inutilisé trouvé !');
    return;
  }

  console.log(`\n📁 Fichiers concernés : ${results.totalFiles}`);
  console.log(`🔍 Exports inutilisés : ${results.totalExports}`);
  console.log('\n' + '─'.repeat(70));

  // Afficher les détails par fichier
  for (const fileData of results.unusedExports) {
    console.log(`\n📄 ${fileData.file}`);
    console.log(`   └─ Exports inutilisés : ${fileData.exports.join(', ')}`);
  }

  console.log('\n' + '─'.repeat(70));
  console.log('\n💡 Recommandations :');
  console.log('   • Supprimez les exports inutilisés pour nettoyer le code');
  console.log('   • Vérifiez si ces exports sont utilisés via des imports dynamiques');
  console.log('   • Considérez la création d\'un index.ts pour centraliser les exports');
  console.log('   • Utilisez des commentaires d\'ignorance si nécessaire : // ts-unused-exports:disable-next-line');
}

function generateReport(results) {
  const reportPath = './scripts/audit-unused-exports-report.json';
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: results.totalFiles,
      totalUnusedExports: results.totalExports
    },
    details: results.unusedExports,
    recommendations: [
      'Supprimez les exports inutilisés pour nettoyer le code',
      'Vérifiez si ces exports sont utilisés via des imports dynamiques',
      'Considérez la création d\'un index.ts pour centraliser les exports',
      'Utilisez des commentaires d\'ignorance si nécessaire'
    ]
  };

  // Créer le dossier scripts s'il n'existe pas
  const scriptsDir = path.dirname(reportPath);
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Rapport détaillé sauvegardé : ${reportPath}`);
}

function main() {
  console.log('🚀 Démarrage de l\'audit des exports inutilisés...\n');

  // Vérifier que ts-unused-exports est installé
  try {
    execSync('npx ts-unused-exports --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ ts-unused-exports n\'est pas installé. Installation en cours...');
    try {
      execSync('npm install -g ts-unused-exports', { stdio: 'inherit' });
      console.log('✅ ts-unused-exports installé avec succès !');
    } catch (installError) {
      console.error('❌ Impossible d\'installer ts-unused-exports :', installError.message);
      console.log('💡 Essayez : npm install -g ts-unused-exports');
      process.exit(1);
    }
  }

  // Exécuter l'audit
  const results = runTsUnusedExports();
  
  // Générer un rapport détaillé
  generateReport(results);

  // Conclusion
  console.log('\n' + '='.repeat(70));
  if (results.totalExports === 0) {
    console.log('🎉 Audit terminé : Aucun problème détecté !');
    process.exit(0);
  } else {
    console.log(`⚠️  Audit terminé : ${results.totalExports} exports inutilisés trouvés`);
    console.log('💡 Passez en revue les résultats et nettoyez votre codebase !');
    process.exit(1);
  }
}

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
  process.exit(1);
});

// Exécuter le script principal
if (require.main === module) {
  main();
}