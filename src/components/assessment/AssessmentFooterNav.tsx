import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

interface AssessmentFooterNavProps {
  onPrev: () => void;
  onNext: () => void;
  onComplete: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
}

export function AssessmentFooterNav({ onPrev, onNext, onComplete, isFirst, isLast, canProceed }: AssessmentFooterNavProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t">
      <Button variant="ghost" onClick={onPrev} disabled={isFirst}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>

      {isLast ? (
        <Button onClick={onComplete} disabled={!canProceed} size="lg">
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Complete Assessment
        </Button>
      ) : (
        <Button onClick={onNext}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
}
