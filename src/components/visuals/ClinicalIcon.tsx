export type ClinicalIconName =
  | "sleep"
  | "light"
  | "breathing"
  | "legs"
  | "medication"
  | "mobility"
  | "cognition"
  | "safety";

type ClinicalIconProps = {
  name: ClinicalIconName;
  label?: string;
};

export const ClinicalIcon = ({ name, label }: ClinicalIconProps) => {
  const commonProps = {
    className: "clinical-icon",
    fill: "none",
    role: label ? "img" : "presentation",
    viewBox: "0 0 48 48",
    xmlns: "http://www.w3.org/2000/svg",
  };

  return (
    <svg {...commonProps} aria-label={label} aria-hidden={label ? undefined : true}>
      <rect className="clinical-icon__tile" height="44" rx="8" width="44" x="2" y="2" />
      {name === "sleep" && (
        <>
          <path className="clinical-icon__line" d="M14 29c4-9 12-13 24-12-1 11-7 17-17 17-4 0-6-1-7-5Z" />
          <path className="clinical-icon__line" d="M14 15h7l-7 9h8" />
        </>
      )}
      {name === "light" && (
        <>
          <circle className="clinical-icon__fill" cx="24" cy="24" r="7" />
          <path className="clinical-icon__line" d="M24 8v5M24 35v5M8 24h5M35 24h5M12.7 12.7l3.5 3.5M31.8 31.8l3.5 3.5M35.3 12.7l-3.5 3.5M16.2 31.8l-3.5 3.5" />
        </>
      )}
      {name === "breathing" && (
        <>
          <path className="clinical-icon__line" d="M24 15v20M24 24c-8-8-15-7-15 2 0 7 7 8 15 1M24 24c8-8 15-7 15 2 0 7-7 8-15 1" />
          <path className="clinical-icon__line" d="M20 13c1-3 7-3 8 0" />
        </>
      )}
      {name === "legs" && (
        <>
          <path className="clinical-icon__line" d="M20 10v13l-6 13M29 10v12l5 14" />
          <path className="clinical-icon__line" d="M15 36h10M29 36h9M16 22c5 3 11 3 16 0" />
        </>
      )}
      {name === "medication" && (
        <>
          <path className="clinical-icon__line" d="M16 17a7 7 0 0 1 10-10l15 15a7 7 0 0 1-10 10L16 17Z" transform="translate(-4 6)" />
          <path className="clinical-icon__line" d="M22 20l-8 8" />
          <circle className="clinical-icon__fill" cx="33" cy="33" r="3" />
        </>
      )}
      {name === "mobility" && (
        <>
          <circle className="clinical-icon__fill" cx="22" cy="12" r="4" />
          <path className="clinical-icon__line" d="M22 17l-5 10 8 4 7 8M19 26l-6 10M25 22l8 1" />
        </>
      )}
      {name === "cognition" && (
        <>
          <path className="clinical-icon__line" d="M17 34c-6-4-7-16 1-22 7-5 17-1 18 8 1 7-3 10-7 11v5H17Z" />
          <path className="clinical-icon__line" d="M19 22h10M21 16v12M29 17v10" />
        </>
      )}
      {name === "safety" && (
        <>
          <path className="clinical-icon__line" d="M24 8l14 5v10c0 9-6 14-14 17-8-3-14-8-14-17V13l14-5Z" />
          <path className="clinical-icon__line" d="M18 24l4 4 9-10" />
        </>
      )}
    </svg>
  );
};
