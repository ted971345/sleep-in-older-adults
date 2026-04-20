import type {
  CaseDifficulty,
  CaseInfoItem,
  CaseTag,
  DiagnosticClueRule,
  FeedbackDomainRule,
  FollowUpStep,
  FormativeFeedbackRubric,
  FourMsRule,
  ReasoningStep,
  SelectableOption,
  SelectionStep,
  SleepCase,
} from "../types";

type CaseSeed = {
  id: string;
  title: string;
  teaser: string;
  summary: string;
  initialSummary: string;
  difficulty: CaseDifficulty;
  estimatedMinutes: number;
  tags: CaseTag[];
  patient: SleepCase["patient"];
  learningObjectives: SleepCase["learningObjectives"];
  reasoningPathways: string[];
  redFlags: string[];
  recommendedPriorities: string[];
  educationalFeedback: string[];
  initialInfoIds: string[];
  information: CaseInfoItem[];
  followUp: { options: SelectableOption[]; highValueOptionIds: string[] };
  classification: { options: SelectableOption[]; correctOptionIds: string[] };
  redFlagStep: { options: SelectableOption[]; correctOptionIds: string[] };
  prioritization: { options: SelectableOption[]; preferredOrder: string[] };
  recommendations: { options: SelectableOption[]; correctOptionIds: string[] };
  feedbackSummary: string;
  formativeFeedback: FormativeFeedbackRubric;
  referenceIds: string[];
};

const option = (
  id: string,
  label: string,
  rationale: string,
  reveals?: string[],
): SelectableOption => ({ id, label, rationale, reveals });

const domain = (
  id: FeedbackDomainRule["id"],
  label: string,
  targetOptionIds: string[],
  proficientMessage: string,
  developingMessage: string,
): FeedbackDomainRule => ({
  id,
  label,
  maxPoints: 4,
  targetOptionIds,
  proficientMessage,
  developingMessage,
});

const clue = (
  id: string,
  label: string,
  relatedOptionIds: string[],
  explanation: string,
): DiagnosticClueRule => ({ id, label, relatedOptionIds, explanation });

const fourMs = (
  id: FourMsRule["id"],
  label: string,
  relatedOptionIds: string[],
  feedback: string,
): FourMsRule => ({ id, label, relatedOptionIds, feedback });

const commonFourMs = (
  whatMatters: string[],
  medication: string[],
  mentation: string[],
  mobility: string[],
): FourMsRule[] => [
  fourMs("what-matters", "What Matters", whatMatters, "Align the sleep plan with the patient's goals, routines, independence, and tolerance for tradeoffs."),
  fourMs("medication", "Medication", medication, "Review medication timing, sedating burden, anticholinergic effects, and drug choices before adding sleep medications."),
  fourMs("mentation", "Mentation", mentation, "Consider mood, cognition, delirium risk, and next-day alertness when interpreting sleep complaints."),
  fourMs("mobility", "Mobility", mobility, "Connect sleep disruption to falls, driving, gait confidence, and safe daily movement."),
];

const followUpStep = (
  caseId: string,
  options: SelectableOption[],
  highValueOptionIds: string[],
): FollowUpStep => ({
  id: `${caseId}-follow-up`,
  kind: "follow-up",
  title: "Select Follow-Up Questions",
  instruction: "Choose the most useful questions to clarify the sleep concern. Your selections reveal additional case information.",
  minSelections: 3,
  maxSelections: 5,
  options,
  highValueOptionIds,
});

const selectionStep = (
  id: string,
  kind: SelectionStep["kind"],
  title: string,
  instruction: string,
  options: SelectableOption[],
  correctOptionIds: string[],
): SelectionStep => ({ id, kind, title, instruction, options, correctOptionIds });

const prioritizationStep = (
  id: string,
  options: SelectableOption[],
  preferredOrder: string[],
): ReasoningStep => ({
  id,
  kind: "prioritization",
  title: "Prioritize Next Actions",
  instruction: "Order the actions from highest to lowest priority for the next clinical encounter.",
  options,
  preferredOrder,
});

const makeCase = (seed: CaseSeed): SleepCase => ({
  id: seed.id,
  title: seed.title,
  teaser: seed.teaser,
  summary: seed.summary,
  initialSummary: seed.initialSummary,
  difficulty: seed.difficulty,
  estimatedMinutes: seed.estimatedMinutes,
  tags: seed.tags,
  patient: seed.patient,
  learningObjectives: seed.learningObjectives,
  reasoningPathways: seed.reasoningPathways,
  redFlags: seed.redFlags,
  recommendedPriorities: seed.recommendedPriorities,
  educationalFeedback: seed.educationalFeedback,
  steps: [{ id: `${seed.id}-overview`, title: "Initial Framing", narrative: seed.initialSummary, questions: [] }],
  player: {
    initialInfoIds: seed.initialInfoIds,
    information: seed.information,
    steps: [
      followUpStep(seed.id, seed.followUp.options, seed.followUp.highValueOptionIds),
      selectionStep(`${seed.id}-classification`, "classification", "Classify the Sleep Problem", "Select the classification that best fits the revealed information.", seed.classification.options, seed.classification.correctOptionIds),
      selectionStep(`${seed.id}-red-flags`, "red-flags", "Identify Red Flags", "Select findings that should raise concern or change urgency.", seed.redFlagStep.options, seed.redFlagStep.correctOptionIds),
      prioritizationStep(`${seed.id}-prioritization`, seed.prioritization.options, seed.prioritization.preferredOrder),
      selectionStep(`${seed.id}-recommendations`, "recommendations", "Select Recommendations", "Choose recommendations that match the classification, red flags, and patient goals.", seed.recommendations.options, seed.recommendations.correctOptionIds),
      { id: `${seed.id}-feedback`, kind: "feedback", title: "Structured Feedback", instruction: "Review your reasoning pattern before moving to reflection.", summary: seed.feedbackSummary },
    ],
    formativeFeedback: seed.formativeFeedback,
  },
  referenceIds: seed.referenceIds,
});

const sleepClues = (
  prefix: string,
  insomniaIds: string[],
  osaIds: string[],
  rlsIds: string[],
  medIds: string[],
  multiIds: string[],
): DiagnosticClueRule[] => [
  clue(`${prefix}-clue-insomnia`, "Insomnia", insomniaIds, "Insomnia is supported by persistent sleep difficulty, adequate opportunity, distress, and daytime impairment; in older adults it may coexist with medical, medication, or breathing contributors."),
  clue(`${prefix}-clue-osa`, "Obstructive sleep apnea", osaIds, "OSA clues include loud snoring, witnessed apneas, gasping, morning headache, hypertension, obesity, and excessive sleepiness."),
  clue(`${prefix}-clue-rls`, "Restless legs syndrome", rlsIds, "RLS requires an urge to move the legs that worsens at rest or evening and is relieved by movement; mimics include cramps, neuropathy, edema, arthritis, and positional discomfort."),
  clue(`${prefix}-clue-medication`, "Medication-related risk", medIds, "Medication-related sleep problems may come from sedating anticholinergics, respiratory depressants, activating agents, caffeine timing, or medication timing that worsens nocturia."),
  clue(`${prefix}-clue-multifactorial`, "Multifactorial geriatric sleep problem", multiIds, "Multifactorial reasoning integrates symptoms with function, falls, mentation, medications, mobility, and what matters to the patient."),
];

export const cases: SleepCase[] = [
  makeCase({
    id: "case-normal-aging-vs-concern",
    title: "Normal Aging or Concerning Sleep Change?",
    teaser: "A high-functioning 72-year-old asks whether lighter, earlier sleep is simply part of aging.",
    summary: "Differentiate expected age-associated sleep changes from symptoms that require workup or safety intervention.",
    initialSummary: "A 72-year-old retired teacher reports waking earlier than she used to and asks whether she should start a sleep medication. She remains active but worries that her sleep is becoming abnormal.",
    difficulty: "introductory",
    estimatedMinutes: 14,
    tags: ["normal-aging", "circadian-rhythm", "cognition"],
    patient: { age: 72, pronouns: "she/her", livingSituation: "Lives with a spouse and volunteers at a literacy program.", relevantHistory: ["Well-controlled hypothyroidism", "Mild knee osteoarthritis"] },
    learningObjectives: [
      { id: "normal-lo-aging", text: "Distinguish expected sleep timing changes from clinically significant sleep disorders." },
      { id: "normal-lo-workup", text: "Identify when reassurance, sleep education, and monitoring are more appropriate than diagnostic escalation." },
    ],
    reasoningPathways: ["Normal aging with advanced sleep timing and lighter sleep", "Chronic insomnia if distress, impairment, and maladaptive sleep behaviors dominate", "OSA or medication-related risk if snoring, witnessed apneas, sedatives, or functional decline emerge"],
    redFlags: ["No witnessed apneas", "No drowsy driving", "No falls", "No cognitive or mood change", "No sedating sleep medication use"],
    recommendedPriorities: ["Validate concern and normalize some lighter, earlier sleep with aging", "Screen briefly for symptoms that would change urgency", "Protect daytime function, morning light exposure, and consistent routines", "Avoid unnecessary hypnotic initiation"],
    educationalFeedback: ["The key move is not dismissing the concern as aging, but showing that red-flag screening was negative.", "Graduate learners should separate normal sleep timing shifts from insomnia disorder, OSA, RLS, medication effects, and depression."],
    initialInfoIds: ["normal-chief", "normal-context", "normal-history"],
    information: [
      { id: "normal-chief", label: "Presenting Concern", category: "history", detail: "She falls asleep around 9:30 PM, wakes around 5:15 AM, and feels her sleep is lighter than it was in midlife." },
      { id: "normal-context", label: "Function", category: "function", detail: "She walks most mornings, volunteers twice weekly, and denies unplanned daytime sleep episodes." },
      { id: "normal-history", label: "Clinical Context", category: "history", detail: "No recent hospitalization, bereavement, medication change, or cardiopulmonary symptoms." },
      { id: "normal-pattern", label: "Sleep Pattern", category: "symptoms", detail: "Sleep latency is 15 to 20 minutes. She wakes once to urinate and returns to sleep within 10 minutes." },
      { id: "normal-breathing", label: "Breathing Symptoms", category: "symptoms", detail: "Her spouse reports quiet breathing without snoring, gasping, or witnessed pauses." },
      { id: "normal-medications", label: "Medication Review", category: "medications", detail: "She takes levothyroxine in the morning and acetaminophen as needed. She does not use PM sleep aids." },
      { id: "normal-mood", label: "Mood and Cognition", category: "history", detail: "She denies anhedonia, persistent worry, memory decline, hallucinations, or confusion." },
      { id: "normal-goals", label: "Care Preferences", category: "plan", detail: "She wants to maintain morning energy and prefers education over medication if nothing dangerous is present." },
    ],
    followUp: {
      highValueOptionIds: ["normal-ask-pattern", "normal-ask-function", "normal-ask-breathing", "normal-ask-medications"],
      options: [
        option("normal-ask-pattern", "Clarify sleep timing, latency, awakenings, and return-to-sleep pattern.", "This tests whether the complaint reflects expected timing change or insomnia-level difficulty.", ["normal-pattern"]),
        option("normal-ask-function", "Ask about daytime sleepiness, driving, activities, and naps.", "Function determines whether lighter sleep is clinically consequential.", ["normal-context", "normal-goals"]),
        option("normal-ask-breathing", "Ask about snoring, gasping, witnessed apneas, and morning headaches.", "A brief OSA screen prevents premature reassurance.", ["normal-breathing"]),
        option("normal-ask-medications", "Review prescription, OTC, and supplement use for sleep or allergies.", "Medication effects are common, modifiable, and often missed.", ["normal-medications"]),
        option("normal-ask-mood", "Screen for mood symptoms and cognitive change.", "Mood and cognition can change sleep complaints and management priorities.", ["normal-mood"]),
        option("normal-ask-psg", "Order polysomnography before taking any additional history.", "Testing is not the first move when red flags and symptoms have not been established."),
      ],
    },
    classification: {
      correctOptionIds: ["normal-class-aging"],
      options: [
        option("normal-class-aging", "Age-associated sleep timing and continuity change without disorder-level impairment.", "Earlier timing, brief awakenings, preserved function, and absent red flags support education and monitoring."),
        option("normal-class-insomnia", "Chronic insomnia disorder requiring immediate pharmacotherapy.", "The case lacks prolonged distress, impairment, and persistent inability to sleep despite adequate opportunity."),
        option("normal-class-osa", "Probable obstructive sleep apnea.", "No snoring, witnessed apneas, gasping, or sleepiness has emerged."),
        option("normal-class-rls", "Restless legs syndrome.", "There is no urge to move the legs, rest-related worsening, or relief with movement."),
      ],
    },
    redFlagStep: {
      correctOptionIds: ["normal-flag-none"],
      options: [
        option("normal-flag-none", "No immediate red flags are present after targeted screening.", "Absence of apneas, falls, drowsy driving, sedating medications, and cognitive change supports conservative management."),
        option("normal-flag-apnea", "Witnessed apneas.", "This would be a red flag, but it was specifically denied."),
        option("normal-flag-falls", "Nighttime falls.", "This would change urgency, but no falls were reported."),
        option("normal-flag-sedatives", "Regular anticholinergic sleep aid use.", "This would be important, but she is not using OTC PM products."),
      ],
    },
    prioritization: {
      preferredOrder: ["normal-priority-reassure", "normal-priority-education", "normal-priority-monitor", "normal-priority-avoid-med"],
      options: [
        option("normal-priority-reassure", "Provide calibrated reassurance after negative red-flag screening.", "Reassurance is strongest when it follows a targeted safety and disorder screen."),
        option("normal-priority-education", "Teach age-associated sleep changes, morning light, activity, and consistent wake time.", "Education supports self-efficacy and avoids medicalizing normal variation."),
        option("normal-priority-monitor", "Set return precautions for new sleepiness, falls, mood change, snoring, or functional decline.", "Monitoring keeps the plan safe without over-testing."),
        option("normal-priority-avoid-med", "Avoid starting a hypnotic or OTC PM medication.", "Medication risk outweighs benefit when symptoms are mild and function is preserved."),
      ],
    },
    recommendations: {
      correctOptionIds: ["normal-rec-education", "normal-rec-light", "normal-rec-monitor", "normal-rec-avoid-pm"],
      options: [
        option("normal-rec-education", "Explain that lighter sleep and earlier waking can occur with aging while still screening for concerning change.", "This validates the concern without pathologizing normal aging."),
        option("normal-rec-light", "Encourage morning bright light, daytime activity, and a stable wake time.", "These measures support circadian regularity and daytime function."),
        option("normal-rec-monitor", "Use return precautions rather than immediate sleep testing.", "Testing is reserved for symptoms or risks that make a sleep disorder more likely."),
        option("normal-rec-avoid-pm", "Avoid diphenhydramine or other OTC PM sleep aids.", "Anticholinergic sleep aids add risk without a clear indication here."),
        option("normal-rec-benzo", "Start a benzodiazepine hypnotic for reassurance.", "This exposes the patient to avoidable harms and does not match the assessment."),
      ],
    },
    feedbackSummary: "This case rewards disciplined restraint: screen for danger, explain normal age-associated changes, preserve function, and avoid unnecessary sedatives or testing.",
    formativeFeedback: {
      domains: [
        domain("problem-representation", "Problem Representation", ["normal-ask-pattern", "normal-ask-function", "normal-class-aging"], "You represented the concern as age-associated change with preserved function after screening.", "Pair normal-aging language with a brief disorder and safety screen."),
        domain("red-flag-recognition", "Red Flag Recognition", ["normal-ask-breathing", "normal-ask-medications", "normal-ask-mood", "normal-flag-none"], "You checked the major risks before reassuring.", "Before reassuring, screen for OSA symptoms, medication risk, mood/cognition, and safety."),
        domain("prioritization", "Prioritization", ["normal-priority-reassure", "normal-priority-education", "normal-priority-monitor"], "Your priorities matched a low-risk presentation.", "Prioritize calibrated reassurance and monitoring over immediate medications or testing."),
        domain("recommendation-quality", "Recommendation Quality", ["normal-rec-education", "normal-rec-light", "normal-rec-monitor", "normal-rec-avoid-pm"], "Your recommendations were conservative, practical, and safety-aware.", "Teach normal changes, preserve routines, and avoid OTC PM products."),
        domain("age-friendly-framing", "Age-Friendly Framing", ["normal-ask-function", "normal-rec-light", "normal-rec-avoid-pm"], "You protected function and minimized medication harm.", "Make the age-friendly frame explicit: function, goals, mentation, mobility, and medication safety."),
      ],
      diagnosticClues: sleepClues("normal", ["normal-class-insomnia"], ["normal-ask-breathing", "normal-class-osa"], ["normal-class-rls"], ["normal-ask-medications", "normal-rec-avoid-pm"], ["normal-ask-function", "normal-ask-mood"]),
      fourMs: commonFourMs(["normal-ask-function", "normal-rec-education"], ["normal-ask-medications", "normal-rec-avoid-pm"], ["normal-ask-mood"], ["normal-ask-function", "normal-rec-light"]),
    },
    referenceIds: ["ref-aasm-insomnia-behavioral", "ref-ags-beers-2023", "ref-ihi-4ms"],
  }),

  makeCase({
    id: "case-chronic-insomnia",
    title: "Chronic Insomnia and Conditioned Arousal",
    teaser: "A 76-year-old lies awake for hours, naps to compensate, and has begun to fear bedtime.",
    summary: "Identify chronic insomnia disorder while avoiding reflexive sedative prescribing in an older adult.",
    initialSummary: "A 76-year-old retired accountant reports six months of difficulty falling asleep and staying asleep. He spends long periods awake in bed and says sleep has become 'work.'",
    difficulty: "intermediate",
    estimatedMinutes: 18,
    tags: ["insomnia", "circadian-rhythm", "cognition"],
    patient: { age: 76, pronouns: "he/him", livingSituation: "Lives alone in an apartment and manages his own medications.", relevantHistory: ["Type 2 diabetes", "Bereavement 18 months ago", "Mild nocturia"] },
    learningObjectives: [
      { id: "insomnia-lo-diagnosis", text: "Differentiate chronic insomnia disorder from insufficient sleep opportunity and other sleep disorders." },
      { id: "insomnia-lo-plan", text: "Prioritize CBT-I elements, safety, and comorbidity review over sedative escalation." },
    ],
    reasoningPathways: ["Chronic insomnia disorder with conditioned arousal and compensatory naps", "OSA if snoring, apneas, or prominent sleepiness are revealed", "Depression or complicated grief if mood symptoms dominate", "Medication-related insomnia if stimulants or activating medications are mistimed"],
    redFlags: ["Bereavement history requiring mood and self-harm screen", "Request for a fast pill solution", "Drowsy driving denied", "No witnessed apneas"],
    recommendedPriorities: ["Confirm chronic insomnia criteria and contributors", "Screen depression, suicide risk, OSA, medications, and substances", "Begin CBT-I-oriented behavioral plan and sleep diary", "Avoid benzodiazepines and OTC anticholinergic sleep aids"],
    educationalFeedback: ["A strong answer identifies insomnia without closing the differential prematurely.", "Learners should name why time awake in bed and compensatory napping perpetuate insomnia."],
    initialInfoIds: ["insomnia-chief", "insomnia-context", "insomnia-history"],
    information: [
      { id: "insomnia-chief", label: "Presenting Concern", category: "history", detail: "Sleep latency is 90 minutes or more at least five nights per week." },
      { id: "insomnia-context", label: "Daily Function", category: "function", detail: "He feels fatigued and irritable but rarely unintentionally falls asleep." },
      { id: "insomnia-history", label: "Background", category: "history", detail: "He spends 9 hours in bed hoping to catch up, reads news on a tablet in bed, and naps after lunch." },
      { id: "insomnia-pattern", label: "Sleep Diary Pattern", category: "symptoms", detail: "Diary shows variable bedtimes, long wake periods in bed, and total sleep time around 5.5 to 6 hours." },
      { id: "insomnia-breathing", label: "Breathing Screen", category: "symptoms", detail: "No bed partner reports snoring. He denies gasping, morning headaches, or high daytime sleepiness." },
      { id: "insomnia-mood", label: "Mood and Safety", category: "history", detail: "He misses his spouse but denies major depressive symptoms, suicidal ideation, or alcohol escalation." },
      { id: "insomnia-medications", label: "Medication and Substances", category: "medications", detail: "He drinks coffee until 3 PM and occasionally uses melatonin 10 mg at bedtime. No benzodiazepine or diphenhydramine use." },
      { id: "insomnia-goals", label: "Care Preferences", category: "plan", detail: "He wants a non-habit-forming approach but asks whether a pill would be faster." },
    ],
    followUp: {
      highValueOptionIds: ["insomnia-ask-pattern", "insomnia-ask-function", "insomnia-ask-mood", "insomnia-ask-breathing"],
      options: [
        option("insomnia-ask-pattern", "Ask for a sleep diary covering schedule, wake time in bed, naps, and caffeine.", "A diary reveals conditioned arousal, sleep opportunity, and perpetuating behaviors.", ["insomnia-pattern", "insomnia-medications"]),
        option("insomnia-ask-function", "Clarify fatigue versus sleepiness, driving risk, and daytime function.", "Insomnia often produces fatigue and distress without irresistible sleep episodes.", ["insomnia-context"]),
        option("insomnia-ask-mood", "Screen mood, grief, anxiety, substance use, and self-harm.", "Mood and safety screening is essential before labeling chronic insomnia.", ["insomnia-mood"]),
        option("insomnia-ask-breathing", "Ask about snoring, apneas, gasping, and morning headaches.", "OSA can masquerade as insomnia, especially with repeated awakenings.", ["insomnia-breathing"]),
        option("insomnia-ask-goals", "Ask what treatment outcomes and tradeoffs matter most.", "Preferences shape whether the plan begins with CBT-I, medication discussion, or stepped care.", ["insomnia-goals"]),
        option("insomnia-ask-psg", "Schedule polysomnography before completing a behavioral sleep history.", "Sleep testing is not routine for uncomplicated chronic insomnia without OSA or movement-disorder clues."),
      ],
    },
    classification: {
      correctOptionIds: ["insomnia-class-chronic"],
      options: [
        option("insomnia-class-chronic", "Chronic insomnia disorder with conditioned arousal and perpetuating behaviors.", "Frequency, duration, distress, wake time in bed, and compensatory napping support this classification."),
        option("insomnia-class-osa", "Probable obstructive sleep apnea.", "OSA remains worth screening for, but breathing and sleepiness clues are not dominant here."),
        option("insomnia-class-normal", "Normal aging only.", "Six months of distress and impaired function exceed expected aging-related sleep change."),
        option("insomnia-class-rls", "Restless legs syndrome.", "No urge-to-move pattern is present."),
      ],
    },
    redFlagStep: {
      correctOptionIds: ["insomnia-flag-mood", "insomnia-flag-sedative-request"],
      options: [
        option("insomnia-flag-mood", "Bereavement history requires mood and self-harm screening.", "The screen is negative, but it is still a necessary safety step."),
        option("insomnia-flag-sedative-request", "Request for a fast pill solution in an older adult.", "This flags risk for potentially inappropriate sedative prescribing."),
        option("insomnia-flag-apneas", "Witnessed apneas.", "This would raise concern for OSA, but it is not present."),
        option("insomnia-flag-driving", "Irresistible sleepiness while driving.", "This would change urgency, but the case describes fatigue rather than sleep attacks."),
      ],
    },
    prioritization: {
      preferredOrder: ["insomnia-priority-confirm", "insomnia-priority-cbti", "insomnia-priority-caffeine", "insomnia-priority-med-safety"],
      options: [
        option("insomnia-priority-confirm", "Confirm insomnia pattern and rule out urgent comorbid contributors.", "Diagnosis comes before treatment selection."),
        option("insomnia-priority-cbti", "Start CBT-I-oriented care: stimulus control, sleep restriction principles, and sleep diary.", "CBT-I targets the maintaining mechanisms of chronic insomnia."),
        option("insomnia-priority-caffeine", "Move caffeine earlier and reduce time awake in bed.", "These are modifiable perpetuating factors."),
        option("insomnia-priority-med-safety", "Discuss medication risks and avoid benzodiazepines or OTC PM products.", "Age-friendly prescribing requires harm avoidance."),
      ],
    },
    recommendations: {
      correctOptionIds: ["insomnia-rec-diary", "insomnia-rec-cbti", "insomnia-rec-caffeine", "insomnia-rec-med-caution"],
      options: [
        option("insomnia-rec-diary", "Use a two-week sleep diary to guide treatment and monitor response.", "The diary makes sleep opportunity and behavior patterns visible."),
        option("insomnia-rec-cbti", "Refer for CBT-I or deliver structured CBT-I components if access is limited.", "Behavioral and psychological treatment is foundational for chronic insomnia."),
        option("insomnia-rec-caffeine", "Stop afternoon caffeine and reserve the bed for sleep and intimacy.", "This reduces conditioned arousal and stimulant effects."),
        option("insomnia-rec-med-caution", "If medication is considered later, use shared decision-making and avoid anticholinergic or benzodiazepine approaches.", "Medication discussion should follow diagnosis and risk review."),
        option("insomnia-rec-diphenhydramine", "Recommend nightly diphenhydramine because it is available OTC.", "OTC availability does not make anticholinergic sleep aids safe for older adults."),
      ],
    },
    feedbackSummary: "This case teaches that insomnia is a diagnosis of pattern, duration, distress, opportunity, and impairment. The best plan targets perpetuating behaviors and avoids quick sedative fixes.",
    formativeFeedback: {
      domains: [
        domain("problem-representation", "Problem Representation", ["insomnia-ask-pattern", "insomnia-ask-function", "insomnia-class-chronic"], "You identified chronic insomnia as a behavioral and cognitive arousal pattern with functional impact.", "Link duration, sleep opportunity, distress, and daytime function before naming chronic insomnia."),
        domain("red-flag-recognition", "Red Flag Recognition", ["insomnia-ask-mood", "insomnia-ask-breathing", "insomnia-flag-mood"], "You screened for mood safety and OSA before focusing on insomnia care.", "Do not skip mood, self-harm, substance, OSA, and safety screens."),
        domain("prioritization", "Prioritization", ["insomnia-priority-confirm", "insomnia-priority-cbti", "insomnia-priority-med-safety"], "Your priorities support diagnosis first, behavioral treatment second, medication caution throughout.", "Prioritize CBT-I mechanisms before medication escalation."),
        domain("recommendation-quality", "Recommendation Quality", ["insomnia-rec-diary", "insomnia-rec-cbti", "insomnia-rec-caffeine", "insomnia-rec-med-caution"], "Your recommendations target mechanisms and age-related medication risk.", "Include sleep diary, CBT-I components, stimulant timing, and medication caution."),
        domain("age-friendly-framing", "Age-Friendly Framing", ["insomnia-ask-goals", "insomnia-rec-med-caution", "insomnia-priority-med-safety"], "You used patient goals and medication safety to frame insomnia care.", "Name what matters, mentation, and medication burden."),
      ],
      diagnosticClues: sleepClues("insomnia", ["insomnia-ask-pattern", "insomnia-class-chronic", "insomnia-rec-cbti"], ["insomnia-ask-breathing", "insomnia-class-osa"], ["insomnia-class-rls"], ["insomnia-rec-med-caution", "insomnia-rec-caffeine"], ["insomnia-ask-mood", "insomnia-ask-goals"]),
      fourMs: commonFourMs(["insomnia-ask-goals", "insomnia-rec-cbti"], ["insomnia-priority-med-safety", "insomnia-rec-med-caution"], ["insomnia-ask-mood", "insomnia-flag-mood"], ["insomnia-ask-function"]),
    },
    referenceIds: ["ref-aasm-insomnia-behavioral", "ref-aasm-insomnia-pharmacologic", "ref-ags-beers-2023", "ref-ihi-4ms"],
  }),

  makeCase({
    id: "case-possible-osa",
    title: "Possible Obstructive Sleep Apnea",
    teaser: "An 80-year-old with resistant hypertension and morning headaches is told he snores loudly.",
    summary: "Recognize OSA risk in an older adult and prioritize diagnostic testing while addressing safety.",
    initialSummary: "An 80-year-old man presents with fatigue, morning headaches, and worsening blood pressure control. His daughter says the whole house can hear him snore.",
    difficulty: "intermediate",
    estimatedMinutes: 18,
    tags: ["sleep-apnea", "cognition", "falls"],
    patient: { age: 80, pronouns: "he/him", livingSituation: "Lives with his daughter after a recent move.", relevantHistory: ["Hypertension", "Atrial fibrillation", "Obesity", "Mild cognitive concerns"] },
    learningObjectives: [
      { id: "osa-lo-risk", text: "Identify OSA risk features in an older adult with cardiometabolic comorbidity." },
      { id: "osa-lo-testing", text: "Choose diagnostic testing and safety counseling appropriate to complexity and comorbidity." },
    ],
    reasoningPathways: ["Probable OSA with loud snoring, witnessed apneas, sleepiness, morning headaches, and hypertension", "Insomnia if awakenings and worry dominate without breathing clues", "Medication or alcohol-related sedation if respiratory depressants are present", "Multifactorial geriatric sleep problem because cognition, driving, and cardiovascular risk interact"],
    redFlags: ["Witnessed apneas", "Drowsy driving", "Cardiovascular comorbidity", "Morning headaches and sleepiness"],
    recommendedPriorities: ["Address drowsy driving and safety immediately", "Assess OSA risk and arrange sleep testing", "Review medications and alcohol that worsen sleep-disordered breathing", "Coordinate cardiometabolic risk follow-up"],
    educationalFeedback: ["OSA can present as fatigue, cognitive change, resistant hypertension, morning headache, and falls risk in older adults.", "The testing choice should reflect comorbidity and clinical complexity."],
    initialInfoIds: ["osa-chief", "osa-context", "osa-history"],
    information: [
      { id: "osa-chief", label: "Presenting Concern", category: "history", detail: "He reports nonrestorative sleep and morning headaches three to four days per week." },
      { id: "osa-context", label: "Function", category: "function", detail: "He nods off during television and recently drifted over the lane marker while driving." },
      { id: "osa-history", label: "Clinical Context", category: "history", detail: "BMI is 34. Blood pressure requires three agents, and atrial fibrillation is rate controlled." },
      { id: "osa-breathing", label: "Breathing During Sleep", category: "symptoms", detail: "His daughter reports loud snoring, witnessed pauses, and gasping when he sleeps in a recliner." },
      { id: "osa-insomnia", label: "Sleep Continuity", category: "symptoms", detail: "He wakes frequently but usually falls asleep quickly and does not spend prolonged periods worrying in bed." },
      { id: "osa-meds", label: "Medication and Alcohol Review", category: "medications", detail: "He takes no opioids or benzodiazepines. He drinks one beer with dinner most nights." },
      { id: "osa-cognition", label: "Mentation", category: "history", detail: "His daughter notices slower attention in the morning but no acute confusion or hallucinations." },
      { id: "osa-goals", label: "Care Preferences", category: "plan", detail: "He wants to keep driving to church but says he will pause driving if safety is a real concern." },
    ],
    followUp: {
      highValueOptionIds: ["osa-ask-breathing", "osa-ask-sleepiness", "osa-ask-comorbid", "osa-ask-meds"],
      options: [
        option("osa-ask-breathing", "Ask about snoring, witnessed apneas, gasping, and sleep position.", "These are central OSA probability clues.", ["osa-breathing"]),
        option("osa-ask-sleepiness", "Assess daytime sleepiness, driving, and unplanned dozing.", "Sleepiness changes urgency and safety counseling.", ["osa-context", "osa-goals"]),
        option("osa-ask-comorbid", "Review cardiometabolic and neurologic comorbidities relevant to testing choice.", "Comorbidity affects whether home testing or polysomnography is appropriate.", ["osa-history", "osa-cognition"]),
        option("osa-ask-meds", "Ask about alcohol, opioids, benzodiazepines, and other respiratory depressants.", "Sedatives and alcohol can worsen breathing and alertness.", ["osa-meds"]),
        option("osa-ask-insomnia", "Clarify whether awakenings are prolonged and worry-driven.", "This helps separate OSA-related awakenings from primary insomnia.", ["osa-insomnia"]),
        option("osa-ask-blue-light", "Focus first on evening screen exposure.", "Sleep hygiene can matter, but it should not distract from high-risk breathing and driving clues."),
      ],
    },
    classification: {
      correctOptionIds: ["osa-class-probable"],
      options: [
        option("osa-class-probable", "High suspicion for obstructive sleep apnea with safety and cardiovascular implications.", "Snoring, witnessed apneas, gasping, sleepiness, morning headaches, obesity, and hypertension cluster strongly."),
        option("osa-class-insomnia", "Primary chronic insomnia.", "The awakenings are not the dominant feature and are paired with breathing clues."),
        option("osa-class-normal", "Normal aging-related sleep fragmentation.", "Witnessed apneas and drowsy driving are not normal aging."),
        option("osa-class-medication", "Medication-related sleepiness as the primary diagnosis.", "Medication review matters, but no major sedating drug explains the full pattern."),
      ],
    },
    redFlagStep: {
      correctOptionIds: ["osa-flag-apneas", "osa-flag-driving", "osa-flag-cv", "osa-flag-cognition"],
      options: [
        option("osa-flag-apneas", "Witnessed apneas and gasping.", "This is a direct clue to sleep-disordered breathing."),
        option("osa-flag-driving", "Sleepiness with lane drifting.", "Driving risk requires immediate counseling."),
        option("osa-flag-cv", "Atrial fibrillation and resistant hypertension.", "Cardiovascular comorbidity raises the stakes of untreated OSA."),
        option("osa-flag-cognition", "Morning attention changes.", "Mentation symptoms can reflect sleep fragmentation while also requiring broader assessment."),
        option("osa-flag-one-beer", "One beer with dinner.", "Worth discussing, but less urgent than witnessed apneas and driving risk."),
      ],
    },
    prioritization: {
      preferredOrder: ["osa-priority-driving", "osa-priority-testing", "osa-priority-comorbid", "osa-priority-behavior"],
      options: [
        option("osa-priority-driving", "Counsel no driving while sleepy and create a transportation plan.", "Immediate harm prevention comes first."),
        option("osa-priority-testing", "Arrange appropriate sleep apnea diagnostic testing.", "Diagnosis is needed before treatment decisions such as PAP therapy."),
        option("osa-priority-comorbid", "Coordinate blood pressure, atrial fibrillation, and cognitive follow-up.", "OSA care should be integrated with comorbidity management."),
        option("osa-priority-behavior", "Discuss alcohol moderation, sleep position, and weight-sensitive counseling without delaying testing.", "Behavioral measures can support care but do not replace diagnostic evaluation."),
      ],
    },
    recommendations: {
      correctOptionIds: ["osa-rec-testing", "osa-rec-driving", "osa-rec-sedatives", "osa-rec-follow-up"],
      options: [
        option("osa-rec-testing", "Refer for sleep apnea testing, using polysomnography when complexity makes home testing less suitable.", "Guidelines support diagnostic testing for adults at increased risk, with test choice shaped by comorbidity."),
        option("osa-rec-driving", "Advise avoiding driving when sleepy and involve family in transportation planning.", "This addresses the highest immediate safety risk."),
        option("osa-rec-sedatives", "Avoid sedatives and review alcohol because they can worsen breathing and alertness.", "Sedation can compound OSA and falls risk."),
        option("osa-rec-follow-up", "Plan follow-up for results, PAP readiness, and cardiometabolic coordination.", "Testing is only useful if results lead to a feasible treatment plan."),
        option("osa-rec-hypnotic", "Start a hypnotic for awakenings before testing.", "This risks worsening sleep-disordered breathing and delays diagnosis."),
      ],
    },
    feedbackSummary: "This case centers on recognizing a high-risk OSA cluster and acting on safety before reassurance or insomnia treatment.",
    formativeFeedback: {
      domains: [
        domain("problem-representation", "Problem Representation", ["osa-ask-breathing", "osa-ask-sleepiness", "osa-class-probable"], "You represented the case as probable OSA with safety and cardiometabolic relevance.", "Link snoring, apneas, sleepiness, morning headache, obesity, and hypertension into the problem statement."),
        domain("red-flag-recognition", "Red Flag Recognition", ["osa-flag-apneas", "osa-flag-driving", "osa-flag-cv", "osa-flag-cognition"], "You recognized the major OSA danger signals.", "Do not miss witnessed apneas, drowsy driving, cardiovascular disease, and mentation change."),
        domain("prioritization", "Prioritization", ["osa-priority-driving", "osa-priority-testing", "osa-priority-comorbid"], "Your priorities handled immediate safety and diagnostic next steps.", "Safety counseling and testing should precede general sleep hygiene advice."),
        domain("recommendation-quality", "Recommendation Quality", ["osa-rec-testing", "osa-rec-driving", "osa-rec-sedatives", "osa-rec-follow-up"], "Your recommendations are aligned with suspected OSA and older-adult risk.", "A strong plan includes testing, driving safety, sedative avoidance, and follow-up."),
        domain("age-friendly-framing", "Age-Friendly Framing", ["osa-ask-comorbid", "osa-ask-sleepiness", "osa-rec-driving", "osa-rec-follow-up"], "You framed OSA through function, mentation, mobility, and what matters.", "Tie OSA to driving, cognition, and patient goals."),
      ],
      diagnosticClues: sleepClues("osa", ["osa-ask-insomnia", "osa-class-insomnia"], ["osa-ask-breathing", "osa-flag-apneas", "osa-rec-testing"], [], ["osa-ask-meds", "osa-rec-sedatives"], ["osa-ask-comorbid", "osa-flag-cognition", "osa-rec-follow-up"]),
      fourMs: commonFourMs(["osa-ask-sleepiness", "osa-rec-driving"], ["osa-ask-meds", "osa-rec-sedatives"], ["osa-ask-comorbid", "osa-flag-cognition"], ["osa-flag-driving", "osa-rec-driving"]),
    },
    referenceIds: ["ref-aasm-osa-diagnostic", "ref-aasm-insomnia-behavioral", "ref-ags-beers-2023", "ref-ihi-4ms"],
  }),

  makeCase({
    id: "case-possible-rls",
    title: "Possible Restless Legs Syndrome",
    teaser: "A 74-year-old describes evening leg discomfort that improves when she walks the hallway.",
    summary: "Use symptom timing and relief pattern to distinguish RLS from cramps, neuropathy, insomnia, and medication effects.",
    initialSummary: "A 74-year-old woman reports that her legs feel 'electric and crawling' most evenings when she sits to watch television, delaying sleep onset.",
    difficulty: "intermediate",
    estimatedMinutes: 17,
    tags: ["restless-legs", "medications", "insomnia"],
    patient: { age: 74, pronouns: "she/her", livingSituation: "Lives with a partner in a single-story home.", relevantHistory: ["Chronic kidney disease stage 3a", "Iron deficiency history", "Peripheral neuropathy ruled out previously"] },
    learningObjectives: [
      { id: "rls-lo-criteria", text: "Apply core RLS symptom criteria and distinguish common mimics." },
      { id: "rls-lo-iron", text: "Prioritize iron studies and exacerbating-factor review before medication selection." },
    ],
    reasoningPathways: ["RLS if urge to move, rest worsening, evening predominance, and relief with movement are present", "Nocturnal leg cramps if painful focal muscle tightening dominates", "Neuropathy if symptoms are constant and not relieved by movement", "Medication-exacerbated RLS if antihistaminergic or serotonergic drugs are present"],
    redFlags: ["Symptoms causing severe sleep loss", "CKD and possible iron deficiency", "Sedating antihistamine use that may worsen symptoms and cognition"],
    recommendedPriorities: ["Confirm RLS criteria and exclude mimics", "Check ferritin and transferrin saturation", "Address exacerbating medications and caffeine/alcohol", "Discuss evidence-based therapy if symptoms persist"],
    educationalFeedback: ["RLS diagnosis is clinical and pattern-based; learners should not equate all leg discomfort with RLS.", "Iron assessment and exacerbating-factor review are essential first moves."],
    initialInfoIds: ["rls-chief", "rls-context", "rls-history"],
    information: [
      { id: "rls-chief", label: "Presenting Concern", category: "symptoms", detail: "The discomfort begins after dinner when she sits still and makes it hard to initiate sleep." },
      { id: "rls-context", label: "Function", category: "function", detail: "She walks around the hallway for relief but then feels tired the next morning." },
      { id: "rls-history", label: "Clinical Context", category: "history", detail: "She has CKD stage 3a and was treated for iron deficiency anemia several years ago." },
      { id: "rls-criteria", label: "Symptom Pattern", category: "symptoms", detail: "Symptoms worsen at rest, are strongest in the evening, and improve while walking or stretching." },
      { id: "rls-mimics", label: "Mimic Screen", category: "symptoms", detail: "She denies focal calf cramping, joint pain, leg swelling, and constant burning numbness." },
      { id: "rls-medications", label: "Medication Review", category: "medications", detail: "She uses diphenhydramine for seasonal allergies and started sertraline six months ago." },
      { id: "rls-breathing", label: "Breathing and Sleepiness", category: "symptoms", detail: "No snoring or witnessed apneas. She feels fatigued after poor sleep but does not doze while driving." },
      { id: "rls-goals", label: "Care Preferences", category: "plan", detail: "She wants to sleep without feeling groggy and is willing to complete lab testing." },
    ],
    followUp: {
      highValueOptionIds: ["rls-ask-criteria", "rls-ask-mimics", "rls-ask-meds", "rls-ask-iron"],
      options: [
        option("rls-ask-criteria", "Ask whether symptoms worsen at rest or evening and improve with movement.", "These features define the RLS reasoning pathway.", ["rls-criteria"]),
        option("rls-ask-mimics", "Ask about cramps, neuropathy, edema, arthritis, and positional discomfort.", "RLS mimics are common and change management.", ["rls-mimics"]),
        option("rls-ask-meds", "Review antihistamines, antidepressants, dopamine blockers, caffeine, and alcohol.", "Exacerbating factors should be addressed early.", ["rls-medications"]),
        option("rls-ask-iron", "Ask about iron deficiency, kidney disease, and recent labs.", "Iron status strongly influences RLS treatment decisions.", ["rls-history", "rls-goals"]),
        option("rls-ask-breathing", "Screen for snoring, apneas, and drowsy driving.", "OSA can coexist and should not be ignored, though it is less likely here.", ["rls-breathing"]),
        option("rls-ask-tracker", "Ask for consumer sleep-stage percentages.", "Tracker staging is not needed to establish RLS criteria."),
      ],
    },
    classification: {
      correctOptionIds: ["rls-class-probable"],
      options: [
        option("rls-class-probable", "Probable restless legs syndrome with medication and iron-status contributors to assess.", "The pattern is rest-related, evening-predominant, and relieved by movement."),
        option("rls-class-insomnia", "Primary chronic insomnia only.", "Sleep-onset difficulty is secondary to leg symptoms rather than conditioned arousal alone."),
        option("rls-class-osa", "Probable obstructive sleep apnea.", "Breathing clues are absent."),
        option("rls-class-cramps", "Nocturnal leg cramps.", "The symptoms are not focal painful muscle contractions."),
      ],
    },
    redFlagStep: {
      correctOptionIds: ["rls-flag-iron", "rls-flag-meds", "rls-flag-ckd"],
      options: [
        option("rls-flag-iron", "History of iron deficiency.", "Iron studies are a core part of clinically significant RLS evaluation."),
        option("rls-flag-meds", "Diphenhydramine and serotonergic medication exposure.", "Some medications can exacerbate RLS and add geriatric safety risk."),
        option("rls-flag-ckd", "Chronic kidney disease.", "CKD increases RLS relevance and affects medication choice."),
        option("rls-flag-apneas", "Witnessed apneas.", "This would be important, but it was denied."),
      ],
    },
    prioritization: {
      preferredOrder: ["rls-priority-confirm", "rls-priority-iron", "rls-priority-exacerbators", "rls-priority-treatment"],
      options: [
        option("rls-priority-confirm", "Confirm RLS criteria and exclude common mimics.", "Clinical pattern comes before treatment."),
        option("rls-priority-iron", "Order ferritin and transferrin saturation.", "Iron results guide whether iron replacement is appropriate."),
        option("rls-priority-exacerbators", "Reduce exacerbating medications when feasible and coordinate with prescribers.", "Addressing triggers may reduce symptoms without adding sedating medication."),
        option("rls-priority-treatment", "Discuss evidence-based RLS treatments if symptoms remain clinically significant.", "Treatment choice should reflect kidney function, fall risk, and patient goals."),
      ],
    },
    recommendations: {
      correctOptionIds: ["rls-rec-iron", "rls-rec-med-review", "rls-rec-mimics", "rls-rec-shared"],
      options: [
        option("rls-rec-iron", "Check morning iron studies, including ferritin and transferrin saturation.", "Guideline-based RLS care begins with iron assessment when symptoms are clinically significant."),
        option("rls-rec-med-review", "Discuss alternatives to diphenhydramine and review sertraline risk-benefit with the prescribing clinician.", "Medication optimization can reduce symptoms and geriatric harms."),
        option("rls-rec-mimics", "Document why cramps, neuropathy, edema, and arthritis are less likely.", "RLS diagnosis is stronger when mimics are explicitly considered."),
        option("rls-rec-shared", "If persistent, discuss treatment options using shared decision-making and fall-risk awareness.", "Some effective medications can cause dizziness or somnolence."),
        option("rls-rec-dopamine-first", "Start levodopa nightly as the default long-term first-line therapy.", "Dopaminergic augmentation risk makes this a poor default choice."),
      ],
    },
    feedbackSummary: "This case emphasizes pattern recognition and treatment restraint: confirm RLS, check iron, remove exacerbators, and select therapy with older-adult safety in mind.",
    formativeFeedback: {
      domains: [
        domain("problem-representation", "Problem Representation", ["rls-ask-criteria", "rls-ask-mimics", "rls-class-probable"], "You represented the case as probable RLS while checking mimics.", "Use the RLS criteria explicitly: rest, evening, movement relief, and exclusion of mimics."),
        domain("red-flag-recognition", "Red Flag Recognition", ["rls-flag-iron", "rls-flag-meds", "rls-flag-ckd"], "You recognized the major contributors that change evaluation and treatment.", "Do not miss iron deficiency, CKD, and exacerbating medications."),
        domain("prioritization", "Prioritization", ["rls-priority-confirm", "rls-priority-iron", "rls-priority-exacerbators"], "Your priorities match guideline-consistent RLS care.", "Confirm the pattern and check iron before jumping to chronic medication."),
        domain("recommendation-quality", "Recommendation Quality", ["rls-rec-iron", "rls-rec-med-review", "rls-rec-mimics", "rls-rec-shared"], "Your recommendations are diagnostically precise and age-aware.", "Include iron studies, medication review, mimic assessment, and shared treatment planning."),
        domain("age-friendly-framing", "Age-Friendly Framing", ["rls-ask-meds", "rls-rec-med-review", "rls-rec-shared"], "You considered medication harm and treatment side effects in an older adult.", "Name fall risk, mentation, and the patient's wish to avoid grogginess."),
      ],
      diagnosticClues: sleepClues("rls", ["rls-class-insomnia"], ["rls-ask-breathing", "rls-class-osa"], ["rls-ask-criteria", "rls-class-probable", "rls-rec-iron"], ["rls-ask-meds", "rls-flag-meds", "rls-rec-med-review"], ["rls-ask-iron", "rls-flag-ckd", "rls-rec-shared"]),
      fourMs: commonFourMs(["rls-rec-shared"], ["rls-ask-meds", "rls-rec-med-review"], ["rls-flag-meds", "rls-rec-shared"], ["rls-rec-shared"]),
    },
    referenceIds: ["ref-aasm-rls-treatment", "ref-ags-beers-2023", "ref-aasm-insomnia-behavioral", "ref-ihi-4ms"],
  }),

  makeCase({
    id: "case-otc-pm-medication",
    title: "OTC PM Medication and Next-Day Risk",
    teaser: "An 82-year-old uses a nightly PM pain reliever and now has dry mouth, grogginess, and near falls.",
    summary: "Identify diphenhydramine-related sleep and safety problems and design a deprescribing-oriented plan.",
    initialSummary: "An 82-year-old woman reports poor sleep and morning grogginess. She started an OTC 'PM' pain reliever after seeing it advertised as non-habit forming.",
    difficulty: "introductory",
    estimatedMinutes: 16,
    tags: ["medications", "cognition", "falls"],
    patient: { age: 82, pronouns: "she/her", livingSituation: "Lives in an assisted living apartment and manages most activities independently.", relevantHistory: ["Osteoarthritis", "Constipation", "Overactive bladder", "Mild cognitive impairment"] },
    learningObjectives: [
      { id: "pm-lo-medication", text: "Recognize anticholinergic OTC sleep aids as a modifiable cause of sleep, cognition, and fall risk." },
      { id: "pm-lo-plan", text: "Develop a nonjudgmental medication safety and deprescribing plan." },
    ],
    reasoningPathways: ["Medication-related sleep problem from diphenhydramine with anticholinergic burden", "Chronic pain-related insomnia as a contributor", "OSA or RLS if targeted symptoms emerge", "Multifactorial geriatric risk because cognition, constipation, nocturia, and mobility interact"],
    redFlags: ["Nightly diphenhydramine exposure", "Morning grogginess", "Near falls", "Constipation, urinary symptoms, and cognitive vulnerability"],
    recommendedPriorities: ["Identify the active OTC PM ingredient and anticholinergic burden", "Assess falls, cognition, constipation, urinary retention, and pain control", "Plan deprescribing/substitution with pain-focused and behavioral sleep strategies", "Avoid adding sedative hypnotics"],
    educationalFeedback: ["Non-habit-forming marketing can obscure anticholinergic harm.", "The plan should validate pain and sleep distress while shifting away from diphenhydramine."],
    initialInfoIds: ["pm-chief", "pm-context", "pm-history"],
    information: [
      { id: "pm-chief", label: "Presenting Concern", category: "history", detail: "She wakes groggy and says her sleep is not refreshing despite taking a PM product nightly." },
      { id: "pm-context", label: "Function", category: "function", detail: "She has had two near falls walking to breakfast and recently stopped attending morning exercise." },
      { id: "pm-history", label: "Clinical Context", category: "history", detail: "She has osteoarthritis pain at night, constipation, overactive bladder, and mild cognitive impairment." },
      { id: "pm-medication", label: "OTC Ingredient", category: "medications", detail: "The PM product contains acetaminophen and diphenhydramine 25 mg. She sometimes takes a second tablet." },
      { id: "pm-anticholinergic", label: "Anticholinergic Symptoms", category: "symptoms", detail: "She reports dry mouth, constipation, blurry morning vision, and slower thinking." },
      { id: "pm-pain", label: "Pain Pattern", category: "symptoms", detail: "Knee pain wakes her when she rolls over. Heat and daytime walking help, but non-sedating pain care has not been optimized." },
      { id: "pm-breathing-legs", label: "OSA and RLS Screen", category: "symptoms", detail: "No snoring, witnessed apneas, urge to move the legs, or evening rest-related leg discomfort." },
      { id: "pm-goals", label: "Care Preferences", category: "plan", detail: "She worries clinicians will take away the only thing that works but wants to avoid falls." },
    ],
    followUp: {
      highValueOptionIds: ["pm-ask-ingredient", "pm-ask-anticholinergic", "pm-ask-falls", "pm-ask-pain"],
      options: [
        option("pm-ask-ingredient", "Ask her to bring the OTC bottle and identify active ingredients and dose.", "PM products often contain diphenhydramine or doxylamine.", ["pm-medication"]),
        option("pm-ask-anticholinergic", "Ask about dry mouth, constipation, urinary symptoms, blurry vision, and cognition.", "These symptoms point toward anticholinergic burden.", ["pm-anticholinergic"]),
        option("pm-ask-falls", "Ask about morning grogginess, near falls, and activity restriction.", "Fall and mobility impact determine urgency.", ["pm-context", "pm-goals"]),
        option("pm-ask-pain", "Clarify pain timing and non-sedating pain strategies.", "Pain may be the treatable driver behind PM medication use.", ["pm-pain"]),
        option("pm-ask-osa-rls", "Screen briefly for OSA and RLS symptoms.", "Do not assume every sleep complaint is medication-related without checking common alternatives.", ["pm-breathing-legs"]),
        option("pm-ask-brand", "Ask whether she prefers blue or white tablets.", "Tablet appearance does not establish the active ingredient or risk."),
      ],
    },
    classification: {
      correctOptionIds: ["pm-class-medication"],
      options: [
        option("pm-class-medication", "Medication-related sleep and safety problem from diphenhydramine-containing OTC PM use.", "Nightly exposure plus anticholinergic symptoms, grogginess, and near falls strongly support this pathway."),
        option("pm-class-insomnia", "Primary chronic insomnia requiring a hypnotic.", "Pain and medication effects are central and must be addressed first."),
        option("pm-class-osa", "Probable obstructive sleep apnea.", "Breathing symptoms are absent."),
        option("pm-class-normal", "Normal aging-related sleep change only.", "Near falls and anticholinergic symptoms are not benign aging."),
      ],
    },
    redFlagStep: {
      correctOptionIds: ["pm-flag-diphenhydramine", "pm-flag-falls", "pm-flag-mentation", "pm-flag-burden"],
      options: [
        option("pm-flag-diphenhydramine", "Nightly diphenhydramine use.", "First-generation antihistamines are potentially inappropriate for most older adults."),
        option("pm-flag-falls", "Morning grogginess with near falls.", "Sedation is already translating into mobility risk."),
        option("pm-flag-mentation", "Mild cognitive impairment with slower thinking.", "Anticholinergic exposure can worsen mentation."),
        option("pm-flag-burden", "Constipation, urinary symptoms, and dry mouth.", "Multiple anticholinergic effects strengthen the causal link."),
      ],
    },
    prioritization: {
      preferredOrder: ["pm-priority-safety", "pm-priority-deprescribe", "pm-priority-pain", "pm-priority-sleep"],
      options: [
        option("pm-priority-safety", "Address falls, morning supervision, and immediate nighttime safety.", "Near falls make this urgent."),
        option("pm-priority-deprescribe", "Create a patient-centered plan to stop diphenhydramine and avoid similar PM products.", "Removing the offending drug is central."),
        option("pm-priority-pain", "Treat osteoarthritis pain with non-sedating approaches.", "If pain remains untreated, the patient may restart the PM product."),
        option("pm-priority-sleep", "Add behavioral sleep supports after medication and pain contributors are addressed.", "Sleep routine support helps maintain the change."),
      ],
    },
    recommendations: {
      correctOptionIds: ["pm-rec-stop", "pm-rec-pain", "pm-rec-safety", "pm-rec-education"],
      options: [
        option("pm-rec-stop", "Stop diphenhydramine-containing PM products with a clear substitute plan.", "Deprescribing succeeds when it addresses the reason the patient started the medication."),
        option("pm-rec-pain", "Coordinate non-sedating osteoarthritis pain management.", "Pain control can improve sleep without anticholinergic burden."),
        option("pm-rec-safety", "Implement fall precautions and reassess morning alertness.", "Safety outcomes are the near-term marker of success."),
        option("pm-rec-education", "Explain anticholinergic effects nonjudgmentally and teach label checking for PM products.", "Education reduces recurrence with similar OTC products."),
        option("pm-rec-benzo", "Replace the PM product with a benzodiazepine hypnotic.", "This substitutes one high-risk sedative strategy for another."),
      ],
    },
    feedbackSummary: "This case teaches medication literacy: the active ingredient matters more than the marketing label, and sleep plans must address the symptom the OTC product was trying to solve.",
    formativeFeedback: {
      domains: [
        domain("problem-representation", "Problem Representation", ["pm-ask-ingredient", "pm-ask-anticholinergic", "pm-class-medication"], "You connected the sleep complaint to diphenhydramine and anticholinergic burden.", "Identify the OTC ingredient and symptom cluster before labeling this insomnia."),
        domain("red-flag-recognition", "Red Flag Recognition", ["pm-flag-diphenhydramine", "pm-flag-falls", "pm-flag-mentation", "pm-flag-burden"], "You recognized the medication safety red flags.", "Do not miss diphenhydramine, near falls, cognitive vulnerability, and anticholinergic symptoms."),
        domain("prioritization", "Prioritization", ["pm-priority-safety", "pm-priority-deprescribe", "pm-priority-pain"], "Your priorities address harm, cause, and the reason for use.", "Prioritize fall safety, deprescribing, and pain control before generic sleep advice."),
        domain("recommendation-quality", "Recommendation Quality", ["pm-rec-stop", "pm-rec-pain", "pm-rec-safety", "pm-rec-education"], "Your recommendations are practical and reduce recurrence.", "Include stopping the medication, safer pain care, fall precautions, and label education."),
        domain("age-friendly-framing", "Age-Friendly Framing", ["pm-ask-falls", "pm-flag-mentation", "pm-rec-safety", "pm-rec-education"], "You framed the plan through mobility, mentation, medication, and what matters.", "Make the patient goal explicit: better sleep without falls or cognitive worsening."),
      ],
      diagnosticClues: sleepClues("pm", ["pm-class-insomnia", "pm-rec-pain"], ["pm-ask-osa-rls", "pm-class-osa"], ["pm-ask-osa-rls"], ["pm-ask-ingredient", "pm-flag-diphenhydramine", "pm-rec-stop"], ["pm-ask-pain", "pm-flag-falls", "pm-rec-pain", "pm-rec-safety"]),
      fourMs: commonFourMs(["pm-goals", "pm-rec-education"], ["pm-ask-ingredient", "pm-rec-stop"], ["pm-flag-mentation", "pm-ask-anticholinergic"], ["pm-ask-falls", "pm-rec-safety"]),
    },
    referenceIds: ["ref-ags-beers-2023", "ref-cdc-steadi", "ref-aasm-insomnia-behavioral", "ref-ihi-4ms"],
  }),

  makeCase({
    id: "case-multifactorial-falls-nocturia",
    title: "Falls Risk and Nighttime Bathroom Trips",
    teaser: "A 78-year-old has fragmented sleep, evening diuretic use, loud snoring, and a nighttime fall.",
    summary: "Integrate insomnia symptoms, nocturia, medication timing, OSA risk, and fall prevention.",
    initialSummary: "A 78-year-old woman reports three months of fragmented sleep and daytime fatigue after a nighttime fall on the way to the bathroom.",
    difficulty: "advanced",
    estimatedMinutes: 22,
    tags: ["insomnia", "sleep-apnea", "medications", "falls", "nocturia"],
    patient: { age: 78, pronouns: "she/her", livingSituation: "Lives independently with nearby family support.", relevantHistory: ["Hypertension", "Osteoarthritis", "Nocturia", "Recent fall without fracture"] },
    learningObjectives: [
      { id: "multi-lo-integrate", text: "Build a multifactorial sleep problem representation in an older adult." },
      { id: "multi-lo-prioritize", text: "Prioritize safety, medication timing, OSA evaluation, and behavioral insomnia care." },
    ],
    reasoningPathways: ["Multifactorial geriatric sleep problem with nocturia, fall risk, medication timing, insomnia symptoms, and possible OSA", "OSA if snoring and witnessed apneas are confirmed", "Medication-related risk from evening diuretic timing or sedating OTC products", "Chronic insomnia symptoms if prolonged sleep latency and conditioned arousal persist after contributors are addressed"],
    redFlags: ["Recent nighttime fall", "Nocturia with bathroom trips in darkness", "Loud snoring and witnessed apneas", "Diphenhydramine use and evening diuretic timing", "Daytime drowsiness"],
    recommendedPriorities: ["Address immediate nighttime fall prevention and drowsy driving", "Review medications, especially diuretic timing and anticholinergic sleep aids", "Evaluate OSA risk and arrange testing when indicated", "Use behavioral insomnia strategies and nocturia management supports"],
    educationalFeedback: ["The teaching goal is to avoid single-cause closure.", "Learners should connect urinary symptoms, medications, breathing, mobility, and daytime function."],
    initialInfoIds: ["multi-chief", "multi-context", "multi-history"],
    information: [
      { id: "multi-chief", label: "Presenting Concern", category: "history", detail: "She reports fragmented sleep, daytime fatigue, and anxiety about another nighttime fall." },
      { id: "multi-context", label: "Home Context", category: "function", detail: "She lives alone, walks without an assistive device, and keeps the bathroom light off to avoid fully waking." },
      { id: "multi-history", label: "Known History", category: "history", detail: "Hypertension, osteoarthritis, nocturia, and a recent fall while walking to the bathroom at night." },
      { id: "multi-pattern", label: "Sleep Pattern", category: "symptoms", detail: "Bedtime is 8:30 PM, sleep onset takes about 45 minutes, and she wakes four to five times nightly." },
      { id: "multi-breathing", label: "Breathing Clues", category: "symptoms", detail: "Her daughter has noticed loud snoring and occasional pauses in breathing during naps." },
      { id: "multi-medications", label: "Medication Review", category: "medications", detail: "She takes hydrochlorothiazide in the evening and uses diphenhydramine several nights per week." },
      { id: "multi-daytime", label: "Daytime Function", category: "function", detail: "She feels drowsy after lunch, has stopped morning walks, and worries about another fall." },
      { id: "multi-mood", label: "Mood and Stimulants", category: "history", detail: "Mood is stable. She drinks two cups of coffee before noon and no alcohol." },
      { id: "multi-exam", label: "Focused Exam", category: "exam", detail: "BMI is 31, blood pressure is controlled, and oxygen saturation is normal at rest." },
      { id: "multi-goals", label: "Care Preferences", category: "plan", detail: "She wants to avoid sedating medicines and is open to changing routines if the plan is practical." },
    ],
    followUp: {
      highValueOptionIds: ["multi-ask-pattern", "multi-ask-breathing", "multi-ask-medications", "multi-ask-daytime"],
      options: [
        option("multi-ask-pattern", "Ask about sleep timing, awakenings, nocturia, naps, and routine.", "The pattern identifies insomnia symptoms, nocturia burden, and sleep opportunity.", ["multi-pattern"]),
        option("multi-ask-breathing", "Ask about snoring, witnessed apneas, and morning headaches.", "Breathing symptoms are high-yield because sleep apnea is common and treatable.", ["multi-breathing", "multi-exam"]),
        option("multi-ask-medications", "Review prescription timing and OTC sleep aids.", "Evening diuretic timing and anticholinergic sleep aids can worsen nocturia, sedation, and falls.", ["multi-medications"]),
        option("multi-ask-daytime", "Ask how fatigue affects driving, activity, and falls.", "Functional impact sets urgency and connects sleep concerns to safety.", ["multi-daytime", "multi-goals"]),
        option("multi-ask-mood", "Ask about mood, caffeine, alcohol, and evening routines.", "Mood and stimulant patterns can contribute to sleep disruption.", ["multi-mood"]),
        option("multi-ask-tracker", "Ask whether a consumer sleep tracker is available.", "Tracker data can supplement but not replace targeted clinical history."),
      ],
    },
    classification: {
      correctOptionIds: ["multi-class-mixed"],
      options: [
        option("multi-class-mixed", "Multifactorial geriatric sleep problem with possible OSA, medication contribution, nocturia, falls risk, and insomnia symptoms.", "The history contains several interacting contributors rather than one clean diagnosis."),
        option("multi-class-primary-insomnia", "Primary insomnia without medical or medication contributors.", "This misses nocturia, breathing, medication, and fall clues."),
        option("multi-class-normal-aging", "Normal aging-related sleep change requiring reassurance only.", "Falls, witnessed apneas, medication risk, and daytime impairment exceed normal aging."),
        option("multi-class-rls", "Restless legs syndrome as the single unifying diagnosis.", "No urge-to-move leg symptom pattern is described."),
      ],
    },
    redFlagStep: {
      correctOptionIds: ["multi-flag-apneas", "multi-flag-fall", "multi-flag-sedating-med", "multi-flag-driving", "multi-flag-nocturia"],
      options: [
        option("multi-flag-apneas", "Loud snoring with witnessed breathing pauses.", "This should prompt OSA assessment rather than sedative treatment."),
        option("multi-flag-fall", "Recent nighttime fall.", "Falls make nocturnal awakenings and bathroom trips safety-critical."),
        option("multi-flag-sedating-med", "Regular diphenhydramine use.", "Anticholinergic sedation can worsen cognition, urinary symptoms, and falls."),
        option("multi-flag-driving", "Daytime drowsiness with ongoing activities.", "Sleepiness can create immediate safety risk."),
        option("multi-flag-nocturia", "Frequent nighttime bathroom trips in a dark environment.", "Nocturia plus darkness and sedation is a fall-risk multiplier."),
        option("multi-flag-caffeine", "Two coffees before noon.", "Morning caffeine is lower priority than safety and breathing clues."),
      ],
    },
    prioritization: {
      preferredOrder: ["multi-priority-safety", "multi-priority-med-review", "multi-priority-osa", "multi-priority-cbti"],
      options: [
        option("multi-priority-safety", "Address immediate safety: lighting, bathroom path, fall prevention, and drowsy driving counseling.", "Falls and sleepiness create near-term harm risk."),
        option("multi-priority-med-review", "Reduce sleep-disrupting or sedating medication contributors with the prescribing clinician.", "Diuretic timing and diphenhydramine are modifiable contributors."),
        option("multi-priority-osa", "Assess OSA risk and arrange appropriate testing.", "Breathing clues and sleepiness make OSA evaluation important."),
        option("multi-priority-cbti", "Begin behavioral insomnia strategies tailored to her routine.", "Behavioral treatment is appropriate once safety and medication issues are addressed."),
      ],
    },
    recommendations: {
      correctOptionIds: ["multi-rec-sleep-apnea", "multi-rec-medication", "multi-rec-safety", "multi-rec-behavioral", "multi-rec-nocturia"],
      options: [
        option("multi-rec-sleep-apnea", "Screen for OSA and arrange sleep testing when indicated.", "Witnessed apneas, snoring, BMI, and sleepiness support evaluation."),
        option("multi-rec-medication", "Discuss stopping diphenhydramine and moving diuretic timing earlier if clinically appropriate.", "This targets sedation, nocturia, and fall risk while respecting prescribing boundaries."),
        option("multi-rec-safety", "Create a nighttime safety plan with lighting, clear path, footwear, and assistive-device review.", "Environmental and mobility supports reduce immediate risk."),
        option("multi-rec-behavioral", "Use sleep diary, stimulus control, consistent wake time, and daytime activity goals.", "Behavioral insomnia care is a durable non-sedating strategy."),
        option("multi-rec-nocturia", "Review evening fluids, bladder symptoms, and medication timing contributing to nocturia.", "Nocturia is both a sleep and fall-risk issue."),
        option("multi-rec-benzodiazepine", "Start a benzodiazepine hypnotic as first-line therapy.", "Sedatives can worsen falls, cognition, and next-day impairment."),
      ],
    },
    feedbackSummary: "Strong reasoning in this case connects sleep symptoms to safety, medications, breathing risk, nocturia, and function. The goal is not to name one diagnosis too early, but to build a prioritized, patient-centered plan.",
    formativeFeedback: {
      domains: [
        domain("problem-representation", "Problem Representation", ["multi-ask-pattern", "multi-ask-breathing", "multi-ask-medications", "multi-ask-daytime", "multi-class-mixed"], "You represented the problem as multifactorial rather than stopping at a single symptom label.", "Link sleep pattern, breathing risk, medication effects, nocturia, falls, and function."),
        domain("red-flag-recognition", "Red Flag Recognition", ["multi-flag-apneas", "multi-flag-fall", "multi-flag-sedating-med", "multi-flag-driving", "multi-flag-nocturia"], "You recognized the major safety and sleep-disordered breathing concerns.", "Look again for witnessed apneas, falls, sedating medication, drowsiness, and nocturia."),
        domain("prioritization", "Prioritization", ["multi-priority-safety", "multi-priority-med-review", "multi-priority-osa", "multi-priority-cbti"], "Your priorities balanced immediate safety with modifiable contributors and diagnostic follow-up.", "Prioritize harm reduction before longer-term insomnia work."),
        domain("recommendation-quality", "Recommendation Quality", ["multi-rec-sleep-apnea", "multi-rec-medication", "multi-rec-safety", "multi-rec-behavioral", "multi-rec-nocturia"], "Your recommendations match the risk profile and avoid reflexive sedative prescribing.", "Recommendations should address OSA, medication risk, safety, behavioral sleep care, and nocturia."),
        domain("age-friendly-framing", "Age-Friendly Framing", ["multi-ask-daytime", "multi-ask-medications", "multi-priority-safety", "multi-rec-safety", "multi-rec-medication"], "You framed the plan around function, safety, medication burden, mobility, and patient goals.", "Name function, fall risk, medication burden, and what matters."),
      ],
      diagnosticClues: sleepClues("multi", ["multi-ask-pattern", "multi-class-mixed", "multi-rec-behavioral"], ["multi-ask-breathing", "multi-flag-apneas", "multi-rec-sleep-apnea"], ["multi-class-rls"], ["multi-ask-medications", "multi-flag-sedating-med", "multi-rec-medication"], ["multi-class-mixed", "multi-priority-safety", "multi-rec-nocturia"]),
      fourMs: commonFourMs(["multi-ask-daytime", "multi-goals", "multi-rec-behavioral"], ["multi-ask-medications", "multi-rec-medication"], ["multi-flag-sedating-med", "multi-rec-medication"], ["multi-flag-fall", "multi-flag-nocturia", "multi-rec-safety"]),
    },
    referenceIds: ["ref-aasm-osa-diagnostic", "ref-aasm-insomnia-behavioral", "ref-ags-beers-2023", "ref-cdc-steadi", "ref-ihi-4ms"],
  }),
];
