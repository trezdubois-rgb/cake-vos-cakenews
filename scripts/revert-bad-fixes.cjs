#!/usr/bin/env node

/**
 * Script pour annuler les mauvaises corrections
 * Remet les apostrophes normales dans le code JavaScript
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  srcDir: path.join(__dirname, '..', 'src'),
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  ignorePatterns: ['node_modules', 'dist', 'build', '.git'],
};

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

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Remplacer &apos; par ' dans le code JavaScript (pas dans le JSX)
    // Détecter les cas comme: case 'video&apos;:
    content = content.replace(/case\s+'([^']*?)&apos;([^']*?)'/g, "case '$1'$2'");
    content = content.replace(/case\s+"([^"]*?)&apos;([^"]*?)"/g, 'case "$1\'$2"');
    
    // Remplacer &apos; par ' dans les chaînes de caractères JavaScript
    content = content.replace(/'([^']*?)&apos;([^']*?)'/g, "'$1'$2'");
    
    // Remplacer &quot; par " dans les chaînes de caractères JavaScript
    content = content.replace(/"([^"]*?)&quot;([^"]*?)"/g, '"$1"$2"');
    
    // Remplacer &amp; par & dans les chaînes de caractères JavaScript
    content = content.replace(/"([^"]*?)&amp;([^"]*?)"/g, '"$1&$2"');
    content = content.replace(/'([^']*?)&amp;([^']*?)'/g, "'$1&$2'");

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, modified: true, file: filePath };
    }

    return { success: true, modified: false, file: filePath };
  } catch (error) {
    return { success: false, error: error.message, file: filePath };
  }
}

function main() {
  console.log('\n🔄 Annulation des mauvaises corrections\n');

  const files = getAllFiles(CONFIG.srcDir);
  let modifiedCount = 0;

  files.forEach((file) => {
    const result = fixFile(file);
    if (result.success && result.modified) {
      modifiedCount++;
      console.log(`✅ ${path.relative(CONFIG.srcDir, file)}`);
    }
  });

  console.log(`\n📊 ${modifiedCount} fichiers corrigés\n`);
}

main();

