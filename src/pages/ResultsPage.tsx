import { useNavigate } from "react-router-dom";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreGauge } from "@/components/results/ScoreGauge";
import { DimensionScoreCards } from "@/components/results/DimensionScoreCards";
import { DimensionRadarChart } from "@/components/results/DimensionRadarChart";
import { MaturityBadge, ArchetypeCard } from "@/components/results/MaturityBadge";
import { BlockersList, StrengthsList } from "@/components/results/BlockersStrengths";
import { RecommendationsGrid } from "@/components/results/RecommendationsGrid";
import { RoadmapTimeline } from "@/components/results/RoadmapTimeline";
import { ArrowRight, RotateCcw } from "lucide-react";
import scoringConfig from "@/config/scoring.json";

export function ResultsPage() {
  const navigate = useNavigate();
  const results = useAssessmentStore((s) => s.results);
  const resetAssessment = useAssessmentStore((s) => s.resetAssessment);

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No results yet</h2>
        <p className="text-muted-foreground mb-8">Complete the assessment to see your AI maturity score.</p>
        <Button onClick={() => navigate("/assessment")}>
          Start free Assessment <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    );
  }

  const archetypeDescription = scoringConfig.archetypes.find((a) => a.id === results.archetype.id)?.description || "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your AI Maturity Results</h1>
          <p className="text-muted-foreground mt-1">Based on your assessment responses</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { resetAssessment(); navigate("/"); }}>
          <RotateCcw className="h-4 w-4 mr-1" /> Retake
        </Button>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <Card className="flex flex-col items-center py-8">
          <ScoreGauge score={results.overallScore} label="Overall Score" />
          <div className="mt-4">
            <MaturityBadge level={results.maturityLevel.id} label={results.maturityLevel.label} />
          </div>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dimension Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <DimensionRadarChart scores={results.dimensionScores} />
          </CardContent>
        </Card>

        {/* Archetype */}
        <div className="space-y-4">
          <ArchetypeCard id={results.archetype.id} label={results.archetype.label} description={archetypeDescription} />

          <Card>
            <CardContent className="pt-6">
              <DimensionScoreCards scores={results.dimensionScores} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for details */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Blockers & Constraints</CardTitle></CardHeader>
              <CardContent>
                <BlockersList blockers={results.topBlockers} />
                {results.topBlockers.length === 0 && (
                  <p className="text-sm text-muted-foreground">No major blockers identified.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Strengths</CardTitle></CardHeader>
              <CardContent>
                <StrengthsList strengths={results.topStrengths} />
                {results.topStrengths.length === 0 && (
                  <p className="text-sm text-muted-foreground">Build more capability to unlock strengths.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader><CardTitle className="text-base">Prioritized Recommendations</CardTitle></CardHeader>
            <CardContent>
              <RecommendationsGrid recommendations={results.recommendations} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap">
          <Card>
            <CardHeader><CardTitle className="text-base">Your Action Roadmap</CardTitle></CardHeader>
            <CardContent>
              <RoadmapTimeline roadmap={results.roadmap} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Dimension Breakdown</CardTitle></CardHeader>
              <CardContent>
                <DimensionScoreCards scores={results.dimensionScores} />
              </CardContent>
            </Card>

            {results.consistencyFlags.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Consistency Flags</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.consistencyFlags.map((flag) => (
                      <div key={flag} className="rounded-lg bg-warning/10 border border-warning/20 px-4 py-3 text-sm">
                        ⚠️ {flag.replace(/_/g, " ")}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {results.tags.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Profile Tags</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.tags.map((tag) => (
                      <span key={tag} className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
