import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface SingleSelectCardGroupProps {
  options: { id: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
}

export function SingleSelectCardGroup({ options, value, onChange }: SingleSelectCardGroupProps) {
  return (
    <div className="grid gap-3">
      {options.map((option) => {
        const isSelected = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all cursor-pointer",
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/30 hover:bg-muted/50"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
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
