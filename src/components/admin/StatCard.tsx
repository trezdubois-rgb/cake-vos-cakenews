import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "green" | "orange" | "teal" | "blue" | "purple" | "red";
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

const colorConfig = {
  green: {
    bg: "bg-[#2ecc71]",
    iconBg: "bg-green-100",
    iconColor: "text-[#2ecc71]",
    textLight: "text-green-100",
    accent: "bg-white/20",
  },
  orange: {
    bg: "bg-[#f39c12]",
    iconBg: "bg-orange-100",
    iconColor: "text-[#f39c12]",
    textLight: "text-orange-100",
    accent: "bg-white/20",
  },
  teal: {
    bg: "bg-[#1abc9c]",
    iconBg: "bg-teal-100",
    iconColor: "text-[#1abc9c]",
    textLight: "text-teal-100",
    accent: "bg-white/20",
  },
  blue: {
    bg: "bg-[#3498db]",
    iconBg: "bg-blue-100",
    iconColor: "text-[#3498db]",
    textLight: "text-blue-100",
    accent: "bg-white/20",
  },
  purple: {
    bg: "bg-[#9b59b6]",
    iconBg: "bg-purple-100",
    iconColor: "text-[#9b59b6]",
    textLight: "text-purple-100",
    accent: "bg-white/20",
  },
  red: {
    bg: "bg-[#e74c3c]",
    iconBg: "bg-red-100",
    iconColor: "text-[#e74c3c]",
    textLight: "text-red-100",
    accent: "bg-white/20",
  },
};

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  trend,
  className,
}: StatCardProps) => {
  const colors = colorConfig[color];

  return (
    <div
      className={cn(
        colors.bg,
        "rounded-lg shadow-lg p-6 text-white relative overflow-hidden group transition-all hover:-translate-y-1 cursor-default",
        className
      )}
    >
      <div className="relative z-10">
        <h3 className="text-4xl font-bold mb-1">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
        <p className={cn(colors.textLight, "font-medium uppercase tracking-wider text-xs")}>
          {title}
        </p>
        {(subtitle || trend) && (
          <div className={cn("mt-4 flex items-center gap-2 text-sm", colors.textLight, colors.accent, "w-fit px-2 py-1 rounded")}>
            <Icon size={14} />
            <span>{subtitle || trend?.value}</span>
          </div>
        )}
      </div>
      <Icon className="absolute -right-4 -bottom-4 w-32 h-32 text-white/20 group-hover:scale-110 transition-transform" />
    </div>
  );
};

// Variant: Compact stat card for smaller displays or secondary stats
interface CompactStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "green" | "orange" | "teal" | "blue" | "purple" | "red";
  borderPosition?: "left" | "top";
}

export const CompactStatCard = ({
  title,
  value,
  icon: Icon,
  color,
  borderPosition = "left",
}: CompactStatCardProps) => {
  const colors = colorConfig[color];
  const borderClass =
    borderPosition === "left"
      ? `border-l-4 border-l-[${color === "green" ? "#2ecc71" : color === "orange" ? "#f39c12" : color === "teal" ? "#1abc9c" : color === "blue" ? "#3498db" : color === "purple" ? "#9b59b6" : "#e74c3c"}]`
      : `border-t-4 border-t-[${color === "green" ? "#2ecc71" : color === "orange" ? "#f39c12" : color === "teal" ? "#1abc9c" : color === "blue" ? "#3498db" : color === "purple" ? "#9b59b6" : "#e74c3c"}]`;

  return (
    <div className={cn("bg-white shadow-sm rounded-lg p-4 flex items-center gap-4", borderClass)}>
      <div className={cn(colors.iconBg, "p-3 rounded-lg")}>
        <Icon className={cn("w-6 h-6", colors.iconColor)} />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-slate-700">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
    </div>
  );
};
