import type { FormativeFeedbackResult } from "../../types";

type FormativeFeedbackPanelProps = {
  feedback: FormativeFeedbackResult;
};

const getCoverageRatio = (identifiedCount: number, targetCount: number) =>
  targetCount === 0 ? 0 : identifiedCount / targetCount;

export const FormativeFeedbackPanel = ({
  feedback,
}: FormativeFeedbackPanelProps) => {
  const addressedTargets = feedback.domains.reduce(
    (sum, domain) => sum + domain.identifiedOptionIds.length,
    0,
  );
  const totalTargets = feedback.domains.reduce(
    (sum, domain) => sum + domain.targetOptionIds.length,
    0,
  );

  return (
    <div className="formative-feedback">
      <div className="feedback-score">
        <span>Reasoning domain coverage</span>
        <strong>
          {addressedTargets}/{totalTargets} targets addressed
        </strong>
      </div>
      <p className="feedback-detail">
        This summary shows which instructor-defined reasoning targets appeared
        in your submitted choices. Step scores above still reflect accuracy,
        priority order, and lower-priority selections.
      </p>

      <section className="feedback-section" aria-labelledby="domain-feedback">
        <h3 id="domain-feedback">Reasoning Domains</h3>
        <div className="domain-grid">
          {feedback.domains.map((domain) => {
            const coverageRatio = getCoverageRatio(
              domain.identifiedOptionIds.length,
              domain.targetOptionIds.length,
            );

            return (
              <article className="domain-card" key={domain.id}>
                <div className="domain-card__heading">
                  <h4>{domain.label}</h4>
                  <strong>
                    {domain.identifiedOptionIds.length}/
                    {domain.targetOptionIds.length} targets
                  </strong>
                </div>
                <p>
                  {coverageRatio >= 0.75
                    ? domain.proficientMessage
                    : domain.developingMessage}
                </p>
                <p className="feedback-detail">
                  Addressed targets:{" "}
                  {domain.identifiedOptionIds.length > 0
                    ? domain.identifiedOptionIds.length
                    : "none yet"}
                </p>
                <p className="feedback-detail">
                  Missed targets:{" "}
                  {domain.missedOptionIds.length > 0
                    ? domain.missedOptionIds.length
                    : "none"}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="feedback-section" aria-labelledby="clue-feedback">
        <h3 id="clue-feedback">Why the Clues Matter</h3>
        <div className="clue-list">
          {feedback.diagnosticClues.map((clue) => (
            <article
              className={`clue-item${clue.wasAddressed ? " clue-item--addressed" : ""}`}
              key={clue.id}
            >
              <strong>
                {clue.wasAddressed ? "Addressed" : "Revisit"}: {clue.label}
              </strong>
              <p>{clue.explanation}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="feedback-section" aria-labelledby="four-ms-feedback">
        <h3 id="four-ms-feedback">4Ms-Inspired Review</h3>
        <div className="four-ms-grid">
          {feedback.fourMs.map((item) => (
            <article
              className={`four-ms-card${item.wasAddressed ? " four-ms-card--addressed" : ""}`}
              key={item.id}
            >
              <h4>{item.label}</h4>
              <p>{item.feedback}</p>
              <span>
                {item.wasAddressed ? "Seen in your plan" : "Add this lens"}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
