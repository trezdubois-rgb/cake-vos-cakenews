import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

interface UseAuthRequiredReturn {
  isAuthenticated: boolean;
  showAuthDialog: boolean;
  setShowAuthDialog: (show: boolean) => void;
  requireAuth: (callback?: () => void) => boolean;
  featureLabel: string;
  setFeatureLabel: (label: string) => void;
}

/**
 * Hook pour gérer les actions nécessitant une authentification
 * Usage:
 * const { requireAuth, showAuthDialog, setShowAuthDialog, featureLabel } = useAuthRequired();
 * 
 * const handleLike = () => {
 *   if (!requireAuth(() => performLike())) return;
 *   performLike();
 * };
 */
export const useAuthRequired = (): UseAuthRequiredReturn => {
  const { isAuthenticated } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [featureLabel, setFeatureLabel] = useState("cette fonctionnalité");

  const requireAuth = useCallback((callback?: () => void): boolean => {
    if (isAuthenticated) {
      callback?.();
      return true;
    }
    setShowAuthDialog(true);
    return false;
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    showAuthDialog,
    setShowAuthDialog,
    requireAuth,
    featureLabel,
    setFeatureLabel,
  };
};
