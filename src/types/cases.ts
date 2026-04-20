import type { CaseQuestion } from "./questions";
import type { CasePlayerModel } from "./casePlayer";
import type { ScoringRubric } from "./scoring";

export type CaseDifficulty = "introductory" | "intermediate" | "advanced";

export type CaseTag =
  | "normal-aging"
  | "insomnia"
  | "sleep-apnea"
  | "restless-legs"
  | "circadian-rhythm"
  | "medications"
  | "cognition"
  | "falls"
  | "nocturia"
  | "caregiver-context";

export type LearningObjective = {
  id: string;
  text: string;
};

export type PatientProfile = {
  age: number;
  pronouns: string;
  livingSituation: string;
  relevantHistory: string[];
};

export type CaseStep = {
  id: string;
  title: string;
  narrative: string;
  questions: CaseQuestion[];
  referenceIds?: string[];
};

export type SleepCase = {
  id: string;
  title: string;
  teaser: string;
  summary: string;
  initialSummary: string;
  difficulty: CaseDifficulty;
  estimatedMinutes: number;
  tags: CaseTag[];
  patient: PatientProfile;
  learningObjectives: LearningObjective[];
  reasoningPathways: string[];
  redFlags: string[];
  recommendedPriorities: string[];
  educationalFeedback: string[];
  steps: CaseStep[];
  player: CasePlayerModel;
  rubrics?: ScoringRubric[];
  referenceIds: string[];
};

export type CaseProgress = {
  caseId: string;
  currentStepId: string;
  completedStepIds: string[];
  startedAt: string;
  completedAt?: string;
};
