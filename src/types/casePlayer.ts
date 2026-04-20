export type ReasoningStepKind =
  | "follow-up"
  | "classification"
  | "red-flags"
  | "prioritization"
  | "recommendations"
  | "feedback";

export type CaseInfoItem = {
  id: string;
  label: string;
  detail: string;
  category: "history" | "symptoms" | "medications" | "function" | "exam" | "plan";
};

export type SelectableOption = {
  id: string;
  label: string;
  rationale: string;
  reveals?: string[];
};

export type ReasoningStepBase = {
  id: string;
  kind: ReasoningStepKind;
  title: string;
  instruction: string;
};

export type FollowUpStep = ReasoningStepBase & {
  kind: "follow-up";
  minSelections: number;
  maxSelections: number;
  options: SelectableOption[];
  highValueOptionIds: string[];
};

export type SelectionStep = ReasoningStepBase & {
  kind: "classification" | "red-flags" | "recommendations";
  options: SelectableOption[];
  correctOptionIds: string[];
  maxSelections?: number;
};

export type PrioritizationStep = ReasoningStepBase & {
  kind: "prioritization";
  options: SelectableOption[];
  preferredOrder: string[];
};

export type FeedbackStep = ReasoningStepBase & {
  kind: "feedback";
  summary: string;
};

export type ReasoningStep =
  | FollowUpStep
  | SelectionStep
  | PrioritizationStep
  | FeedbackStep;

export type StepResponse = {
  stepId: string;
  selectedOptionIds: string[];
};

export type StepEvaluation = {
  stepId: string;
  earned: number;
  possible: number;
  matchedOptionIds: string[];
  missedOptionIds: string[];
  incorrectOptionIds: string[];
  misplacedOptionIds: string[];
  penalty: number;
};

export type FeedbackDomainId =
  | "problem-representation"
  | "red-flag-recognition"
  | "prioritization"
  | "recommendation-quality"
  | "age-friendly-framing";

export type FeedbackDomainRule = {
  id: FeedbackDomainId;
  label: string;
  maxPoints: number;
  targetOptionIds: string[];
  proficientMessage: string;
  developingMessage: string;
};

export type DiagnosticClueRule = {
  id: string;
  label: string;
  relatedOptionIds: string[];
  explanation: string;
};

export type FourMsKey = "what-matters" | "medication" | "mentation" | "mobility";

export type FourMsRule = {
  id: FourMsKey;
  label: string;
  relatedOptionIds: string[];
  feedback: string;
};

export type FormativeFeedbackRubric = {
  domains: FeedbackDomainRule[];
  diagnosticClues: DiagnosticClueRule[];
  fourMs: FourMsRule[];
};

export type FeedbackDomainResult = FeedbackDomainRule & {
  earnedPoints: number;
  identifiedOptionIds: string[];
  missedOptionIds: string[];
};

export type DiagnosticClueFeedback = DiagnosticClueRule & {
  wasAddressed: boolean;
};

export type FourMsFeedback = FourMsRule & {
  wasAddressed: boolean;
};

export type FormativeFeedbackResult = {
  domains: FeedbackDomainResult[];
  diagnosticClues: DiagnosticClueFeedback[];
  fourMs: FourMsFeedback[];
  totalEarned: number;
  totalPossible: number;
};

export type CasePlayerModel = {
  initialInfoIds: string[];
  information: CaseInfoItem[];
  steps: ReasoningStep[];
  formativeFeedback: FormativeFeedbackRubric;
};
