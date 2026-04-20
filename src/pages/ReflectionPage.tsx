import { useState } from "react";
import { ReflectionIllustration } from "../components/illustrations/ReflectionIllustration";
import { ClinicalIcon } from "../components/visuals/ClinicalIcon";
import { cases } from "../data/cases";

type ReflectionFieldId =
  | "changedThinking"
  | "underusedLens"
  | "avoidRecommendation"
  | "nextQuestion";

const reflectionPrompts: Array<{
  id: ReflectionFieldId;
  label: string;
  prompt: string;
}> = [
  {
    id: "changedThinking",
    label: "Turning Point",
    prompt: "Which clue most changed your working diagnosis or priority?",
  },
  {
    id: "underusedLens",
    label: "4Ms Lens",
    prompt: "Which 4Ms domain did you underuse: What Matters, Medication, Mentation, or Mobility?",
  },
  {
    id: "avoidRecommendation",
    label: "Avoided Harm",
    prompt: "What recommendation would you avoid in this older adult, and why?",
  },
  {
    id: "nextQuestion",
    label: "Next Time",
    prompt: "What one follow-up question would you ask differently next time?",
  },
];

const getCaseFromHash = () => {
  const [, queryString = ""] = window.location.hash.split("?");
  const caseId = new URLSearchParams(queryString).get("caseId");
  return cases.find((caseItem) => caseItem.id === caseId) ?? cases[0];
};

export const ReflectionPage = () => {
  const activeCase = getCaseFromHash();
  const [confidence, setConfidence] = useState("3");
  const [responses, setResponses] = useState<Record<ReflectionFieldId, string>>({
    changedThinking: "",
    underusedLens: "",
    avoidRecommendation: "",
    nextQuestion: "",
  });

  const updateResponse = (fieldId: ReflectionFieldId, value: string) => {
    setResponses((current) => ({
      ...current,
      [fieldId]: value,
    }));
  };

  return (
    <section className="content-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Reflection workspace</p>
          <h1>Turn case decisions into durable learning.</h1>
          <p className="lead">
            Complete a short reflection, calibrate confidence, and prepare a
            discussion card for classroom debrief.
          </p>
        </div>
        <ReflectionIllustration />
      </div>

      <div className="reflection-workspace">
        <article className="panel reflection-brief">
          <div className="reflection-brief__heading">
            <ClinicalIcon name="cognition" />
            <div>
              <p className="eyebrow">Completed case</p>
              <h2>{activeCase.title}</h2>
              <p>{activeCase.summary}</p>
            </div>
          </div>

          <div className="reflection-teaching-grid">
            <section>
              <h3>Key Teaching Points</h3>
              <ul>
                {activeCase.educationalFeedback.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Reasoning Pathways</h3>
              <ul>
                {activeCase.reasoningPathways.slice(0, 3).map((pathway) => (
                  <li key={pathway}>{pathway}</li>
                ))}
              </ul>
            </section>
          </div>
        </article>

        <article className="panel reflection-form-panel">
          <h2>Individual Reflection</h2>
          <div className="reflection-field-grid">
            {reflectionPrompts.map((item) => (
              <label className="reflection-field" key={item.id}>
                <span>{item.label}</span>
                <strong>{item.prompt}</strong>
                <textarea
                  maxLength={360}
                  onChange={(event) => updateResponse(item.id, event.target.value)}
                  rows={4}
                  value={responses[item.id]}
                />
              </label>
            ))}
          </div>

          <fieldset className="confidence-check">
            <legend>Confidence Check</legend>
            <p>How confident are you in your final reasoning plan?</p>
            <div className="confidence-options">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value}>
                  <input
                    checked={confidence === String(value)}
                    name="confidence"
                    onChange={() => setConfidence(String(value))}
                    type="radio"
                    value={value}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </article>

        <aside className="discussion-card" aria-labelledby="discussion-card-title">
          <div className="discussion-card__header">
            <ClinicalIcon name="safety" />
            <div>
              <p className="eyebrow">Discussion card</p>
              <h2 id="discussion-card-title">{activeCase.title}</h2>
            </div>
          </div>

          <dl className="discussion-card__meta">
            <div>
              <dt>Confidence</dt>
              <dd>{confidence}/5</dd>
            </div>
            <div>
              <dt>Difficulty</dt>
              <dd>{activeCase.difficulty}</dd>
            </div>
          </dl>

          <section>
            <h3>Priority Watchpoints</h3>
            <ul>
              {activeCase.redFlags.slice(0, 3).map((redFlag) => (
                <li key={redFlag}>{redFlag}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Top Priorities</h3>
            <ul>
              {activeCase.recommendedPriorities.slice(0, 3).map((priority) => (
                <li key={priority}>{priority}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Classroom Share</h3>
            <p>
              <strong>Turning point:</strong>{" "}
              {responses.changedThinking || "Not yet captured."}
            </p>
            <p>
              <strong>4Ms lens:</strong>{" "}
              {responses.underusedLens || "Not yet captured."}
            </p>
            <p>
              <strong>Recommendation to avoid:</strong>{" "}
              {responses.avoidRecommendation || "Not yet captured."}
            </p>
            <p>
              <strong>Next question:</strong>{" "}
              {responses.nextQuestion || "Not yet captured."}
            </p>
          </section>

          <div className="action-row">
            <a className="button" href={`#/case-player?id=${activeCase.id}`}>
              Revisit case
            </a>
            <a className="button button--secondary" href="#/cases">
              Choose another case
            </a>
          </div>
        </aside>
      </div>
    </section>
  );
};
