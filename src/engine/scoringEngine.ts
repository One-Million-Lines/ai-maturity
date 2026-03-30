import type { Answers, DimensionKey, ScoreImpact, AssessmentQuestion, Blocker, Strength, AssessmentResult, Recommendation, RoadmapItem } from "@/types/assessment";
import questionsConfig from "@/config/questions.json";
import scoringConfig from "@/config/scoring.json";
import recommendationsConfig from "@/config/recommendations.json";
import roadmapRulesConfig from "@/config/roadmap-rules.json";

const DIMENSIONS: DimensionKey[] = ["foundation", "capability", "strategy", "adoption_governance"];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Accumulate raw scores from all answered questions
function computeRawScores(answers: Answers): { rawScores: Record<DimensionKey, number>; tags: string[]; blockers: Blocker[] } {
  const rawScores: Record<DimensionKey, number> = { foundation: 0, capability: 0, strategy: 0, adoption_governance: 0 };
  const tags: string[] = [];
  const blockers: Blocker[] = [];
  const questions = questionsConfig.questions as AssessmentQuestion[];

  for (const question of questions) {
    const answer = answers[question.id];
    if (answer == null) continue;

    const multiplier = question.rules?.weightMultiplier ?? 1;
    const selectedIds: string[] = Array.isArray(answer) ? answer : [answer as string];

    for (const selectedId of selectedIds) {
      const option = question.options.find((o) => o.id === selectedId);
      if (!option) continue;

      // Accumulate dimension scores with multiplier
      for (const dim of DIMENSIONS) {
        const impact = (option.score as ScoreImpact)[dim];
        if (impact != null) {
          rawScores[dim] += impact * multiplier;
        }
      }

      // Collect tags
      if (option.tags) {
        tags.push(...option.tags);
      }

      // Collect blockers
      if (option.blockerWeight) {
        blockers.push({ id: option.id, label: option.label, severity: option.blockerWeight });
      }
    }

    // Apply bonus rules
    if (question.rules?.bonus) {
      for (const bonus of question.rules.bonus) {
        let shouldApply = false;

        if (bonus.ifSelectedCountGte != null) {
          shouldApply = selectedIds.length >= bonus.ifSelectedCountGte;
        }
        if (bonus.ifIncludesAll != null) {
          shouldApply = bonus.ifIncludesAll.every((id) => selectedIds.includes(id));
        }

        if (shouldApply) {
          for (const dim of DIMENSIONS) {
            const add = (bonus.add as ScoreImpact)[dim];
            if (add != null) rawScores[dim] += add;
          }
        }
      }
    }
  }

  return { rawScores, tags: [...new Set(tags)], blockers };
}

// Apply consistency rules that penalize contradictory answers
function applyConsistencyRules(answers: Answers, rawScores: Record<DimensionKey, number>, tags: string[]): string[] {
  const flags: string[] = [];

  for (const rule of scoringConfig.consistencyRules) {
    let matches = true;

    // Check tag-based conditions
    if (rule.ifTagsInclude) {
      if (!rule.ifTagsInclude.some((t) => tags.includes(t))) {
        matches = false;
      }
      // Also check the "and" conditions
      if (matches && rule.and) {
        for (const [qId, allowedValues] of Object.entries(rule.and)) {
          const ans = answers[qId];
          if (ans == null) { matches = false; break; }
          const ansArr = Array.isArray(ans) ? ans : [ans as string];
          if (!allowedValues.some((v) => ansArr.includes(v))) { matches = false; break; }
        }
      }
    }

    // Check direct answer conditions
    if (rule.if) {
      for (const [qId, allowedValues] of Object.entries(rule.if)) {
        const ans = answers[qId];
        if (ans == null) { matches = false; break; }
        const ansArr = Array.isArray(ans) ? ans : [ans as string];
        // For multi_select questions like "constraints", check if ANY selected value matches
        if (!allowedValues.some((v) => ansArr.includes(v))) { matches = false; break; }
      }
    }

    if (matches) {
      for (const dim of DIMENSIONS) {
        const penalty = (rule.effect.penalty as Record<string, number>)[dim];
        if (penalty != null) rawScores[dim] += penalty;
      }
      flags.push(rule.id);
    }
  }

  return flags;
}

// Normalize scores to 0-100
function normalizeScores(rawScores: Record<DimensionKey, number>): Record<DimensionKey, number> {
  const normalized = {} as Record<DimensionKey, number>;
  for (const dim of DIMENSIONS) {
    normalized[dim] = clamp(Math.round(rawScores[dim]), 0, 100);
  }
  return normalized;
}

// Compute overall weighted score
function computeOverallScore(dimensionScores: Record<DimensionKey, number>): number {
  const dims = scoringConfig.dimensions as Record<DimensionKey, { weight: number }>;
  let score = 0;
  for (const dim of DIMENSIONS) {
    score += dimensionScores[dim] * dims[dim].weight;
  }
  return clamp(Math.round(score), 0, 100);
}

// Determine maturity level from overall score
function determineMaturityLevel(overallScore: number): { id: string; label: string } {
  for (const level of scoringConfig.maturityLevels) {
    if (overallScore >= level.minScore && overallScore <= level.maxScore) {
      return { id: level.id, label: level.label };
    }
  }
  return { id: "early", label: "Early" };
}

// Determine archetype based on conditions
function determineArchetype(overallScore: number, dimensionScores: Record<DimensionKey, number>): { id: string; label: string } {
  // Iterate in reverse so highest archetype that matches wins
  for (let i = scoringConfig.archetypes.length - 1; i >= 0; i--) {
    const arch = scoringConfig.archetypes[i];
    const c = arch.conditions as Record<string, number>;
    let matches = true;

    if (c.overallScoreMin != null && overallScore < c.overallScoreMin) matches = false;
    if (c.overallScoreMax != null && overallScore > c.overallScoreMax) matches = false;
    if (c.foundationMin != null && dimensionScores.foundation < c.foundationMin) matches = false;
    if (c.foundationMax != null && dimensionScores.foundation > c.foundationMax) matches = false;
    if (c.capabilityMin != null && dimensionScores.capability < c.capabilityMin) matches = false;
    if (c.capabilityMax != null && dimensionScores.capability > c.capabilityMax) matches = false;
    if (c.strategyMin != null && dimensionScores.strategy < c.strategyMin) matches = false;
    if (c.strategyMax != null && dimensionScores.strategy > c.strategyMax) matches = false;
    if (c.adoption_governanceMin != null && dimensionScores.adoption_governance < c.adoption_governanceMin) matches = false;
    if (c.adoption_governanceMax != null && dimensionScores.adoption_governance > c.adoption_governanceMax) matches = false;

    if (matches) return { id: arch.id, label: arch.label };
  }

  return { id: "not_ready", label: "Not Ready" };
}

// Identify strengths
function identifyStrengths(dimensionScores: Record<DimensionKey, number>): Strength[] {
  const strengths: Strength[] = [];
  for (const rule of scoringConfig.strengthRules) {
    let matches = true;
    for (const [dim, threshold] of Object.entries(rule.ifDimensionGte)) {
      if (dimensionScores[dim as DimensionKey] < (threshold as number)) {
        matches = false;
        break;
      }
    }
    if (matches) strengths.push({ id: rule.id, label: rule.label });
  }
  return strengths;
}

// Generate recommendations
function generateRecommendations(dimensionScores: Record<DimensionKey, number>, tags: string[]): Recommendation[] {
  const results: Recommendation[] = [];
  const rules = recommendationsConfig.rules;

  for (const rule of rules) {
    let matches = true;

    // Check dimension conditions
    if (rule.conditions) {
      const c = rule.conditions as Record<string, number>;
      for (const [key, val] of Object.entries(c)) {
        const dimMatch = key.match(/^(foundation|capability|strategy|adoption_governance)(Min|Max)$/);
        if (dimMatch) {
          const dim = dimMatch[1] as DimensionKey;
          const type = dimMatch[2];
          if (type === "Min" && dimensionScores[dim] < val) matches = false;
          if (type === "Max" && dimensionScores[dim] > val) matches = false;
        }
      }
    }

    // Check tag conditions
    if ((rule as any).tagConditions) {
      if (!(rule as any).tagConditions.some((t: string) => tags.includes(t))) {
        matches = false;
      }
    }

    if (matches) {
      for (const text of rule.recommendations) {
        results.push({
          id: rule.id,
          category: rule.category,
          text,
          priority: rule.priority,
        });
      }
    }
  }

  return results.sort((a, b) => a.priority - b.priority);
}

// Generate roadmap based on maturity level
function generateRoadmap(maturityLevelId: string): RoadmapItem[] {
  const rules = roadmapRulesConfig.rules;
  const matching = rules.find((r) => r.maturityLevels.includes(maturityLevelId));
  if (!matching) return [];
  return matching.roadmap;
}

// Main scoring function — pure, side-effect free
export function computeAssessmentResults(answers: Answers): AssessmentResult {
  const { rawScores, tags, blockers } = computeRawScores(answers);
  const consistencyFlags = applyConsistencyRules(answers, rawScores, tags);
  const dimensionScores = normalizeScores(rawScores);
  const overallScore = computeOverallScore(dimensionScores);
  const maturityLevel = determineMaturityLevel(overallScore);
  const archetype = determineArchetype(overallScore, dimensionScores);
  const topBlockers = blockers.sort((a, b) => b.severity - a.severity).slice(0, 5);
  const topStrengths = identifyStrengths(dimensionScores);
  const recommendations = generateRecommendations(dimensionScores, tags);
  const roadmap = generateRoadmap(maturityLevel.id);

  return {
    overallScore,
    maturityLevel,
    archetype,
    dimensionScores,
    tags,
    topBlockers,
    topStrengths,
    consistencyFlags,
    recommendations,
    roadmap,
  };
}
