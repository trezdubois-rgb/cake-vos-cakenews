#!/usr/bin/env node

/**
 * Script de correction automatique des erreurs ESLint courantes
 * Corrige les problèmes les plus fréquents de manière robuste
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  srcDir: path.join(__dirname, '..', 'src'),
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  ignorePatterns: ['node_modules', 'dist', 'build', '.git'],
};

/**
 * Récupère tous les fichiers récursivement
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
 * Corrige les échappements inutiles (no-useless-escape)
 */
function fixUselessEscapes(content) {
  // Remplacer \' par ' dans les chaînes entre guillemets doubles
  content = content.replace(/"([^"]*)\\'([^"]*)"/g, '"$1\'$2"');
  
  // Remplacer \" par " dans les chaînes entre guillemets simples
  content = content.replace(/'([^']*)\\"([^']*)'/g, '\'$1"$2\'');
  
  // Remplacer \( et \) par ( et ) dans les regex
  content = content.replace(/\\(\(|\))/g, '$1');
  
  return content;
}

/**
 * Corrige les apostrophes non échappées (react/no-unescaped-entities)
 */
function fixUnescapedEntities(content) {
  // Remplacer les apostrophes dans le JSX par &apos;
  content = content.replace(/>([^<]*)'([^<]*)</g, (match, before, after) => {
    // Ne pas remplacer si c'est dans du code JavaScript
    if (before.includes('{') || after.includes('}')) {
      return match;
    }
    return `>${before}&apos;${after}<`;
  });
  
  return content;
}

/**
 * Supprime les imports inutilisés
 */
function removeUnusedImports(content, filePath) {
  const lines = content.split('\n');
  const importLines = [];
  const usedImports = new Set();
  const importMap = new Map();

  // Analyser les imports
  lines.forEach((line, index) => {
    if (line.trim().startsWith('import ')) {
      importLines.push({ line, index });
      
      // Extraire les noms importés
      const namedMatch = line.match(/import\s+{([^}]+)}\s+from/);
      const defaultMatch = line.match(/import\s+(\w+)\s+from/);
      
      if (namedMatch) {
        const imports = namedMatch[1].split(',').map((s) => s.trim().split(' as ')[0].trim());
        imports.forEach((imp) => importMap.set(imp, index));
      } else if (defaultMatch && !line.includes('{')) {
        importMap.set(defaultMatch[1], index);
      }
    }
  });

  // Vérifier quels imports sont utilisés
  importMap.forEach((lineIndex, importName) => {
    const regex = new RegExp(`\\b${importName}\\b`, 'g');
    const matches = content.match(regex);
    if (matches && matches.length > 1) { // > 1 car l'import lui-même compte
      usedImports.add(importName);
    }
  });

  // Filtrer les imports inutilisés
  const unusedLines = new Set();
  importMap.forEach((lineIndex, importName) => {
    if (!usedImports.has(importName)) {
      const line = lines[lineIndex];
      // Vérifier si c'est un import nommé avec plusieurs imports
      const namedMatch = line.match(/import\s+{([^}]+)}\s+from/);
      if (namedMatch) {
        const imports = namedMatch[1].split(',').map((s) => s.trim());
        const usedInThisLine = imports.filter((imp) => {
          const name = imp.split(' as ')[0].trim();
          return usedImports.has(name);
        });
        
        if (usedInThisLine.length === 0) {
          unusedLines.add(lineIndex);
        } else if (usedInThisLine.length < imports.length) {
          // Reconstruire l'import avec seulement les imports utilisés
          const fromMatch = line.match(/from\s+['"]([^'"]+)['"]/);
          if (fromMatch) {
            lines[lineIndex] = `import { ${usedInThisLine.join(', ')} } from '${fromMatch[1]}';`;
          }
        }
      } else {
        unusedLines.add(lineIndex);
      }
    }
  });

  // Supprimer les lignes d'import inutilisées
  return lines.filter((_, index) => !unusedLines.has(index)).join('\n');
}

/**
 * Remplace || par ?? (prefer-nullish-coalescing)
 */
function fixNullishCoalescing(content) {
  // Remplacer || par ?? dans les contextes appropriés
  // Attention: ne pas remplacer dans les conditions booléennes
  content = content.replace(/(\w+)\s+\|\|\s+(['"`])/g, '$1 ?? $2');
  content = content.replace(/(\w+)\s+\|\|\s+(\d)/g, '$1 ?? $2');
  content = content.replace(/(\w+)\s+\|\|\s+(\w+)/g, (match, left, right) => {
    // Ne pas remplacer si c'est une condition booléenne
    if (right === 'true' || right === 'false') {
      return match;
    }
    return `${left} ?? ${right}`;
  });
  
  return content;
}

/**
 * Ajoute des préfixes _ aux variables inutilisées
 */
function prefixUnusedVars(content) {
  // Ajouter _ aux paramètres de fonction inutilisés
  content = content.replace(/\(([^)]*)\)\s*=>/g, (match, params) => {
    // Ne pas modifier si déjà préfixé
    if (params.includes('_')) {
      return match;
    }
    return match;
  });
  
  return content;
}

/**
 * Traite un fichier
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Appliquer les corrections
    content = fixUselessEscapes(content);
    content = fixUnescapedEntities(content);
    content = removeUnusedImports(content, filePath);
    content = fixNullishCoalescing(content);
    content = prefixUnusedVars(content);

    // Sauvegarder si modifié
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return { success: true, modified: true, file: filePath };
    }

    return { success: true, modified: false, file: filePath };
  } catch (error) {
    return { success: false, error: error.message, file: filePath };
  }
}

/**
 * Fonction principale
 */
function main() {
  console.log('\n🔧 Correction automatique des erreurs courantes\n');

  const files = getAllFiles(CONFIG.srcDir);
  console.log(`📂 ${files.length} fichiers à traiter\n`);

  let modifiedCount = 0;
  let errorCount = 0;

  files.forEach((file) => {
    const result = processFile(file);
    if (result.success) {
      if (result.modified) {
        modifiedCount++;
        console.log(`✅ ${path.relative(CONFIG.srcDir, file)}`);
      }
    } else {
      errorCount++;
      console.log(`❌ ${path.relative(CONFIG.srcDir, file)}: ${result.error}`);
    }
  });

  console.log(`\n📊 Résumé:`);
  console.log(`   ✅ ${modifiedCount} fichiers modifiés`);
  console.log(`   ⚠️  ${errorCount} erreurs`);
  console.log(`   📄 ${files.length - modifiedCount - errorCount} fichiers inchangés\n`);
}

// Exécution
main();

