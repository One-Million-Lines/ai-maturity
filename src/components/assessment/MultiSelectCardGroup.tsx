import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface MultiSelectCardGroupProps {
  options: { id: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  variant?: "cards" | "pills";
}

export function MultiSelectCardGroup({ options, value, onChange, maxSelections, variant = "cards" }: MultiSelectCardGroupProps) {
  const toggle = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((v) => v !== optionId));
    } else {
      if (maxSelections && value.length >= maxSelections) return;
      onChange([...value, optionId]);
    }
  };

  if (variant === "pills") {
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = value.includes(option.id);
          const isDisabled = !isSelected && maxSelections != null && value.length >= maxSelections;
          return (
            <button
              key={option.id}
              onClick={() => !isDisabled && toggle(option.id)}
              disabled={isDisabled}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:border-primary/30",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
            >
              {isSelected && <Check className="h-3.5 w-3.5" />}
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const isSelected = value.includes(option.id);
        const isDisabled = !isSelected && maxSelections != null && value.length >= maxSelections;
        return (
          <button
            key={option.id}
            onClick={() => !isDisabled && toggle(option.id)}
            disabled={isDisabled}
            className={cn(
              "relative flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all cursor-pointer",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/30 hover:bg-muted/50",
              isDisabled && "opacity-40 cursor-not-allowed"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors",
                isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
              )}
            >
              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
            </div>
            <span className={cn("text-sm", isSelected && "font-medium")}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
