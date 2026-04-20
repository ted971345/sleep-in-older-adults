export type ScoreBand = {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
  feedback: string;
};

export type ScoringCriterion = {
  id: string;
  label: string;
  description: string;
  maxPoints: number;
};

export type ScoringRubric = {
  id: string;
  title: string;
  criteria: ScoringCriterion[];
  bands: ScoreBand[];
};

export type LearnerScore = {
  rubricId: string;
  earnedPoints: number;
  possiblePoints: number;
  criterionScores: Record<string, number>;
};
