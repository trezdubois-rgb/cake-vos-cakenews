// Firebase Admin SDK - Cloud Function pour gérer les rôles
// Ce fichier doit être déployé comme Cloud Function

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Fonction pour définir un utilisateur comme admin
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Vérifier que l'appelant est déjà admin
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Seuls les admins peuvent attribuer des rôles');
  }

  const { uid } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID requis');
  }

  try {
    // Définir le custom claim
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    
    // Mettre à jour la base de données si nécessaire
    await admin.firestore().collection('users').doc(uid).update({
      role: 'admin',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'Rôle admin attribué avec succès' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\attribution du rôle');
  }
});

// Fonction pour retirer le rôle admin
exports.removeAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Seuls les admins peuvent retirer des rôles');
  }

  const { uid } = data;
  
  if (!uid) {
    throw new functions.https.HttpsError('invalid-argument', 'UID requis');
  }

  try {
    // Retirer le custom claim
    await admin.auth().setCustomUserClaims(uid, { role: 'user' });
    
    // Mettre à jour la base de données
    await admin.firestore().collection('users').doc(uid).update({
      role: 'user',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'Rôle admin retiré avec succès' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Erreur lors du retrait du rôle');
  }
});

// Fonction pour obtenir la liste des utilisateurs (admin uniquement)
exports.getUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Accès refusé');
  }

  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: user.customClaims?.role || 'user',
      createdAt: user.metadata.creationTime,
      lastLoginAt: user.metadata.lastSignInTime
    }));

    return { users };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Erreur lors de la récupération des utilisateurs');
  }
});