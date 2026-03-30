import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
}

export function ScoreGauge({ score, label, size = "lg" }: ScoreGaugeProps) {
  const radius = size === "lg" ? 70 : 40;
  const stroke = size === "lg" ? 10 : 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  const color =
    score >= 80 ? "text-success" :
    score >= 60 ? "text-primary" :
    score >= 40 ? "text-warning" :
    "text-destructive";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted"
          />
          <circle
            cx={radius + stroke}
            cy={radius + stroke}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className={cn(color, "transition-all duration-1000 ease-out")}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", size === "lg" ? "text-4xl" : "text-xl")}>{score}</span>
        </div>
      </div>
      <span className={cn("font-medium text-muted-foreground", size === "lg" ? "text-sm" : "text-xs")}>{label}</span>
    </div>
  );
}
