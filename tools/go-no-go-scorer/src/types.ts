export interface Criterion {
  id: number;
  name: string;
  weight: number; // Percentage (e.g., 20 for 20%)
  description: string;
  scoringGuide: ScoringLevel[];
  minimumThreshold?: number;
}

export interface ScoringLevel {
  score: number;
  label: string;
  description: string;
}

export interface CriterionScore {
  criterionId: number;
  score: number;
  rationale: string;
  dataSource: string;
  confidenceLevel: "Hoog" | "Medium" | "Laag";
  keyFindings: string[];
}

export interface ValidationResult {
  totalScore: number;
  decision: Decision;
  criterionScores: CriterionScore[];
  timestamp: string;
  passedThresholds: boolean;
  thresholdChecks: ThresholdCheck[];
  riskAnalysis: RiskAnalysis;
}

export type Decision =
  | "STRONG GO"
  | "GO"
  | "CONDITIONAL GO"
  | "NO-GO"
  | "STRONG NO-GO";

export interface ThresholdCheck {
  criterion: string;
  required: string;
  actual: number;
  passed: boolean;
}

export interface RiskAnalysis {
  highRisk: RiskItem[];
  mediumRisk: RiskItem[];
  lowRisk: RiskItem[];
}

export interface RiskItem {
  criterion: string;
  score: number;
  description: string;
  mitigationPlan?: string;
}
