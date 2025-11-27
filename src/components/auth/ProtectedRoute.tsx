import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // AUTH DISABLED - Always render children
  return <>{children}</>;
};
