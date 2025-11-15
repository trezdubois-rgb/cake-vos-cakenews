# Architecture du projet

Ce projet est organisé pour garantir modularité, évolutivité et maintenabilité :

- **src/components/** : Composants réutilisables, organisés par domaine (article, auth, editor, etc.)
- **src/pages/** : Pages principales de l’application, chaque page dans un fichier ou dossier dédié
- **src/hooks/** : Hooks personnalisés pour la logique métier et l’état
- **src/lib/** : Fonctions utilitaires et librairies spécifiques
- **src/data/** : Données mockées ou statiques
- **src/integrations/** : Intégrations externes (ex : Supabase)

## Conventions
- Utiliser TypeScript pour tous les fichiers
- Privilégier la composition de composants
- Documenter chaque hook et utilitaire
- Placer les tests dans `src/__tests__/` en suivant la structure des dossiers

## Évolution
- Ajouter chaque nouveau domaine dans un sous-dossier dédié
- Centraliser la configuration et les constantes dans `src/config/` si besoin
- Documenter toute nouvelle fonctionnalité dans ce fichier
