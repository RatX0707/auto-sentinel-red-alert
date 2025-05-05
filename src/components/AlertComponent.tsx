
import { useState, useEffect } from "react";
import { AlertTriangle, BellRing, Bug, Car, CircleX } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AlertProps {
  timestamp: string;
  type: string;
  message: string;
  canId: string;
  details?: string;
  severity?: "low" | "medium" | "high" | "critical";
}

export const AlertComponent = ({ 
  timestamp, 
  type, 
  message, 
  canId, 
  details,
  severity 
}: AlertProps) => {
  const [isNew, setIsNew] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Determine the alert type and severity
  const getAlertData = () => {
    if (type.includes("Replay")) {
      return {
        className: "alert-replay",
        icon: <BellRing className="h-5 w-5 text-alert-replay" />,
        severity: severity || "medium",
      };
    } else if (type.includes("Unknown")) {
      return {
        className: "alert-unknown",
        icon: <CircleX className="h-5 w-5 text-alert-unknown" />,
        severity: severity || "high",
      };
    } else if (type.includes("Unexpected")) {
      return {
        className: "alert-payload",
        icon: <AlertTriangle className="h-5 w-5 text-alert-payload" />,
        severity: severity || "medium",
      };
    } else if (type.includes("DoS")) {
      return {
        className: "alert-dos",
        icon: <Bug className="h-5 w-5 text-alert-dos" />,
        severity: severity || "critical",
      };
    }
    
    return {
      className: "",
      icon: <Car className="h-5 w-5 text-muted-foreground" />,
      severity: severity || "low",
    };
  };

  const alertData = getAlertData();
  
  // Get color based on severity
  const getSeverityColor = () => {
    switch(alertData.severity) {
      case "low": return "bg-alert-low/10 border-alert-low";
      case "medium": return "bg-alert-medium/10 border-alert-medium";
      case "high": return "bg-alert-high/10 border-alert-high";
      case "critical": return "bg-alert-critical/10 border-alert-critical";
      default: return "bg-black/40";
    }
  };

  return (
    <Alert className={`alert-card ${alertData.className} ${getSeverityColor()} ${isNew ? 'animate-pulse-danger' : ''}`}>
      <div className="flex items-center gap-2">
        {alertData.icon}
        <div>
          <AlertTitle className="text-sm font-medium text-redTheme-300 flex items-center gap-2">
            {type} - CAN ID: {canId}
            {isNew && <span className="px-1.5 py-0.5 bg-redTheme-700 text-white text-xs rounded-full">New</span>}
          </AlertTitle>
          <AlertDescription className="text-xs text-gray-300">{message}</AlertDescription>
          {details && <p className="text-xs text-gray-400 mt-1">{details}</p>}
          <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
        </div>
      </div>
    </Alert>
  );
};
