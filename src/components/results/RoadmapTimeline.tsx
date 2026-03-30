import { Calendar, ArrowRight } from "lucide-react";
import type { RoadmapItem } from "@/types/assessment";

interface RoadmapTimelineProps {
  roadmap: RoadmapItem[];
}

const phaseColors = [
  "border-primary bg-primary/5",
  "border-accent bg-accent/5",
  "border-success bg-success/5",
];

export function RoadmapTimeline({ roadmap }: RoadmapTimelineProps) {
  if (roadmap.length === 0) return null;

  return (
    <div className="space-y-6">
      {roadmap.map((phase, phaseIdx) => (
        <div key={phase.phase} className="relative">
          {/* Phase connector line */}
          {phaseIdx < roadmap.length - 1 && (
            <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-border" />
          )}

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-3">
              <h4 className="text-base font-semibold">{phase.phase}</h4>
              <div className="space-y-2">
                {phase.items.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 rounded border px-4 py-3 ${phaseColors[phaseIdx] || phaseColors[0]}`}
                  >
                    <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
