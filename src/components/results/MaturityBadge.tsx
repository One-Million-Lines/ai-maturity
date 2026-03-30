import { cn } from "@/lib/utils";
import { Shield, Zap, Crown, Sparkles, AlertTriangle } from "lucide-react";

interface MaturityBadgeProps {
  level: string;
  label: string;
}

const levelConfig: Record<string, { icon: typeof Shield; color: string; bg: string }> = {
  early: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
  developing: { icon: Zap, color: "text-warning", bg: "bg-warning/10" },
  intermediate: { icon: Shield, color: "text-primary", bg: "bg-primary/10" },
  advanced: { icon: Crown, color: "text-success", bg: "bg-success/10" },
};

export function MaturityBadge({ level, label }: MaturityBadgeProps) {
  const config = levelConfig[level] ?? levelConfig.early;
  const Icon = config.icon;

  return (
    <div className={cn("inline-flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold", config.bg, config.color)}>
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

interface ArchetypeCardProps {
  id: string;
  label: string;
  description?: string;
}

export function ArchetypeCard({ id, label, description }: ArchetypeCardProps) {
  return (
    <div className="rounded-md border bg-card p-6">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your Archetype</span>
      </div>
      <h3 className="text-xl font-bold">{label}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
