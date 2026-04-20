import { CasePlayer } from "../components/case-player/CasePlayer";
import { cases } from "../data/cases";

const getActiveCase = () => {
  const [, queryString = ""] = window.location.hash.split("?");
  const caseId = new URLSearchParams(queryString).get("id");
  return cases.find((caseItem) => caseItem.id === caseId) ?? cases[0];
};

export const CasePlayerPage = () => {
  const activeCase = getActiveCase();

  return (
    <section className="content-stack">
      <div className="section-heading section-heading--compact">
        <div>
          <p className="eyebrow">Case player</p>
          <h1>{activeCase.title}</h1>
          <p className="lead">{activeCase.initialSummary}</p>
        </div>
      </div>

      <CasePlayer caseItem={activeCase} key={activeCase.id} />
    </section>
  );
};
