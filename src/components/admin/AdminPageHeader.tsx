import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  statusIndicator?: {
    label: string;
    color: "green" | "orange" | "blue" | "red";
  };
}

export const AdminPageHeader = ({
  title,
  description,
  icon: Icon,
  actions,
  statusIndicator,
}: AdminPageHeaderProps) => {
  const statusColors = {
    green: "bg-green-500",
    orange: "bg-orange-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="w-8 h-8 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {statusIndicator && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white px-3 py-1.5 rounded-full shadow-sm border">
            <div
              className={`w-2 h-2 rounded-full ${
                statusColors[statusIndicator.color]
              } animate-pulse`}
            />
            {statusIndicator.label}
          </div>
        )}
        {actions}
      </div>
    </div>
  );
};
