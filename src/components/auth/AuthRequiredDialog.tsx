import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
}

export const AuthRequiredDialog = ({ 
  open, 
  onOpenChange, 
  feature = "cette fonctionnalité" 
}: AuthRequiredDialogProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onOpenChange(false);
    navigate("/auth");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">
            Connexion requise
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-4">
            <p className="text-base">
              Pour accéder à {feature}, vous devez être connecté.
            </p>
            <p className="text-sm text-muted-foreground">
              Créez un compte gratuitement pour profiter de toutes les fonctionnalités !
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
          <Button onClick={handleLogin} className="w-full" size="lg">
            <LogIn className="mr-2 h-4 w-4" />
            Se connecter / S'inscrire
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)} 
            className="w-full"
          >
            Continuer à lire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
