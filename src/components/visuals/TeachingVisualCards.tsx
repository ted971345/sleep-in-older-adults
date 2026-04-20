import { ClinicalIcon, type ClinicalIconName } from "./ClinicalIcon";

type TeachingVisual = {
  title: string;
  copy: string;
  icon: ClinicalIconName;
  metric: string;
};

const teachingVisuals: TeachingVisual[] = [
  {
    title: "Sleep fragmentation",
    copy: "Map awakenings to function, nocturia, pain, breathing, and medication timing.",
    icon: "sleep",
    metric: "Pattern",
  },
  {
    title: "Circadian rhythm",
    copy: "Separate advanced timing from insomnia disorder and unsafe sleepiness.",
    icon: "light",
    metric: "Timing",
  },
  {
    title: "Obstructive sleep apnea (OSA) mechanism",
    copy: "Connect airway obstruction, arousals, oxygen stress, and cardiometabolic risk.",
    icon: "breathing",
    metric: "Airflow",
  },
  {
    title: "Restless legs syndrome (RLS) clues",
    copy: "Look for urge to move, rest worsening, evening pattern, and movement relief.",
    icon: "legs",
    metric: "Movement",
  },
  {
    title: "Medication caution",
    copy: "Check anticholinergic and sedating burden before adding sleep medication.",
    icon: "medication",
    metric: "Burden",
  },
  {
    title: "Bedroom safety",
    copy: "Tie nighttime symptoms to lighting, bathroom route, falls, and mobility.",
    icon: "safety",
    metric: "Risk",
  },
];

export const TeachingVisualCards = () => (
  <section className="visual-learning" aria-labelledby="visual-learning-title">
    <div className="visual-learning__heading">
      <p className="eyebrow">Clinical pattern map</p>
      <h2 id="visual-learning-title">Visual anchors for case reasoning</h2>
    </div>
    <div className="visual-card-grid">
      {teachingVisuals.map((visual) => (
        <article className="visual-card" key={visual.title}>
          <div className="visual-card__topline">
            <ClinicalIcon name={visual.icon} />
            <span>{visual.metric}</span>
          </div>
          <h3>{visual.title}</h3>
          <p>{visual.copy}</p>
        </article>
      ))}
    </div>
  </section>
);
