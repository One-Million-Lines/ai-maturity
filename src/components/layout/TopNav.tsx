import { Link, useLocation } from "react-router-dom";
import { Brain, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAssessmentStore } from "@/store/assessmentStore";

export function TopNav() {
  const location = useLocation();
  const resetAssessment = useAssessmentStore((s) => s.resetAssessment);
  const hasAnswers = Object.keys(useAssessmentStore((s) => s.answers)).length > 0;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Brain className="h-6 w-6 text-primary" />
          <span>AI Maturity</span>
        </Link>

        <nav className="flex items-center gap-4">
          {location.pathname !== "/" && (
            <Link to="/">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
          )}
          {hasAnswers && (
            <Button variant="ghost" size="sm" onClick={resetAssessment} className="text-muted-foreground">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
