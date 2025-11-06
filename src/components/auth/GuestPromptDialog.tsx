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
import { Clock, Heart } from "lucide-react";

interface GuestPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBlocked: boolean;
}

export const GuestPromptDialog = ({ open, onOpenChange, isBlocked }: GuestPromptDialogProps) => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/auth");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            {isBlocked ? (
              <Clock className="h-12 w-12 text-primary" />
            ) : (
              <Heart className="h-12 w-12 text-destructive" />
            )}
          </div>
          <DialogTitle className="text-center text-xl">
            {isBlocked ? "À bientôt !" : "Vous avez adoré notre contenu !"}
          </DialogTitle>
          <DialogDescription className="text-center space-y-3 pt-4">
            {isBlocked ? (
              <>
                <p className="text-base">
                  Votre temps de navigation en mode invité est écoulé pour aujourd'hui.
                </p>
                <p className="text-base font-medium text-foreground">
                  Revenez dans 24h pour 4 nouvelles minutes gratuites, ou créez votre compte
                  maintenant pour un accès illimité !
                </p>
              </>
            ) : (
              <>
                <p className="text-base">
                  Votre temps de navigation gratuite touche à sa fin ! 🎉
                </p>
                <p className="text-base font-medium text-foreground">
                  Créez votre compte maintenant pour continuer à profiter de tous nos contenus
                  sans limite !
                </p>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
          <Button
            onClick={handleCreateAccount}
            className="w-full"
            size="lg"
          >
            Créer mon compte gratuitement
          </Button>
          {isBlocked && (
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Je reviendrai dans 24h
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
