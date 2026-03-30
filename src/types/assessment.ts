export type QuestionType = "single_select" | "multi_select" | "scale" | "text";
export type UIVariant = "cards" | "pills" | "dropdown";

export interface ScoreImpact {
  foundation?: number;
  capability?: number;
  strategy?: number;
  adoption_governance?: number;
}

export interface QuestionOption {
  id: string;
  label: string;
  score: ScoreImpact;
  tags?: string[];
  blockerWeight?: number;
}

export interface BonusRule {
  ifSelectedCountGte?: number;
  ifIncludesAll?: string[];
  add: ScoreImpact;
}

export interface QuestionRules {
  minSelections?: number;
  maxSelections?: number;
  weightMultiplier?: number;
  bonus?: BonusRule[];
}

export interface AssessmentQuestion {
  id: string;
  sectionId: string;
  type: QuestionType;
  title: string;
  description?: string;
  required?: boolean;
  options: QuestionOption[];
  rules?: QuestionRules;
  ui?: { variant: UIVariant };
}

export interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface DimensionConfig {
  label: string;
  weight: number;
  maxRawScore: number;
}

export interface MaturityLevel {
  id: string;
  label: string;
  minScore: number;
  maxScore: number;
}

export interface ArchetypeConditions {
  overallScoreMin?: number;
  overallScoreMax?: number;
  foundationMin?: number;
  foundationMax?: number;
  capabilityMin?: number;
  capabilityMax?: number;
  strategyMin?: number;
  strategyMax?: number;
  adoption_governanceMin?: number;
  adoption_governanceMax?: number;
}

export interface Archetype {
  id: string;
  label: string;
  description: string;
  conditions: ArchetypeConditions;
}

export interface ConsistencyRule {
  id: string;
  if?: Record<string, string[]>;
  ifTagsInclude?: string[];
  and?: Record<string, string[]>;
  effect: {
    penalty: ScoreImpact;
    flag: string;
  };
}

export interface StrengthRule {
  id: string;
  ifDimensionGte: Partial<Record<DimensionKey, number>>;
  label: string;
}

export type DimensionKey = "foundation" | "capability" | "strategy" | "adoption_governance";

export interface ScoringSchema {
  version: string;
  dimensions: Record<DimensionKey, DimensionConfig>;
  maturityLevels: MaturityLevel[];
  archetypes: Archetype[];
  consistencyRules: ConsistencyRule[];
  strengthRules: StrengthRule[];
}

export type AnswerValue = string | string[] | number | null;

export interface Answers {
  [questionId: string]: AnswerValue;
}

export interface Blocker {
  id: string;
  label: string;
  severity: number;
}

export interface Strength {
  id: string;
  label: string;
}

export interface Recommendation {
  id: string;
  category: string;
  text: string;
  priority: number;
}

export interface RoadmapItem {
  phase: string;
  items: string[];
}

export interface AssessmentResult {
  overallScore: number;
  maturityLevel: { id: string; label: string };
  archetype: { id: string; label: string };
  dimensionScores: Record<DimensionKey, number>;
  tags: string[];
  topBlockers: Blocker[];
  topStrengths: Strength[];
  consistencyFlags: string[];
  recommendations: Recommendation[];
  roadmap: RoadmapItem[];
}

export interface SessionState {
  startedAt: string;
  lastUpdatedAt: string;
  currentSectionIndex: number;
  completed: boolean;
}
