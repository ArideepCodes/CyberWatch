import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { TrendingUp, PieChart as PieChartIcon, Activity, BarChart3 } from "lucide-react";
import type { Threat } from "@shared/schema";

const SEVERITY_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

const CHART_COLORS = ["#06b6d4", "#a855f7", "#8b5cf6", "#14b8a6", "#f59e0b"];

export default function Analytics() {
  const { data: threats = [], isLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats"],
  });

  // Threats by Type
  const threatTypeData = Object.entries(
    threats.reduce((acc, threat) => {
      acc[threat.type] = (acc[threat.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([type, count]) => ({
    type,
    count,
  }));

  // Severity Distribution
  const severityData = Object.entries(
    threats.reduce((acc, threat) => {
      const severity = threat.severity.toLowerCase();
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([severity, count]) => ({
    severity: severity.charAt(0).toUpperCase() + severity.slice(1),
    count,
    color: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || "#94a3b8",
  }));

  // Country Distribution
  const countryData = Object.entries(
    threats.reduce((acc, threat) => {
      const country = threat.country || "Unknown";
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Timeline (last 14 days)
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toISOString().split("T")[0];
  });

  const timelineData = last14Days.map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    threats: threats.filter((t) => new Date(t.timestamp).toISOString().split("T")[0] === date).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive threat data visualization and trends</p>
      </div>

      {/* Top Row Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Threats by Type */}
        <Card className="border-primary/10" data-testid="card-threats-by-type">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Threats by Type
            </CardTitle>
            <CardDescription>Distribution of threat categories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : threatTypeData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                No threat data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={threatTypeData}>
                  <XAxis
                    dataKey="type"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card className="border-accent/10" data-testid="card-severity-distribution">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-accent" />
              Severity Distribution
            </CardTitle>
            <CardDescription>Breakdown of threat severity levels</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : severityData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                No severity data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ severity, percent }) => `${severity}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {severityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Threats by Country */}
        <Card className="border-primary/10" data-testid="card-threats-by-country">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Threats by Country
            </CardTitle>
            <CardDescription>Top 8 countries by threat count</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : countryData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                No country data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={countryData} layout="vertical">
                  <XAxis type="number" stroke="#64748b" style={{ fontSize: "12px" }} />
                  <YAxis
                    type="category"
                    dataKey="country"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                  <Bar dataKey="count" fill="#a855f7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Threat Timeline */}
        <Card className="border-primary/10" data-testid="card-threat-timeline">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Threat Timeline
            </CardTitle>
            <CardDescription>14-day threat activity trend</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timelineData}>
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    style={{ fontSize: "12px" }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "6px",
                    }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                  <Bar dataKey="threats" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
