import type {
  CaseInfoItem,
  FormativeFeedbackRubric,
  FormativeFeedbackResult,
  ReasoningStep,
  SelectableOption,
  StepEvaluation,
  StepResponse,
} from "../types";

export const getInitialRevealedInfoIds = (initialInfoIds: string[]) =>
  new Set(initialInfoIds);

export const getRevealedInfoItems = (
  information: CaseInfoItem[],
  revealedInfoIds: Set<string>,
) => information.filter((item) => revealedInfoIds.has(item.id));

export const findStepResponse = (
  responses: StepResponse[],
  stepId: string,
): StepResponse | undefined =>
  responses.find((response) => response.stepId === stepId);

export const canSubmitStep = (
  step: ReasoningStep,
  selectedOptionIds: string[],
) => {
  if (step.kind === "feedback") {
    return true;
  }

  if (step.kind === "follow-up") {
    return (
      selectedOptionIds.length >= step.minSelections &&
      selectedOptionIds.length <= step.maxSelections
    );
  }

  if (step.kind === "classification") {
    return selectedOptionIds.length === 1;
  }

  if (step.kind === "prioritization") {
    return selectedOptionIds.length === step.preferredOrder.length;
  }

  if (
    step.kind === "recommendations" &&
    step.maxSelections !== undefined
  ) {
    return selectedOptionIds.length === step.maxSelections;
  }

  if (
    step.kind === "red-flags" &&
    step.maxSelections !== undefined
  ) {
    return (
      selectedOptionIds.length > 0 &&
      selectedOptionIds.length <= step.maxSelections
    );
  }

  return selectedOptionIds.length > 0;
};

export const getStepTargets = (step: ReasoningStep) => {
  if (step.kind === "follow-up") {
    return step.highValueOptionIds;
  }

  if (step.kind === "prioritization") {
    return step.preferredOrder;
  }

  if (step.kind === "feedback") {
    return [];
  }

  return step.correctOptionIds;
};

const stableHash = (value: string) =>
  [...value].reduce((hash, char) => {
    const nextHash = (hash << 5) - hash + char.charCodeAt(0);
    return nextHash | 0;
  }, 0);

export const getDisplayOptions = (step: ReasoningStep): SelectableOption[] => {
  if (!("options" in step)) {
    return [];
  }

  return [...step.options].sort((first, second) => {
    const firstScore = stableHash(`${step.id}:${first.id}`);
    const secondScore = stableHash(`${step.id}:${second.id}`);
    return firstScore - secondScore;
  });
};

export const evaluateStep = (
  step: ReasoningStep,
  selectedOptionIds: string[],
): StepEvaluation => {
  const targets = getStepTargets(step);

  if (step.kind === "feedback") {
    return {
      stepId: step.id,
      earned: 0,
      possible: 0,
      matchedOptionIds: [],
      missedOptionIds: [],
      incorrectOptionIds: [],
      misplacedOptionIds: [],
      penalty: 0,
    };
  }

  if (step.kind === "prioritization") {
    const matchedOptionIds = selectedOptionIds.filter(
      (optionId, index) => targets[index] === optionId,
    );
    const misplacedOptionIds = selectedOptionIds.filter(
      (optionId, index) => targets[index] !== optionId,
    );

    return {
      stepId: step.id,
      earned: matchedOptionIds.length,
      possible: targets.length,
      matchedOptionIds,
      missedOptionIds: targets.filter((id) => !selectedOptionIds.includes(id)),
      incorrectOptionIds: [],
      misplacedOptionIds,
      penalty: 0,
    };
  }

  const matchedOptionIds = selectedOptionIds.filter((id) =>
    targets.includes(id),
  );
  const incorrectOptionIds = selectedOptionIds.filter(
    (id) => !targets.includes(id),
  );
  const penalty =
    step.kind === "classification" ? 0 : incorrectOptionIds.length * 0.5;
  const earned = Math.max(0, matchedOptionIds.length - penalty);

  return {
    stepId: step.id,
    earned,
    possible: targets.length,
    matchedOptionIds,
    missedOptionIds: targets.filter((id) => !selectedOptionIds.includes(id)),
    incorrectOptionIds,
    misplacedOptionIds: [],
    penalty,
  };
};

export const getNewRevealIds = (
  options: SelectableOption[],
  selectedOptionIds: string[],
  revealedInfoIds: Set<string>,
) =>
  options
    .filter((option) => selectedOptionIds.includes(option.id))
    .flatMap((option) => option.reveals ?? [])
    .filter((infoId) => !revealedInfoIds.has(infoId));

export const getTotalEvaluation = (evaluations: StepEvaluation[]) => {
  const earned = evaluations.reduce((sum, item) => sum + item.earned, 0);
  const possible = evaluations.reduce((sum, item) => sum + item.possible, 0);

  return {
    earned,
    possible,
    percent: possible === 0 ? 0 : Math.round((earned / possible) * 100),
  };
};

const getSelectedOptionIds = (responses: StepResponse[]) =>
  new Set(responses.flatMap((response) => response.selectedOptionIds));

const scoreDomain = (
  targetOptionIds: string[],
  selectedOptionIds: Set<string>,
  maxPoints: number,
) => {
  const identifiedOptionIds = targetOptionIds.filter((id) =>
    selectedOptionIds.has(id),
  );
  const missedOptionIds = targetOptionIds.filter(
    (id) => !selectedOptionIds.has(id),
  );
  const rawScore =
    targetOptionIds.length === 0
      ? 0
      : (identifiedOptionIds.length / targetOptionIds.length) * maxPoints;

  return {
    // The formative rubric measures coverage of instructor-defined reasoning
    // targets. Over-selection is handled at the individual step level so this
    // summary does not double-penalize reasonable selections from other stages.
    earnedPoints: Math.max(0, Math.round(rawScore)),
    identifiedOptionIds,
    missedOptionIds,
  };
};

export const buildFormativeFeedback = (
  rubric: FormativeFeedbackRubric,
  responses: StepResponse[],
): FormativeFeedbackResult => {
  const selectedOptionIds = getSelectedOptionIds(responses);

  // Instructor note: this engine is deliberately rule-based and transparent.
  // To expand the rubric, add target option ids in case data before changing code.
  const domains = rubric.domains.map((domain) => {
    const scored = scoreDomain(
      domain.targetOptionIds,
      selectedOptionIds,
      domain.maxPoints,
    );

    return {
      ...domain,
      ...scored,
    };
  });

  const diagnosticClues = rubric.diagnosticClues.map((clue) => ({
    ...clue,
    wasAddressed: clue.relatedOptionIds.some((id) => selectedOptionIds.has(id)),
  }));

  const fourMs = rubric.fourMs.map((item) => ({
    ...item,
    wasAddressed: item.relatedOptionIds.some((id) => selectedOptionIds.has(id)),
  }));

  const totalEarned = domains.reduce(
    (sum, domain) => sum + domain.earnedPoints,
    0,
  );
  const totalPossible = domains.reduce(
    (sum, domain) => sum + domain.maxPoints,
    0,
  );

  return {
    domains,
    diagnosticClues,
    fourMs,
    totalEarned,
    totalPossible,
  };
};
