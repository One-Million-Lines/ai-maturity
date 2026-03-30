import { Lightbulb } from "lucide-react";
import type { Recommendation } from "@/types/assessment";

interface RecommendationsGridProps {
  recommendations: Recommendation[];
}

const categoryColors: Record<string, string> = {
  "Foundation": "border-l-chart-1",
  "Execution": "border-l-chart-2",
  "Governance": "border-l-chart-4",
  "Prioritization": "border-l-chart-3",
  "Roadmap": "border-l-primary",
  "Use Cases": "border-l-accent",
};

export function RecommendationsGrid({ recommendations }: RecommendationsGridProps) {
  if (recommendations.length === 0) return null;

  // Group by category
  const grouped = recommendations.reduce<Record<string, Recommendation[]>>((acc, rec) => {
    if (!acc[rec.category]) acc[rec.category] = [];
    acc[rec.category].push(rec);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, recs]) => (
        <div key={category}>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />
            {category}
          </h4>
          <div className="space-y-2">
            {recs.map((rec, i) => (
              <div
                key={`${rec.id}-${i}`}
                className={`rounded border bg-card px-4 py-3 border-l-4 ${categoryColors[category] || "border-l-primary"}`}
              >
                <p className="text-sm">{rec.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
