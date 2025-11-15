import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, MapPin, Globe, Shield, TrendingUp, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { IPLookupResult } from "@shared/schema";

export default function IPLookup() {
  const [ipAddress, setIpAddress] = useState("");
  const [result, setResult] = useState<IPLookupResult | null>(null);
  const { toast } = useToast();

  const lookupMutation = useMutation({
    mutationFn: async (ip: string) => {
      return apiRequest("POST", "/api/iplookup", { ip });
    },
    onSuccess: (data: IPLookupResult) => {
      setResult(data);
      toast({
        title: "Lookup Complete",
        description: `Analysis complete for ${data.ip}`,
      });
    },
    onError: () => {
      toast({
        title: "Lookup Failed",
        description: "Unable to retrieve IP information",
        variant: "destructive",
      });
    },
  });

  const handleLookup = () => {
    if (!ipAddress.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid IP address",
        variant: "destructive",
      });
      return;
    }
    lookupMutation.mutate(ipAddress);
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return "bg-severity-critical text-white";
    if (score >= 60) return "bg-severity-high text-white";
    if (score >= 40) return "bg-severity-medium text-white";
    return "bg-severity-low text-white";
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return "Critical Risk";
    if (score >= 60) return "High Risk";
    if (score >= 40) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">IP Lookup</h1>
        <p className="text-sm text-muted-foreground mt-1">Investigate IP addresses for threat intelligence</p>
      </div>

      {/* Search Card */}
      <Card className="border-primary/20 shadow-cyber-glow">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            IP Address Search
          </CardTitle>
          <CardDescription>Enter an IP address to retrieve detailed threat intelligence</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter IP address (e.g., 192.168.1.1)"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              className="flex-1 bg-muted/30 font-mono"
              data-testid="input-ip-address"
            />
            <Button
              onClick={handleLookup}
              disabled={lookupMutation.isPending}
              className="bg-primary hover:bg-primary/90"
              data-testid="button-lookup"
            >
              {lookupMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Lookup
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Risk Score Card */}
          <Card className="border-primary/10" data-testid="card-risk-score">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Risk Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/30"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(result.riskScore / 100) * 352} 352`}
                      className={
                        result.riskScore >= 80
                          ? "text-severity-critical"
                          : result.riskScore >= 60
                          ? "text-severity-high"
                          : result.riskScore >= 40
                          ? "text-severity-medium"
                          : "text-severity-low"
                      }
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{result.riskScore}</span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <Badge className={`${getRiskColor(result.riskScore)} text-sm px-4 py-1`}>
                    {getRiskLevel(result.riskScore)}
                  </Badge>
                  <p className="text-xs text-muted-foreground">Based on AI analysis and threat intelligence</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* IP Details Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Geolocation Info */}
            <Card className="border-primary/10" data-testid="card-geolocation">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Geolocation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">IP Address</span>
                  <span className="text-sm font-mono text-foreground" data-testid="text-ip-result">
                    {result.ip}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">Country</span>
                  <span className="text-sm text-foreground">{result.country}</span>
                </div>
              </CardContent>
            </Card>

            {/* Network Info */}
            <Card className="border-primary/10" data-testid="card-network-info">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Network Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">ISP</span>
                  <span className="text-sm text-foreground">{result.isp}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">ASN</span>
                  <span className="text-sm font-mono text-foreground">{result.asn}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Summary */}
          <Card className="border-accent/20 shadow-purple-glow" data-testid="card-ai-summary">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                AI Risk Summary
              </CardTitle>
              <CardDescription>AI-generated threat analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-md bg-muted/30 border border-accent/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground leading-relaxed">{result.aiSummary}</p>
                </div>
              </div>
              <div className="flex items-center justify-end mt-3">
                <Badge variant="outline" className="text-xs">AI Generated</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!result && !lookupMutation.isPending && (
        <Card className="border-primary/10">
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Enter an IP address to begin threat intelligence lookup</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
