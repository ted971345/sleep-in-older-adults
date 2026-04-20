import type { FormativeFeedbackResult } from "../../types";

type FormativeFeedbackPanelProps = {
  feedback: FormativeFeedbackResult;
};

export const FormativeFeedbackPanel = ({
  feedback,
}: FormativeFeedbackPanelProps) => (
  <div className="formative-feedback">
    <div className="feedback-score">
      <span>Formative rubric score</span>
      <strong>
        {feedback.totalEarned}/{feedback.totalPossible}
      </strong>
    </div>

    <section className="feedback-section" aria-labelledby="domain-feedback">
      <h3 id="domain-feedback">Reasoning Domains</h3>
      <div className="domain-grid">
        {feedback.domains.map((domain) => (
          <article className="domain-card" key={domain.id}>
            <div className="domain-card__heading">
              <h4>{domain.label}</h4>
              <strong>
                {domain.earnedPoints}/{domain.maxPoints}
              </strong>
            </div>
            <p>
              {domain.earnedPoints >= Math.ceil(domain.maxPoints * 0.75)
                ? domain.proficientMessage
                : domain.developingMessage}
            </p>
            <p className="feedback-detail">
              Correctly identified:{" "}
              {domain.identifiedOptionIds.length > 0
                ? domain.identifiedOptionIds.length
                : "none yet"}
            </p>
            <p className="feedback-detail">
              Missed:{" "}
              {domain.missedOptionIds.length > 0
                ? domain.missedOptionIds.length
                : "none"}
            </p>
          </article>
        ))}
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
            <span>{item.wasAddressed ? "Seen in your plan" : "Add this lens"}</span>
          </article>
        ))}
      </div>
    </section>
  </div>
);
