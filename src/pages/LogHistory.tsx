import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertComponent } from "@/components/AlertComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Car, Filter, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface LogEntry {
  id: number;
  timestamp: string;
  type: string;
  message: string;
  canId: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
}

const LogHistory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  
  // Generate sample historical logs
  useEffect(() => {
    const generateHistoricalLogs = () => {
      const types = [
        { type: "Replay Attack Detected", message: "CAN ID {id} flooded with {count} msgs in the last 5 seconds", severity: "medium" as const },
        { type: "Unexpected Payload Detected", message: "Unexpected payload on ID {id}: {payload}", severity: "medium" as const },
        { type: "Unknown CAN ID Detected", message: "Unknown CAN ID detected", severity: "high" as const },
        { type: "DoS Suspected", message: "DoS suspected on known ID {id} — {count} msgs in 1.0s", severity: "critical" as const }
      ];
      
      const canIds = ["244", "188", "184", "13F", "143", "095", "166", "122", "301", "A44"];
      const payloads = ["05", "FF", "A0", "7B", "C3", "2E", "99"];
      
      const sampleLogs: LogEntry[] = [];
      
      // Generate logs for the past 7 days
      for (let i = 0; i < 100; i++) {
        const daysAgo = Math.floor(Math.random() * 7);
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        date.setHours(date.getHours() - hoursAgo);
        date.setMinutes(date.getMinutes() - minutesAgo);
        
        const typeIndex = Math.floor(Math.random() * types.length);
        const selectedType = types[typeIndex];
        const canId = canIds[Math.floor(Math.random() * canIds.length)];
        
        let message = selectedType.message;
        message = message.replace("{id}", canId);
        
        if (message.includes("{count}")) {
          message = message.replace("{count}", `${Math.floor(Math.random() * 200) + 10}`);
        }
        
        if (message.includes("{payload}")) {
          message = message.replace("{payload}", payloads[Math.floor(Math.random() * payloads.length)]);
        }
        
        sampleLogs.push({
          id: i,
          timestamp: format(date, "yyyy-MM-dd HH:mm:ss"),
          type: selectedType.type,
          message,
          canId,
          severity: selectedType.severity,
        });
      }
      
      // Sort logs by timestamp (most recent first)
      return sampleLogs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    };
    
    setLogs(generateHistoricalLogs());
  }, []);
  
  // Apply filters when logs or filter values change
  useEffect(() => {
    let filtered = [...logs];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.canId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      if (typeFilter === "replay") {
        filtered = filtered.filter(log => log.type.includes("Replay"));
      } else if (typeFilter === "unknown") {
        filtered = filtered.filter(log => log.type.includes("Unknown"));
      } else if (typeFilter === "payload") {
        filtered = filtered.filter(log => log.type.includes("Unexpected"));
      } else if (typeFilter === "dos") {
        filtered = filtered.filter(log => log.type.includes("DoS"));
      }
    }
    
    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const filterDate = format(dateFilter, "yyyy-MM-dd");
      filtered = filtered.filter(log => log.timestamp.startsWith(filterDate));
    }
    
    setFilteredLogs(filtered);
  }, [logs, searchQuery, typeFilter, severityFilter, dateFilter]);
  
  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("all");
    setSeverityFilter("all");
    setDateFilter(null);
  };
  
  return (
    <div className="flex-1 overflow-auto py-6 px-4">
      <header className="mb-6">
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-redTheme-400 mr-2" />
          <h1 className="text-2xl font-bold text-redTheme-400">
            Alert History
          </h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Review past CAN bus intrusion detection alerts
        </p>
      </header>
      
      {/* Filter controls */}
      <div className="mb-4 p-4 bg-secondary rounded-md border border-accent/20">
        <div className="flex items-center mb-3">
          <Filter className="h-5 w-5 text-muted-foreground mr-2" />
          <h2 className="text-md font-medium">Filter Logs</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="col-span-1 md:col-span-2">
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Alert Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="replay">Replay Attack</SelectItem>
                <SelectItem value="unknown">Unknown CAN ID</SelectItem>
                <SelectItem value="payload">Unexpected Payload</SelectItem>
                <SelectItem value="dos">DoS Attack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select
              value={severityFilter}
              onValueChange={setSeverityFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!dateFilter && "text-muted-foreground"}`}
                >
                  {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex justify-end mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      {/* Log listing */}
      <div className="bg-secondary rounded-md p-1">
        <ScrollArea className="h-[calc(100vh-320px)] pr-4">
          <div className="space-y-2">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No logs found matching your filters.
              </div>
            ) : (
              filteredLogs.map((log) => (
                <AlertComponent
                  key={log.id}
                  timestamp={log.timestamp}
                  type={log.type}
                  message={log.message}
                  canId={log.canId}
                  details={log.details}
                  severity={log.severity}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        Showing {filteredLogs.length} of {logs.length} total alerts
      </div>
    </div>
  );
};

export default LogHistory;
