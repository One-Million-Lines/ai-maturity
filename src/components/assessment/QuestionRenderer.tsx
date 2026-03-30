import type { AssessmentQuestion } from "@/types/assessment";
import { useAssessmentStore } from "@/store/assessmentStore";
import { SingleSelectCardGroup } from "./SingleSelectCardGroup";
import { MultiSelectCardGroup } from "./MultiSelectCardGroup";

interface QuestionRendererProps {
  question: AssessmentQuestion;
}

export function QuestionRenderer({ question }: QuestionRendererProps) {
  const answer = useAssessmentStore((s) => s.answers[question.id]);
  const setAnswer = useAssessmentStore((s) => s.setAnswer);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{question.title}</h3>
        {question.description && (
          <p className="mt-1 text-sm text-muted-foreground">{question.description}</p>
        )}
        {question.type === "multi_select" && question.rules?.maxSelections && (
          <p className="mt-1 text-xs text-muted-foreground">
            Select up to {question.rules.maxSelections}
          </p>
        )}
      </div>

      {question.type === "single_select" && (
        <SingleSelectCardGroup
          options={question.options}
          value={(answer as string) ?? null}
          onChange={(val) => setAnswer(question.id, val)}
        />
      )}

      {question.type === "multi_select" && (
        <MultiSelectCardGroup
          options={question.options}
          value={(answer as string[]) ?? []}
          onChange={(val) => setAnswer(question.id, val)}
          maxSelections={question.rules?.maxSelections}
          variant={question.ui?.variant === "pills" ? "pills" : "cards"}
        />
      )}
    </div>
  );
}
