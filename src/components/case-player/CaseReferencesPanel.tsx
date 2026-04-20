import { references } from "../../data/references";

type CaseReferencesPanelProps = {
  referenceIds: string[];
};

export const CaseReferencesPanel = ({
  referenceIds,
}: CaseReferencesPanelProps) => {
  const caseReferences = referenceIds
    .map((referenceId) =>
      references.find((reference) => reference.id === referenceId),
    )
    .filter((reference) => reference !== undefined);

  return (
    <section className="panel reference-panel" aria-labelledby="case-references">
      <h2 id="case-references">Case References</h2>
      <div className="reference-list">
        {caseReferences.map((reference) => (
          <article className="reference-item" key={reference.id}>
            <h3>{reference.title}</h3>
            <p>
              {reference.authors.join(", ")}. {reference.source}.{" "}
              {reference.year}.
            </p>
            {reference.url && (
              <a className="text-link" href={reference.url}>
                Open reference
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};
