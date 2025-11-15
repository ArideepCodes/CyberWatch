import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Threat } from "@shared/schema";

// Fix Leaflet default icon issue in Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function getSeverityColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "bg-severity-critical text-white";
    case "high":
      return "bg-severity-high text-white";
    case "medium":
      return "bg-severity-medium text-white";
    case "low":
      return "bg-severity-low text-white";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getSeverityDotColor(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "#ef4444";
    case "high":
      return "#f97316";
    case "medium":
      return "#eab308";
    case "low":
      return "#22c55e";
    default:
      return "#94a3b8";
  }
}

export default function Dashboard() {
  const { data: threats = [], isLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats"],
  });

  const activeThreats = threats.filter((t) => t.severity === "critical" || t.severity === "high");
  const todayThreats = threats.filter((t) => {
    const today = new Date();
    const threatDate = new Date(t.timestamp);
    return threatDate.toDateString() === today.toDateString();
  });
  const highSeverityCount = threats.filter((t) => t.severity === "critical" || t.severity === "high").length;

  // Chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const chartData = last7Days.map((date) => ({
    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    threats: threats.filter((t) => new Date(t.timestamp).toISOString().split("T")[0] === date).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time threat monitoring and analytics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-primary/20 shadow-cyber-glow" data-testid="card-active-threats">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Threats</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary" data-testid="text-active-threats-count">
                  {activeThreats.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Critical & High severity</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-accent/20 shadow-purple-glow" data-testid="card-today-attacks">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attacks</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-accent" data-testid="text-today-attacks-count">
                  {todayThreats.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Detected in last 24h</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-destructive/20" data-testid="card-high-severity">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-destructive" data-testid="text-high-severity-count">
                  {highSeverityCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Require immediate action</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Live Feed and Map */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Live Threat Feed */}
        <Card className="border-primary/10" data-testid="card-live-feed">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary animate-pulse" />
                Live Threat Feed
              </CardTitle>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                LIVE
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[280px] overflow-y-auto">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : threats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No threats detected</p>
                </div>
              ) : (
                threats.slice(0, 8).map((threat) => (
                  <div
                    key={threat.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-card border border-card-border hover-elevate"
                    data-testid={`threat-item-${threat.id}`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{threat.type}</p>
                        <Badge className={`${getSeverityColor(threat.severity)} text-xs`}>{threat.severity}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs font-mono text-muted-foreground">{threat.ip}</p>
                        {threat.country && <span className="text-xs text-muted-foreground">• {threat.country}</span>}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(threat.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attack Origin Map */}
        <Card className="border-primary/10" data-testid="card-threat-map">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Attack Origin Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] rounded-md overflow-hidden border border-border">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  style={{ height: "100%", width: "100%", background: "#0f172a" }}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  {threats
                    .map((threat) => ({
                      ...threat,
                      lat: threat.latitude ? Number(threat.latitude) : null,
                      lng: threat.longitude ? Number(threat.longitude) : null,
                    }))
                    .filter((t) => t.lat !== null && t.lng !== null && !isNaN(t.lat) && !isNaN(t.lng))
                    .map((threat) => (
                      <CircleMarker
                        key={threat.id}
                        center={[threat.lat, threat.lng]}
                        radius={8}
                        pathOptions={{
                          fillColor: getSeverityDotColor(threat.severity),
                          fillOpacity: 0.7,
                          color: getSeverityDotColor(threat.severity),
                          weight: 2,
                        }}
                      >
                        <Popup>
                          <div className="text-xs">
                            <p className="font-semibold">{threat.type}</p>
                            <p className="font-mono">{threat.ip}</p>
                            <p>{threat.country}</p>
                            <Badge className={`${getSeverityColor(threat.severity)} text-xs mt-1`}>
                              {threat.severity}
                            </Badge>
                          </div>
                        </Popup>
                      </CircleMarker>
                    ))}
                </MapContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attack Timeline */}
      <Card className="border-primary/10" data-testid="card-timeline">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Attack Timeline (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: "12px" }} />
                <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#f1f5f9" }}
                />
                <Line
                  type="monotone"
                  dataKey="threats"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
