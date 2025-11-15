import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, Shield, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Threat } from "@shared/schema";

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

export default function Threats() {
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedThreat, setSelectedThreat] = useState<Threat | null>(null);

  const { data: threats = [], isLoading } = useQuery<Threat[]>({
    queryKey: ["/api/threats"],
  });

  const filteredThreats = threats
    .filter((threat) => {
      const matchesSearch =
        threat.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.country?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === "all" || threat.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Threat Detection</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor and analyze detected security threats</p>
      </div>

      {/* Filters */}
      <Card className="border-primary/10">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by IP, type, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-border"
                data-testid="input-search-threats"
              />
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px] bg-muted/30" data-testid="select-severity-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                className="bg-muted/30"
                data-testid="button-sort-order"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threats Table */}
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center justify-between">
            <span>Detected Threats ({filteredThreats.length})</span>
            <Badge variant="outline" className="border-primary/30 text-primary">
              {threats.length} Total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredThreats.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No threats found matching your criteria</p>
            </div>
          ) : (
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Time</TableHead>
                    <TableHead className="font-semibold">IP Address</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Severity</TableHead>
                    <TableHead className="font-semibold">Country</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredThreats.map((threat) => (
                    <TableRow
                      key={threat.id}
                      className="hover-elevate cursor-pointer"
                      data-testid={`row-threat-${threat.id}`}
                    >
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(threat.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground">{threat.ip}</TableCell>
                      <TableCell className="text-sm">{threat.type}</TableCell>
                      <TableCell>
                        <Badge className={`${getSeverityColor(threat.severity)} text-xs`}>{threat.severity}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{threat.country || "Unknown"}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedThreat(threat)}
                          data-testid={`button-view-details-${threat.id}`}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Threat Details Dialog */}
      <Dialog open={!!selectedThreat} onOpenChange={() => setSelectedThreat(null)}>
        <DialogContent className="bg-card border-primary/20 max-w-2xl" data-testid="dialog-threat-details">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Threat Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about the detected threat
            </DialogDescription>
          </DialogHeader>
          {selectedThreat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">IP Address</p>
                  <p className="font-mono text-sm text-foreground">{selectedThreat.ip}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Threat Type</p>
                  <p className="text-sm text-foreground">{selectedThreat.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Severity</p>
                  <Badge className={getSeverityColor(selectedThreat.severity)}>{selectedThreat.severity}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Risk Score</p>
                  <p className="text-sm text-foreground">{selectedThreat.score || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Location
                </p>
                <p className="text-sm text-foreground">{selectedThreat.country || "Unknown"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Detected At
                </p>
                <p className="text-sm text-foreground">{new Date(selectedThreat.timestamp).toLocaleString()}</p>
              </div>

              {selectedThreat.details && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Additional Details</p>
                  <p className="text-sm text-foreground bg-muted/30 p-3 rounded-md">{selectedThreat.details}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
