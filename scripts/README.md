# Scripts d'Audit TypeScript

Cette collection de scripts permet d'auditer votre codebase TypeScript pour détecter les incohérences de contrats de données et les exports inutilisés.

## 📋 Scripts disponibles

### 🔍 `combined-audit.ts`
**Script principal** qui exécute tous les audits en une seule commande.

```bash
# Exécuter l'audit complet
npm run audit:combined

# Ou directement avec ts-node
npx ts-node scripts/combined-audit.ts
```

### 📊 `audit-unused-exports.js`
Détecte les exports inutilisés en utilisant `ts-unused-exports`.

```bash
npm run audit:unused-exports
```

### ⚠️ `detect-contract-mismatches.ts`
Détecte les incohérences de contrats de données :
- Utilisations de `Record<string, unknown>`
- Types `any` non sécurisés
- Fonctions `async` incompatibles

```bash
npm run audit:contract-mismatches
```

## 🚀 Installation

Les scripts utilisent des dépendances déjà présentes dans votre projet. Assurez-vous que ces packages sont installés :

```bash
# Installer ts-unused-exports si nécessaire
npm install --save-dev ts-unused-exports

# Installer ts-node si nécessaire
npm install --save-dev ts-node typescript
```

## 📊 Résultats

Les scripts génèrent des rapports détaillés :

- **`audit-report.json`** : Rapport complet de l'audit combiné
- **`audit-unused-exports-report.json`** : Détails sur les exports inutilisés

### Exemple de rapport

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "unusedExports": {
    "totalFiles": 3,
    "totalExports": 5,
    "details": [
      {
        "file": "src/types/article.ts",
        "exports": ["ArticleBlock", "ArticleMeta"]
      }
    ]
  },
  "contractMismatches": {
    "found": true,
    "recordStringUnknown": 2,
    "anyTypes": 1,
    "asyncVoidMismatches": 1
  },
  "recommendations": [
    "🗑️  Nettoyez les exports inutilisés",
    "🎯 Remplacez Record<string, unknown> par des types spécifiques"
  ]
}
```

## 🔧 Configuration

Vous pouvez modifier les constantes dans les scripts pour adapter l'audit à vos besoins :

```typescript
const CONFIG = {
  TSCONFIG_PATH: './tsconfig.json',
  EXCLUDE_PATHS: ['node_modules', '.git', 'dist'],
  IGNORE_TEST_FILES: true,
  SHOW_LINE_NUMBERS: true,
};
```

## 🔄 Intégration CI/CD

### GitHub Actions

```yaml
name: TypeScript Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run TypeScript Audit
        run: npm run audit:combined
```

### GitLab CI

```yaml
audit:typescript:
  stage: test
  script:
    - npm ci
    - npm run audit:combined
  artifacts:
    reports:
      junit: scripts/audit-report.json
```

## 💡 Bonnes pratiques

1. **Exécutez régulièrement** ces audits pour maintenir la qualité du code
2. **Corrigez progressivement** les problèmes détectés
3. **Intégrez dans votre CI/CD** pour détecter les régressions
4. **Utilisez des types spécifiques** plutôt que `Record<string, unknown>`
5. **Évitez le type `any`** - préférez `unknown` avec validation

## 🎯 Objectifs

Ces scripts vous aident à :

- ✅ **Maintenir la propreté** de votre codebase TypeScript
- 🔍 **Détecter les incohérences** de contrats de données
- 📊 **Identifier les exports morts** qui encombrent le code
- 🚀 **Améliorer la maintenabilité** du projet
- 🔒 **Renforcer la sécurité des types** à la compilation

## 📞 Support

Si vous rencontrez des problèmes avec ces scripts :

1. Vérifiez que votre `tsconfig.json` est valide
2. Assurez-vous que toutes les dépendances sont installées
3. Exécutez les scripts individuellement pour isoler les problèmes
4. Consultez les rapports générés pour plus de détails