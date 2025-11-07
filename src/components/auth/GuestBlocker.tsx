import { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGuestMode } from "@/hooks/useGuestMode";

interface GuestBlockerProps {
  children: ReactNode;
}

export const GuestBlocker = ({ children }: GuestBlockerProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isBlocked, timeRemaining } = useGuestMode();

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté et n'est pas sur la page d'accueil
    if (!user && location.pathname !== "/" && location.pathname !== "/auth") {
      navigate("/");
    }

    // Si l'utilisateur invité est bloqué ou n'a plus de temps
    if (!user && (isBlocked || timeRemaining <= 0) && location.pathname !== "/auth") {
      navigate("/");
    }
  }, [user, location.pathname, navigate, isBlocked, timeRemaining]);

  return <>{children}</>;
};
