import type { CaseInfoItem, PatientProfile } from "../../types";

type CaseInformationPanelProps = {
  information: CaseInfoItem[];
  patient: PatientProfile;
};

export const CaseInformationPanel = ({
  information,
  patient,
}: CaseInformationPanelProps) => (
  <aside className="panel case-info-panel" aria-labelledby="patient-profile-heading">
    <h2 id="patient-profile-heading">Patient Snapshot</h2>
    <dl className="data-list">
      <div>
        <dt>Age</dt>
        <dd>{patient.age}</dd>
      </div>
      <div>
        <dt>Pronouns</dt>
        <dd>{patient.pronouns}</dd>
      </div>
      <div>
        <dt>Context</dt>
        <dd>{patient.livingSituation}</dd>
      </div>
    </dl>

    <h3>Revealed Information</h3>
    <div className="info-list">
      {information.map((item) => (
        <article className="info-item" key={item.id}>
          <p className="info-item__category">{item.category}</p>
          <h4>{item.label}</h4>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  </aside>
);
