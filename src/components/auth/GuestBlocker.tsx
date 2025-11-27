import { ReactNode } from "react";

interface GuestBlockerProps {
  children: ReactNode;
}

export const GuestBlocker = ({ children }: GuestBlockerProps) => {
  // GUEST MODE DISABLED - Always render children
  return <>{children}</>;
};
