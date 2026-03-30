import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import questionsConfig from "@/config/questions.json";
import { useAssessmentStore } from "@/store/assessmentStore";

export function ProgressSidebar() {
  const currentSectionIndex = useAssessmentStore((s) => s.session.currentSectionIndex);
  const isSectionComplete = useAssessmentStore((s) => s.isSectionComplete);
  const goToSection = useAssessmentStore((s) => s.goToSection);
  const sections = questionsConfig.sections;

  return (
    <nav className="space-y-1">
      {sections.map((section, index) => {
        const isActive = index === currentSectionIndex;
        const isComplete = isSectionComplete(section.id);
        const isPast = index < currentSectionIndex;

        return (
          <button
            key={section.id}
            onClick={() => goToSection(index)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded text-left text-sm transition-colors cursor-pointer",
              isActive && "bg-primary/10 text-primary font-medium",
              !isActive && isPast && "text-foreground hover:bg-muted",
              !isActive && !isPast && "text-muted-foreground hover:bg-muted"
            )}
          >
            <div
              className={cn(
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium",
                isComplete && "bg-success text-success-foreground",
                isActive && !isComplete && "bg-primary text-primary-foreground",
                !isActive && !isComplete && "bg-muted text-muted-foreground"
              )}
            >
              {isComplete ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span className="truncate">{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
}
