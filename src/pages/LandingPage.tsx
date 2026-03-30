import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart3, Target, Shield, Lightbulb, Database, Brain, Settings, Zap } from "lucide-react";
import { useAssessmentStore } from "@/store/assessmentStore";

const features = [
  { icon: BarChart3, title: "Maturity Score", desc: "Quantified assessment across 4 dimensions" },
  { icon: Target, title: "Archetype Classification", desc: "Understand your AI readiness profile" },
  { icon: Shield, title: "Blocker Analysis", desc: "Identify what's holding you back" },
  { icon: Lightbulb, title: "Recommendations", desc: "Practical, prioritized next steps" },
];

const dimensions = [
  { icon: Database, title: "Foundation", desc: "Data quality, accessibility, systems readiness" },
  { icon: Zap, title: "Capability", desc: "Talent, execution ability, leadership buy-in" },
  { icon: Target, title: "Strategy", desc: "Focus, prioritization, ROI orientation" },
  { icon: Settings, title: "Adoption & Governance", desc: "Integration, risk controls, measurement" },
];

export function LandingPage() {
  const navigate = useNavigate();
  const hasAnswers = Object.keys(useAssessmentStore((s) => s.answers)).length > 0;
  const hasResults = useAssessmentStore((s) => s.results) != null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 rounded bg-muted px-4 py-1.5 text-sm font-medium text-foreground mb-6">
          <Brain className="h-4 w-4" />
          AI Maturity Assessment
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          How ready is your business for AI?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Answer a structured assessment and instantly understand your organization's AI maturity,
          main constraints, likely readiness level, and the most practical next steps.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" onClick={() => navigate("/assessment")}>
            {hasAnswers ? "Continue Assessment" : "Start free Assessment"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {hasResults && (
            <Button size="lg" variant="outline" onClick={() => navigate("/results")}>
              View Results
            </Button>
          )}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Takes approximately 5–10 minutes</p>
      </div>

      {/* What you get */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">What you'll get</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <Card key={f.title} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 w-12 h-12 rounded bg-muted flex items-center justify-center">
                  <f.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Four dimensions */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-8">Four maturity dimensions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map((d) => (
            <div key={d.title} className="flex items-start gap-4 rounded-md border bg-card p-5">
              <div className="flex-shrink-0 w-10 h-10 rounded bg-muted flex items-center justify-center">
                <d.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">{d.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
