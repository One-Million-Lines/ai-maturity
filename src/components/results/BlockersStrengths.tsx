import { AlertTriangle, TrendingUp } from "lucide-react";
import type { Blocker, Strength } from "@/types/assessment";

export function BlockersList({ blockers }: { blockers: Blocker[] }) {
  if (blockers.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        Top Blockers
      </h4>
      <div className="space-y-2">
        {blockers.map((b) => (
          <div key={b.id} className="flex items-center justify-between rounded bg-destructive/5 border border-destructive/10 px-4 py-3">
            <span className="text-sm">{b.label}</span>
            <span className="text-xs font-semibold text-destructive">Severity: {b.severity}/10</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StrengthsList({ strengths }: { strengths: Strength[] }) {
  if (strengths.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-success" />
        Key Strengths
      </h4>
      <div className="space-y-2">
        {strengths.map((s) => (
          <div key={s.id} className="flex items-center rounded bg-success/5 border border-success/10 px-4 py-3">
            <span className="text-sm">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
