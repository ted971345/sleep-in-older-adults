import { useMemo, useState } from "react";
import type {
  ReasoningStep,
  SleepCase,
  StepEvaluation,
  StepResponse,
} from "../../types";
import {
  evaluateStep,
  buildFormativeFeedback,
  getInitialRevealedInfoIds,
  getNewRevealIds,
  getRevealedInfoItems,
  getTotalEvaluation,
} from "../../utils/casePlayerEngine";
import { CaseInformationPanel } from "./CaseInformationPanel";
import { CaseReferencesPanel } from "./CaseReferencesPanel";
import { ReasoningStepView } from "./ReasoningStepView";
import { ClinicalIcon, type ClinicalIconName } from "../visuals/ClinicalIcon";

type CasePlayerProps = {
  caseItem: SleepCase;
};

const updateResponse = (
  responses: StepResponse[],
  stepId: string,
  selectedOptionIds: string[],
) => [
  ...responses.filter((response) => response.stepId !== stepId),
  { stepId, selectedOptionIds },
];

const updateEvaluation = (
  evaluations: StepEvaluation[],
  evaluation: StepEvaluation,
) => [
  ...evaluations.filter((item) => item.stepId !== evaluation.stepId),
  evaluation,
];

const iconByStepKind: Record<ReasoningStep["kind"], ClinicalIconName> = {
  "follow-up": "sleep",
  classification: "cognition",
  "red-flags": "safety",
  prioritization: "mobility",
  recommendations: "medication",
  feedback: "light",
};

export const CasePlayer = ({ caseItem }: CasePlayerProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [responses, setResponses] = useState<StepResponse[]>([]);
  const [evaluations, setEvaluations] = useState<StepEvaluation[]>([]);
  const [revealedInfoIds, setRevealedInfoIds] = useState(
    getInitialRevealedInfoIds(caseItem.player.initialInfoIds),
  );
  const [submittedStepIds, setSubmittedStepIds] = useState<Set<string>>(
    () => new Set(),
  );

  const activeStep = caseItem.player.steps[activeIndex];
  const activeResponse = responses.find(
    (response) => response.stepId === activeStep.id,
  );
  const selectedOptionIds = activeResponse?.selectedOptionIds ?? [];
  const submitted = submittedStepIds.has(activeStep.id);
  const evaluation = evaluations.find((item) => item.stepId === activeStep.id);
  const isLastStep = activeIndex === caseItem.player.steps.length - 1;

  const revealedInformation = useMemo(
    () => getRevealedInfoItems(caseItem.player.information, revealedInfoIds),
    [caseItem.player.information, revealedInfoIds],
  );

  const totalEvaluation = getTotalEvaluation(evaluations);
  const formativeFeedback = useMemo(
    () =>
      buildFormativeFeedback(caseItem.player.formativeFeedback, responses),
    [caseItem.player.formativeFeedback, responses],
  );

  const setSelection = (step: ReasoningStep, optionId: string) => {
    if (submittedStepIds.has(step.id) || step.kind === "feedback") {
      return;
    }

    const currentSelection =
      responses.find((response) => response.stepId === step.id)
        ?.selectedOptionIds ?? [];

    let nextSelection: string[];

    if (step.kind === "classification") {
      nextSelection = [optionId];
    } else if (step.kind === "prioritization") {
      nextSelection = currentSelection.includes(optionId)
        ? currentSelection.filter((id) => id !== optionId)
        : [...currentSelection, optionId];
    } else {
      nextSelection = currentSelection.includes(optionId)
        ? currentSelection.filter((id) => id !== optionId)
        : [...currentSelection, optionId];

      if (step.kind === "follow-up") {
        nextSelection = nextSelection.slice(0, step.maxSelections);
      }
    }

    setResponses((current) => updateResponse(current, step.id, nextSelection));
  };

  const continueStep = () => {
    if (activeStep.kind === "feedback" && isLastStep) {
      window.location.hash = `#/reflection?caseId=${caseItem.id}`;
      return;
    }

    if (activeStep.kind === "feedback" || submitted) {
      setActiveIndex((current) =>
        Math.min(current + 1, caseItem.player.steps.length - 1),
      );
      return;
    }

    const nextEvaluation = evaluateStep(activeStep, selectedOptionIds);
    setEvaluations((current) => updateEvaluation(current, nextEvaluation));
    setSubmittedStepIds((current) => new Set(current).add(activeStep.id));

    if ("options" in activeStep) {
      const newRevealIds = getNewRevealIds(
        activeStep.options,
        selectedOptionIds,
        revealedInfoIds,
      );
      if (newRevealIds.length > 0) {
        setRevealedInfoIds((current) => new Set([...current, ...newRevealIds]));
      }
    }
  };

  const goBack = () => {
    setActiveIndex((current) => Math.max(current - 1, 0));
  };

  const resetCase = () => {
    setActiveIndex(0);
    setResponses([]);
    setEvaluations([]);
    setRevealedInfoIds(getInitialRevealedInfoIds(caseItem.player.initialInfoIds));
    setSubmittedStepIds(new Set());
  };

  return (
    <div className="interactive-player">
      <div className="progress-strip" aria-label="Case progress">
        {caseItem.player.steps.map((step, index) => (
          <button
            aria-current={activeIndex === index ? "step" : undefined}
            className="progress-step"
            disabled={index > activeIndex}
            key={step.id}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <span>{index + 1}</span>
            <ClinicalIcon name={iconByStepKind[step.kind]} />
            {step.kind.replace("-", " ")}
          </button>
        ))}
      </div>

      <div className="score-strip">
        <span>Current reasoning score</span>
        <strong>
          {totalEvaluation.earned}/{totalEvaluation.possible || 0}
          {totalEvaluation.possible > 0 ? ` (${totalEvaluation.percent}%)` : ""}
        </strong>
      </div>

      <div className="player-layout">
        <CaseInformationPanel
          information={revealedInformation}
          patient={caseItem.patient}
        />
        <ReasoningStepView
          activeIndex={activeIndex}
          evaluation={evaluation}
          formativeFeedback={
            activeStep.kind === "feedback" ? formativeFeedback : undefined
          }
          isLastStep={isLastStep}
          onBack={goBack}
          onContinue={continueStep}
          onReset={resetCase}
          onSelect={(optionId) => setSelection(activeStep, optionId)}
          selectedOptionIds={selectedOptionIds}
          step={activeStep}
          stepCount={caseItem.player.steps.length}
          submitted={submitted}
        />
      </div>

      <CaseReferencesPanel referenceIds={caseItem.referenceIds} />
    </div>
  );
};
