

export const verifyAdminSecret = async (secretCode: string) => {
  try {
    const ADMIN_SECRET_CODE = import.meta.env.VITE_ADMIN_SECRET_CODE ?? 'cake-admin-123';
    
    if (secretCode !== ADMIN_SECRET_CODE) {
      return { success: false, error: 'Code secret incorrect' };
    }
    
    // Générer un token temporaire (valide 5 minutes)
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Stocker le token en session pour validation ultérieure
    sessionStorage.setItem('admin_temp_token', token);
    
    return { success: true, token };
  } catch (_error) {
    console.error('Error verifying admin secret:', error);
    return { success: false, error: 'Erreur lors de la vérification' };
  }
};