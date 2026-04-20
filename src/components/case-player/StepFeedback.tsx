import type { ReasoningStep, StepEvaluation } from "../../types";
import { getStepTargets } from "../../utils/casePlayerEngine";

type StepFeedbackProps = {
  evaluation: StepEvaluation;
  selectedOptionIds: string[];
  step: ReasoningStep;
};

export const StepFeedback = ({
  evaluation,
  selectedOptionIds,
  step,
}: StepFeedbackProps) => {
  if (step.kind === "feedback") {
    return null;
  }

  const targetIds = getStepTargets(step);

  return (
    <div className="step-feedback" aria-live="polite">
      <h3>Feedback</h3>
      {evaluation.possible > 0 && (
        <p>
          Score for this step: {evaluation.earned} of {evaluation.possible}
        </p>
      )}
      <div className="feedback-list">
        {step.options.map((option) => {
          const selected = selectedOptionIds.includes(option.id);
          const target = targetIds.includes(option.id);

          if (!selected && !target) {
            return null;
          }

          return (
            <article className="feedback-item" key={option.id}>
              <strong>
                {selected ? "Selected" : "Missed"}: {option.label}
              </strong>
              <p>{option.rationale}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};
