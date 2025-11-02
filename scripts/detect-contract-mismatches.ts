#!/usr/bin/env ts-node
/* eslint-disable */
import * as ts from 'typescript';
import * as path from 'path';
import * as fs from 'fs';

const TSCONFIG_PATH = './tsconfig.json';

function hasRecordStringUnknown(node: ts.Node, typeChecker: ts.TypeChecker): boolean {
  if (!ts.isTypeNode(node)) return false;
  const type = typeChecker.getTypeFromTypeNode(node);
  // On ne peut pas comparer directement à `Record<string, unknown>`,
  // donc on détecte les cas courants via la représentation textuelle (approximatif mais utile)
  const typeStr = typeChecker.typeToString(type);
  return typeStr.includes('Record<string, unknown>');
}

function hasAnyType(node: ts.Node, typeChecker: ts.TypeChecker): boolean {
  if (!ts.isTypeNode(node)) return false;
  const type = typeChecker.getTypeFromTypeNode(node);
  const typeStr = typeChecker.typeToString(type);
  return typeStr === 'any' || typeStr.includes('any');
}

function isAsyncFunctionWithVoidReturn(node: ts.Node, typeChecker: ts.TypeChecker): boolean {
  if (!ts.isFunctionLike(node)) return false;
  
  const isAsync = node.modifiers?.some(m => m.kind === ts.SyntaxKind.AsyncKeyword) ?? false;
  if (!isAsync) return false;

  const signature = typeChecker.getSignatureFromDeclaration(node);
  if (!signature) return false;

  const returnType = typeChecker.getReturnTypeOfSignature(signature);
  const returnTypeStr = typeChecker.typeToString(returnType);
  
  // Détecte les fonctions async qui retournent Promise<void> mais qui sont utilisées où void est attendu
  return returnTypeStr === 'Promise<void>';
}

function main() {
  console.log('🔍 Détection des incohérences de contrats de données...\n');

  // Lire le fichier tsconfig.json
  const configFile = ts.readConfigFile(TSCONFIG_PATH, ts.sys.readFile);
  if (configFile.error) {
    console.error('❌ Erreur lors de la lecture du tsconfig.json:', configFile.error.messageText);
    process.exit(1);
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config, 
    ts.sys, 
    path.dirname(TSCONFIG_PATH)
  );

  if (parsedConfig.errors.length > 0) {
    console.error('❌ Erreurs dans la configuration TypeScript:');
    parsedConfig.errors.forEach(error => {
      console.error(`   ${error.messageText}`);
    });
    process.exit(1);
  }

  // Créer le programme TypeScript
  const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
  const typeChecker = program.getTypeChecker();

  let foundIssues = false;
  let recordStringUnknownCount = 0;
  let anyTypeCount = 0;
  let asyncVoidMismatchCount = 0;

  // Parcourir tous les fichiers source
  for (const sourceFile of program.getSourceFiles()) {
    // Ignorer les fichiers node_modules et les fichiers de déclaration
    if (sourceFile.fileName.includes('node_modules') || sourceFile.fileName.endsWith('.d.ts')) {
      continue;
    }

    // Vérifier si le fichier existe (parfois des fichiers sont inclus mais n'existent pas)
    if (!fs.existsSync(sourceFile.fileName)) {
      continue;
    }

    ts.forEachChild(sourceFile, function visit(node) {
      // 1. Détecter les paramètres avec Record<string, unknown>
      if (ts.isParameter(node) && node.type) {
        if (hasRecordStringUnknown(node.type, typeChecker)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
          console.log(`⚠️  ${sourceFile.fileName}:${line + 1}:${character + 1} : Paramètre avec Record<string, unknown>`);
          console.log(`   💡 Considérez d'utiliser un type spécifique à la place de Record<string, unknown>`);
          foundIssues = true;
          recordStringUnknownCount++;
        }
      }

      // 2. Détecter les utilisations de 'any'
      if (ts.isParameter(node) && node.type) {
        if (hasAnyType(node.type, typeChecker)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
          console.log(`🚫 ${sourceFile.fileName}:${line + 1}:${character + 1} : Paramètre avec type 'any'`);
          console.log(`   💡 Utilisez un type plus spécifique ou unknown`);
          foundIssues = true;
          anyTypeCount++;
        }
      }

      // 3. Détecter les fonctions async avec retour Promise<void> potentiellement problématiques
      if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node)) {
        if (isAsyncFunctionWithVoidReturn(node, typeChecker)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
          console.log(`🔍 ${sourceFile.fileName}:${line + 1}:${character + 1} : Fonction async retournant Promise<void>`);
          console.log(`   💡 Vérifiez la compatibilité si cette fonction est passée à une API synchrone`);
          foundIssues = true;
          asyncVoidMismatchCount++;
        }
      }

      // Vérifier les propriétés d'interface et les types d'alias
      if (ts.isPropertySignature(node) && node.type) {
        if (hasRecordStringUnknown(node.type, typeChecker)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
          console.log(`⚠️  ${sourceFile.fileName}:${line + 1}:${character + 1} : Propriété avec Record<string, unknown>`);
          foundIssues = true;
          recordStringUnknownCount++;
        }
        if (hasAnyType(node.type, typeChecker)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.pos);
          console.log(`🚫 ${sourceFile.fileName}:${line + 1}:${character + 1} : Propriété avec type 'any'`);
          foundIssues = true;
          anyTypeCount++;
        }
      }

      ts.forEachChild(node, visit);
    });
  }

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 Résumé de l\'analyse:');
  console.log('='.repeat(60));
  
  if (!foundIssues) {
    console.log('✅ Aucune incohérence de contrat de données détectée.');
  } else {
    console.log(`❌ Incohérences détectées:`);
    console.log(`   • Record<string, unknown> : ${recordStringUnknownCount}`);
    console.log(`   • Type 'any' : ${anyTypeCount}`);
    console.log(`   • Fonctions async Promise<void> : ${asyncVoidMismatchCount}`);
    console.log(`\n💡 Recommandations:`);
    console.log(`   • Remplacez Record<string, unknown> par des types spécifiques`);
    console.log(`   • Évitez le type 'any', utilisez 'unknown' avec validation`);
    console.log(`   • Assurez la compatibilité des types de retour async/await`);
  }
  
  console.log('\n✅ Analyse terminée.');
  
  // Retourner un code d'erreur si des problèmes sont trouvés (utile pour CI)
  process.exit(foundIssues ? 1 : 0);
}

// Gestion des erreurs
process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
  process.exit(1);
});

// Exécuter le script
if (require.main === module) {
  main();
}