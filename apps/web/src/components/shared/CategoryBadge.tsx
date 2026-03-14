import { RuleCategory } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: RuleCategory;
  className?: string;
}

const config: Record<RuleCategory, { label: string; className: string }> = {
  style: {
    label: "Estilo",
    className: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  },
  architecture: {
    label: "Arquitetura",
    className: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
  },
  security: {
    label: "Segurança",
    className: "bg-red-500/20 text-red-400 border border-red-500/30",
  },
  performance: {
    label: "Performance",
    className: "bg-green-500/20 text-green-400 border border-green-500/30",
  },
};

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const { label, className: categoryClass } = config[category];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryClass,
        className
      )}
    >
      {label}
    </span>
  );
}
