import { CaseCardsIllustration } from "../components/illustrations/CaseCardsIllustration";
import { ClinicalIcon, type ClinicalIconName } from "../components/visuals/ClinicalIcon";
import { cases } from "../data/cases";
import { formatMinutes } from "../utils/format";

const caseIconByTag: Record<string, ClinicalIconName> = {
  "normal-aging": "light",
  insomnia: "sleep",
  "sleep-apnea": "breathing",
  "restless-legs": "legs",
  medications: "medication",
  cognition: "cognition",
  falls: "mobility",
  nocturia: "safety",
};

export const CaseLibraryPage = () => (
  <section className="content-stack">
    <div className="section-heading">
      <div>
        <p className="eyebrow">Case library</p>
        <h1>Choose a reasoning pathway.</h1>
      </div>
      <CaseCardsIllustration />
    </div>

    <div className="card-grid">
      {cases.map((caseItem) => (
        <article className="case-card" key={caseItem.id}>
          <div className="case-card__visual">
            <ClinicalIcon
              name={caseIconByTag[caseItem.tags[0]] ?? "sleep"}
              label=""
            />
          </div>
          <div className="case-card__meta">
            <span>{caseItem.difficulty}</span>
            <span>{formatMinutes(caseItem.estimatedMinutes)}</span>
          </div>
          <h2>{caseItem.title}</h2>
          <p>{caseItem.teaser}</p>
          <div className="tag-row">
            {caseItem.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag.replace("-", " ")}
              </span>
            ))}
          </div>
          <a className="text-link" href={`#/case-player?id=${caseItem.id}`}>
            Start case
          </a>
        </article>
      ))}
    </div>
  </section>
);
