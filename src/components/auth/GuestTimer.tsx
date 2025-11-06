import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GuestTimerProps {
  timeRemaining: number;
  formatTime: (seconds: number) => string;
}

export const GuestTimer = ({ timeRemaining, formatTime }: GuestTimerProps) => {
  const isLowTime = timeRemaining <= 60;

  return (
    <Badge
      variant={isLowTime ? "destructive" : "secondary"}
      className="fixed top-20 right-4 z-50 flex items-center gap-2 px-3 py-2 text-sm font-medium"
    >
      <Clock className="h-4 w-4" />
      <span>{formatTime(timeRemaining)}</span>
    </Badge>
  );
};
