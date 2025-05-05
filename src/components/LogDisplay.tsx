
import { useState, useEffect, useRef } from "react";
import { AlertComponent } from "./AlertComponent";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  id: number;
  timestamp: string;
  type: string;
  message: string;
  canId: string;
  details?: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface LogDisplayProps {
  isRunning: boolean;
  onNewAlert: (type: string) => void;
}

export const LogDisplay = ({ isRunning, onNewAlert }: LogDisplayProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const intervalRef = useRef<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const alertProcessedRef = useRef(false);

  // Determine severity based on alert type
  const getSeverity = (type: string): "low" | "medium" | "high" | "critical" => {
    if (type.includes("DoS")) return "critical";
    if (type.includes("Unknown")) return "high";
    if (type.includes("Replay") || type.includes("Unexpected")) return "medium";
    return "low";
  };

  // Fetch alerts from the backend
  const fetchAlerts = async () => {
    if (!isRunning) return;
    
    try {
      const response = await fetch('http://localhost:5000/get_alerts');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.alerts && Array.isArray(data.alerts)) {
        const formattedLogs = data.alerts.map((alert: any, index: number) => ({
          id: Date.now() + index,
          timestamp: alert.timestamp,
          type: alert.type,
          message: alert.message,
          canId: alert.canId,
          severity: getSeverity(alert.type)
        }));
        
        if (formattedLogs.length > 0) {
          setLogs(formattedLogs);
          
          // Notify about the newest alert
          if (formattedLogs[0] && !alertProcessedRef.current) {
            onNewAlert(formattedLogs[0].type);
            alertProcessedRef.current = true;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  // Sample log data as fallback (will be used if backend is not available)
  const sampleLogs = [
    {
      timestamp: "2025-05-05 12:59:01",
      type: "Replay Attack Detected",
      message: "CAN ID 244 flooded with 19B/188 in the last 5 seconds",
      canId: "244",
      severity: "medium" as const,
    },
    {
      timestamp: "2025-05-05 02:12:25",
      type: "Unexpected Payload Detected",
      message: "Unexpected payload on ID 188: 05",
      canId: "188",
      severity: "medium" as const,
    },
    {
      timestamp: "2025-05-05 02:12:57",
      type: "Unknown CAN ID Detected",
      message: "Unknown CAN ID detected",
      canId: "184",
      severity: "high" as const,
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 13F — 200 msgs in 1.0s",
      canId: "13F",
      severity: "critical" as const,
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 183 — 200 msgs in 1.0s",
      canId: "183",
      severity: "critical" as const,
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 143 — 200 msgs in 1.0s",
      canId: "143",
      severity: "critical" as const,
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 095 — 200 msgs in 1.0s",
      canId: "095",
      severity: "critical" as const,
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 166 — 200 msgs in 1.0s",
      canId: "166",
      severity: "critical" as const,
    },
  ];

  // Update logs when the detection engine is running
  useEffect(() => {
    if (isRunning) {
      // Initial fetch
      fetchAlerts();
      
      // Set up interval to fetch logs periodically
      intervalRef.current = window.setInterval(() => {
        alertProcessedRef.current = false;
        fetchAlerts();
      }, 3000);  // Fetch logs every 3 seconds
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      alertProcessedRef.current = false;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // If no logs from backend, use sample data for demo purposes
  const displayLogs = logs.length > 0 ? logs : 
    (isRunning ? sampleLogs.map(log => ({ ...log, id: Date.now() })) : []);

  return (
    <div className="bg-secondary rounded-md p-1 h-full">
      <ScrollArea className="h-[calc(100vh-520px)] pr-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {displayLogs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No alerts detected. Press the Start button to begin monitoring.
            </div>
          ) : (
            displayLogs.map((log) => (
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
  );
};
