import type { ReasoningStep, StepEvaluation } from "../../types";
import { getDisplayOptions, getStepTargets } from "../../utils/casePlayerEngine";

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
  const displayOptions = getDisplayOptions(step);

  return (
    <div className="step-feedback" aria-live="polite">
      <h3>Feedback</h3>
      {evaluation.possible > 0 && (
        <p>
          Score for this step: {evaluation.earned} of {evaluation.possible}
          {evaluation.penalty > 0
            ? ` after ${evaluation.penalty} point${evaluation.penalty === 1 ? "" : "s"} for lower-value selections`
            : ""}
        </p>
      )}
      {evaluation.incorrectOptionIds.length > 0 && (
        <p className="feedback-caution">
          You selected some lower-priority or non-indicated items. In clinical
          reasoning, more is not always better.
        </p>
      )}
      <div className="feedback-list">
        {displayOptions.map((option) => {
          const selected = selectedOptionIds.includes(option.id);
          const target = targetIds.includes(option.id);

          if (!selected && !target) {
            return null;
          }

          return (
            <article className="feedback-item" key={option.id}>
              <strong>
                {selected && target
                  ? "Appropriate selection"
                  : selected
                    ? "Lower-priority selection"
                    : "Missed"}
                : {option.label}
              </strong>
              <p>{option.rationale}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
};
