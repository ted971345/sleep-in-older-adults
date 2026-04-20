export type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "short-answer"
  | "ranking"
  | "reflection";

export type QuestionOption = {
  id: string;
  label: string;
  rationale?: string;
  referenceIds?: string[];
};

export type BaseQuestion = {
  id: string;
  type: QuestionType;
  prompt: string;
  learningObjectiveIds: string[];
  referenceIds?: string[];
};

export type ChoiceQuestion = BaseQuestion & {
  type: "single-choice" | "multiple-choice";
  options: QuestionOption[];
  correctOptionIds: string[];
};

export type ShortAnswerQuestion = BaseQuestion & {
  type: "short-answer" | "reflection";
  suggestedResponse?: string;
  rubricId?: string;
};

export type RankingQuestion = BaseQuestion & {
  type: "ranking";
  options: QuestionOption[];
  preferredOrder: string[];
};

export type CaseQuestion =
  | ChoiceQuestion
  | ShortAnswerQuestion
  | RankingQuestion;

export type LearnerResponse =
  | {
      questionId: string;
      type: "single-choice";
      selectedOptionId: string;
    }
  | {
      questionId: string;
      type: "multiple-choice" | "ranking";
      selectedOptionIds: string[];
    }
  | {
      questionId: string;
      type: "short-answer" | "reflection";
      responseText: string;
    };
