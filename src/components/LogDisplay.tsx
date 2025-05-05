
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
}

interface LogDisplayProps {
  isRunning: boolean;
  onNewAlert: (type: string) => void;
}

export const LogDisplay = ({ isRunning, onNewAlert }: LogDisplayProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const intervalRef = useRef<number | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Sample log data based on the provided format
  const sampleLogs = [
    {
      timestamp: "2025-05-04 12:59:01",
      type: "Replay Attack Detected",
      message: "CAN ID 244 flooded with 19B/188 in the last 5 seconds",
      canId: "244",
    },
    {
      timestamp: "2025-05-05 02:12:25",
      type: "Unexpected Payload Detected",
      message: "Unexpected payload on ID 188: 05",
      canId: "188",
    },
    {
      timestamp: "2025-05-05 02:12:57",
      type: "Unknown CAN ID Detected",
      message: "Unknown CAN ID detected",
      canId: "184",
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 13F — 200 msgs in 1.0s",
      canId: "13F",
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 183 — 200 msgs in 1.0s",
      canId: "183",
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 143 — 200 msgs in 1.0s",
      canId: "143",
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 095 — 200 msgs in 1.0s",
      canId: "095",
    },
    {
      timestamp: "2025-05-05 02:35:43",
      type: "DoS Suspected",
      message: "DoS suspected on known ID 166 — 200 msgs in 1.0s",
      canId: "166",
    },
  ];

  // Update logs when the detection engine is running
  useEffect(() => {
    if (isRunning) {
      // Initial log
      const getRandomLog = () => {
        const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        return {
          id: Date.now(),
          ...randomLog,
        };
      };

      // Add a log entry immediately when started
      setLogs((prevLogs) => {
        const newLog = getRandomLog();
        onNewAlert(newLog.type);
        return [newLog, ...prevLogs].slice(0, 100);  // Keep only the last 100 logs
      });

      // Set up interval to add logs periodically
      intervalRef.current = window.setInterval(() => {
        setLogs((prevLogs) => {
          const newLog = getRandomLog();
          onNewAlert(newLog.type);
          return [newLog, ...prevLogs].slice(0, 100);
        });
      }, 3000);  // Add a new log every 3 seconds
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, onNewAlert, sampleLogs]);

  return (
    <div className="bg-secondary rounded-md p-1 h-full">
      <ScrollArea className="h-[calc(100vh-260px)] pr-4" ref={scrollAreaRef}>
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No alerts detected. Press the Start button to begin monitoring.
            </div>
          ) : (
            logs.map((log) => (
              <AlertComponent
                key={log.id}
                timestamp={log.timestamp}
                type={log.type}
                message={log.message}
                canId={log.canId}
                details={log.details}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
