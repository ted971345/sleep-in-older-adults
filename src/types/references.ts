export type ReferenceType =
  | "clinical-guideline"
  | "review-article"
  | "research-study"
  | "patient-education"
  | "tool";

export type ReferenceCitation = {
  id: string;
  type: ReferenceType;
  title: string;
  authors: string[];
  source: string;
  year: number;
  url?: string;
  doi?: string;
  note?: string;
};

export type EvidenceStrength = "emerging" | "moderate" | "strong";

export type EvidenceNote = {
  id: string;
  summary: string;
  strength: EvidenceStrength;
  referenceIds: string[];
};
