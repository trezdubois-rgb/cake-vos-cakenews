
export const PrivacyPolicyPage = () => {
  // On utilise un import dynamique ou une lecture de fichier pour charger le markdown
  // Ici, on simule le contenu statique
  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-lg mt-8">
      <h1 className="text-3xl font-bold mb-4">Politique de confidentialité</h1>
      <p className="mb-2">
        Votre vie privée est importante pour nous. Cette application ne collecte aucune donnée
        personnelle sans votre consentement explicite. Les notifications et fonctionnalités natives
        respectent les permissions accordées par l&apos;utilisateur. Pour toute question, contactez-nous
        à contact@cakevos.com.
      </p>
      <p className="text-muted-foreground">Dernière mise à jour : juin 2024</p>
    </div>
  );
};
