import { cn } from "@/lib/utils";
import type { DimensionKey } from "@/types/assessment";
import scoringConfig from "@/config/scoring.json";

interface DimensionScoreBarProps {
  dimension: DimensionKey;
  score: number;
}

const colorMap: Record<DimensionKey, string> = {
  foundation: "bg-chart-1",
  capability: "bg-chart-2",
  strategy: "bg-chart-3",
  adoption_governance: "bg-chart-4",
};

export function DimensionScoreBar({ dimension, score }: DimensionScoreBarProps) {
  const config = scoringConfig.dimensions[dimension];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{config.label}</span>
        <span className="text-sm font-semibold">{score}/100</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorMap[dimension])}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface DimensionScoreCardsProps {
  scores: Record<DimensionKey, number>;
}

export function DimensionScoreCards({ scores }: DimensionScoreCardsProps) {
  const dims: DimensionKey[] = ["foundation", "capability", "strategy", "adoption_governance"];
  return (
    <div className="space-y-4">
      {dims.map((dim) => (
        <DimensionScoreBar key={dim} dimension={dim} score={scores[dim]} />
      ))}
    </div>
  );
}
