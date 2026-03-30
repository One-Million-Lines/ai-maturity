import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { DimensionKey } from "@/types/assessment";
import scoringConfig from "@/config/scoring.json";

interface DimensionRadarChartProps {
  scores: Record<DimensionKey, number>;
}

export function DimensionRadarChart({ scores }: DimensionRadarChartProps) {
  const dims: DimensionKey[] = ["foundation", "capability", "strategy", "adoption_governance"];
  const data = dims.map((dim) => ({
    dimension: scoringConfig.dimensions[dim].label,
    score: scores[dim],
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
