import { useNavigate } from "react-router-dom";
import { useAssessmentStore } from "@/store/assessmentStore";
import questionsConfig from "@/config/questions.json";
import type { AssessmentQuestion } from "@/types/assessment";
import { ProgressSidebar } from "@/components/assessment/ProgressSidebar";
import { QuestionRenderer } from "@/components/assessment/QuestionRenderer";
import { AssessmentFooterNav } from "@/components/assessment/AssessmentFooterNav";
import { Progress } from "@/components/ui/progress";

export function AssessmentPage() {
  const navigate = useNavigate();
  const currentSectionIndex = useAssessmentStore((s) => s.session.currentSectionIndex);
  const nextSection = useAssessmentStore((s) => s.nextSection);
  const prevSection = useAssessmentStore((s) => s.prevSection);
  const completeAssessment = useAssessmentStore((s) => s.completeAssessment);
  const isAssessmentComplete = useAssessmentStore((s) => s.isAssessmentComplete);
  const isSectionComplete = useAssessmentStore((s) => s.isSectionComplete);

  const sections = questionsConfig.sections;
  const currentSection = sections[currentSectionIndex];
  const sectionQuestions = (questionsConfig.questions as AssessmentQuestion[]).filter(
    (q) => q.sectionId === currentSection.id
  );

  const isFirst = currentSectionIndex === 0;
  const isLast = currentSectionIndex === sections.length - 1;
  const progressPercentage = Math.round(((currentSectionIndex + 1) / sections.length) * 100);

  const handleComplete = () => {
    completeAssessment();
    navigate("/results");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Section {currentSectionIndex + 1} of {sections.length}
          </span>
          <span className="text-sm font-medium">{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ProgressSidebar />
          </div>
        </aside>

        {/* Main content */}
        <div className="min-w-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{currentSection.title}</h2>
            <p className="mt-1 text-muted-foreground">{currentSection.description}</p>
          </div>

          <div className="space-y-8">
            {sectionQuestions.map((question) => (
              <QuestionRenderer key={question.id} question={question} />
            ))}
          </div>

          <AssessmentFooterNav
            onPrev={prevSection}
            onNext={nextSection}
            onComplete={handleComplete}
            isFirst={isFirst}
            isLast={isLast}
            canProceed={isAssessmentComplete()}
          />
        </div>
      </div>
    </div>
  );
}
