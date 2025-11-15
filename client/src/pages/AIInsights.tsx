import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Lightbulb, Shield, TrendingUp, Loader2, Sparkles, Target, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Threat, ThreatExplanation } from "@shared/schema";

export default function AIInsights() {
  const [selectedThreatId, setSelectedThreatId] = useState<string>("");
  const [explanation, setExplanation] = useState<ThreatExplanation | null>(null);
  const [impactData, setImpactData] = useState<{ rating: number; description: string } | null>(null);
  const [responseSteps, setResponseSteps] = useState<string[]>([]);
  const [anomalies, setAnomalies] = useState<{ detected: boolean; list: string[]; confidence: number } | null>(null);

  const { toast } = useToast();
  const { data: threats = [], isLoading: threatsLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats"],
  });

  const explainMutation = useMutation({
    mutationFn: async (threatId: string) => {
      const threat = threats.find((t) => t.id === threatId);
      if (!threat) throw new Error("Threat not found");
      return apiRequest("POST", "/api/ai/explain", { threat });
    },
    onSuccess: (data: ThreatExplanation) => {
      setExplanation(data);
      toast({
        title: "Analysis Complete",
        description: "AI threat explanation generated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate threat explanation",
        variant: "destructive",
      });
    },
  });

  const impactMutation = useMutation({
    mutationFn: async (threatId: string) => {
      const threat = threats.find((t) => t.id === threatId);
      if (!threat) throw new Error("Threat not found");
      return apiRequest("POST", "/api/ai/impact", { threat });
    },
    onSuccess: (data: { rating: number; description: string }) => {
      setImpactData(data);
      toast({
        title: "Impact Assessment Complete",
        description: "AI impact rating generated successfully",
      });
    },
  });

  const responseMutation = useMutation({
    mutationFn: async (threatId: string) => {
      const threat = threats.find((t) => t.id === threatId);
      if (!threat) throw new Error("Threat not found");
      return apiRequest("POST", "/api/ai/response", { threat });
    },
    onSuccess: (data: { steps: string[] }) => {
      setResponseSteps(data.steps);
      toast({
        title: "Response Plan Ready",
        description: "AI-generated response steps available",
      });
    },
  });

  const anomalyMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/ai/anomalies", { threats });
    },
    onSuccess: (data: { detected: boolean; anomalies: string[]; confidence: number }) => {
      setAnomalies({ detected: data.detected, list: data.anomalies, confidence: data.confidence });
      toast({
        title: "Anomaly Analysis Complete",
        description: `${data.anomalies.length} anomalies detected`,
      });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered threat analysis and recommendations</p>
      </div>

      {/* Threat Selection */}
      <Card className="border-primary/10">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground mb-2 block">Select Threat for Analysis</label>
              <Select value={selectedThreatId} onValueChange={setSelectedThreatId}>
                <SelectTrigger className="bg-muted/30" data-testid="select-threat">
                  <SelectValue placeholder="Choose a threat to analyze..." />
                </SelectTrigger>
                <SelectContent>
                  {threatsLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading threats...
                    </SelectItem>
                  ) : threats.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      No threats available
                    </SelectItem>
                  ) : (
                    threats.map((threat) => (
                      <SelectItem key={threat.id} value={threat.id}>
                        {threat.ip} - {threat.type} ({threat.severity})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setExplanation(null);
                  setImpactData(null);
                  setResponseSteps([]);
                  setAnomalies(null);
                  setSelectedThreatId("");
                }}
                data-testid="button-reset"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Threat Explanation */}
        <Card className="border-primary/20 shadow-cyber-glow" data-testid="card-threat-explanation">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Threat Explanation
            </CardTitle>
            <CardDescription>AI-powered threat analysis and context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => selectedThreatId && explainMutation.mutate(selectedThreatId)}
              disabled={!selectedThreatId || explainMutation.isPending}
              className="w-full bg-primary hover:bg-primary/90"
              data-testid="button-generate-explanation"
            >
              {explainMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Explanation
                </>
              )}
            </Button>
            {explanation && (
              <div className="space-y-3">
                <div className="p-4 rounded-md bg-muted/30 border border-primary/20">
                  <p className="text-sm text-foreground leading-relaxed">{explanation.explanation}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Analyzed threat from {explanation.threat.ip}</span>
                  <Badge variant="outline" className="text-xs">AI Generated</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Impact Rating */}
        <Card className="border-accent/20 shadow-purple-glow" data-testid="card-impact-rating">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Impact Rating
            </CardTitle>
            <CardDescription>Potential impact assessment and severity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => selectedThreatId && impactMutation.mutate(selectedThreatId)}
              disabled={!selectedThreatId || impactMutation.isPending}
              className="w-full bg-accent hover:bg-accent/90"
              data-testid="button-generate-impact"
            >
              {impactMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Calculate Impact
                </>
              )}
            </Button>
            {impactData && (
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-accent/30 flex items-center justify-center">
                      <span className="text-3xl font-bold text-accent">{impactData.rating}/10</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-md bg-muted/30 border border-accent/20">
                  <p className="text-sm text-foreground leading-relaxed">{impactData.description}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Response */}
        <Card className="border-primary/10" data-testid="card-response-steps">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Suggested Response Steps
            </CardTitle>
            <CardDescription>AI-recommended mitigation actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => selectedThreatId && responseMutation.mutate(selectedThreatId)}
              disabled={!selectedThreatId || responseMutation.isPending}
              className="w-full"
              variant="outline"
              data-testid="button-generate-response"
            >
              {responseMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Response Plan
                </>
              )}
            </Button>
            {responseSteps.length > 0 && (
              <div className="space-y-2">
                {responseSteps.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-md bg-muted/30 border border-border"
                    data-testid={`response-step-${index}`}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 border border-primary/30 flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-foreground pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anomaly Analysis */}
        <Card className="border-destructive/10" data-testid="card-anomaly-analysis">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Anomaly Analysis
            </CardTitle>
            <CardDescription>Detect unusual patterns in threat data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => anomalyMutation.mutate()}
              disabled={threats.length === 0 || anomalyMutation.isPending}
              className="w-full"
              variant="outline"
              data-testid="button-detect-anomalies"
            >
              {anomalyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Detect Anomalies
                </>
              )}
            </Button>
            {anomalies && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border">
                  <span className="text-sm font-medium">Detection Status</span>
                  <Badge className={anomalies.detected ? "bg-destructive" : "bg-severity-low"}>
                    {anomalies.detected ? "Anomalies Detected" : "Normal"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border">
                  <span className="text-sm font-medium">Confidence Level</span>
                  <span className="text-sm font-bold text-foreground">{anomalies.confidence}%</span>
                </div>
                {anomalies.list.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Detected Anomalies:</p>
                    {anomalies.list.map((anomaly, index) => (
                      <div
                        key={index}
                        className="p-2 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-foreground"
                        data-testid={`anomaly-${index}`}
                      >
                        {anomaly}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
