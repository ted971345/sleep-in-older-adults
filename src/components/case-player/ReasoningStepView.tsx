import type {
  FormativeFeedbackResult,
  ReasoningStep,
  StepEvaluation,
} from "../../types";
import { canSubmitStep } from "../../utils/casePlayerEngine";
import { FormativeFeedbackPanel } from "./FormativeFeedbackPanel";
import { OptionControl } from "./OptionControl";
import { StepFeedback } from "./StepFeedback";

type ReasoningStepViewProps = {
  activeIndex: number;
  evaluation?: StepEvaluation;
  formativeFeedback?: FormativeFeedbackResult;
  isLastStep: boolean;
  onBack: () => void;
  onContinue: () => void;
  onReset: () => void;
  onSelect: (optionId: string) => void;
  selectedOptionIds: string[];
  step: ReasoningStep;
  stepCount: number;
  submitted: boolean;
};

export const ReasoningStepView = ({
  activeIndex,
  evaluation,
  formativeFeedback,
  isLastStep,
  onBack,
  onContinue,
  onReset,
  onSelect,
  selectedOptionIds,
  step,
  stepCount,
  submitted,
}: ReasoningStepViewProps) => {
  const readyToSubmit = canSubmitStep(step, selectedOptionIds);
  const showCompletion = submitted && step.kind !== "feedback";

  return (
    <article className="panel panel--primary reasoning-step">
      <div className="step-kicker">
        <span>
          Step {activeIndex + 1} of {stepCount}
        </span>
        <span>{step.kind.replace("-", " ")}</span>
      </div>
      <h2>{step.title}</h2>
      <p>{step.instruction}</p>

      {step.kind === "follow-up" && (
        <p className="selection-guidance">
          Select {step.minSelections} to {step.maxSelections} questions.
        </p>
      )}

      {step.kind === "prioritization" && (
        <p className="selection-guidance">
          Select actions in priority order. The number marks your sequence.
        </p>
      )}

      {"options" in step && (
        <div className="option-list">
          {step.options.map((option) => (
            <OptionControl
              checked={selectedOptionIds.includes(option.id)}
              disabled={submitted}
              key={option.id}
              kind={step.kind}
              name={step.id}
              onChange={onSelect}
              option={option}
              order={
                step.kind === "prioritization" &&
                selectedOptionIds.includes(option.id)
                  ? selectedOptionIds.indexOf(option.id) + 1
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {step.kind === "feedback" && (
        <>
          <div className="structured-summary">
            <h3>Case Takeaway</h3>
            <p>{step.summary}</p>
          </div>
          {formativeFeedback && (
            <FormativeFeedbackPanel feedback={formativeFeedback} />
          )}
        </>
      )}

      {submitted && evaluation && (
        <StepFeedback
          evaluation={evaluation}
          selectedOptionIds={selectedOptionIds}
          step={step}
        />
      )}

      {showCompletion && (
        <div className="completion-note" aria-live="polite">
          <svg
            aria-hidden="true"
            className="completion-note__mark"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="21" />
            <path d="M15 24.5 21.5 31 34 17" />
          </svg>
          <span>Step submitted. Review the feedback, then continue.</span>
        </div>
      )}

      <div className="player-actions">
        <button
          className="button button--secondary"
          disabled={activeIndex === 0}
          onClick={onBack}
          type="button"
        >
          Back
        </button>
        <button className="button button--secondary" onClick={onReset} type="button">
          Reset case
        </button>
        <button
          className="button"
          disabled={!readyToSubmit}
          onClick={onContinue}
          type="button"
        >
          {submitted || step.kind === "feedback"
            ? isLastStep
              ? "Finish"
              : "Continue"
            : "Submit"}
        </button>
      </div>
    </article>
  );
};
