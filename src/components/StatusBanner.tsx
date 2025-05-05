
import { useEffect, useState } from "react";
import { AlertTriangle, Shield } from "lucide-react";

interface StatusBannerProps {
  isRunning: boolean;
  latestAlert: string | null;
}

export const StatusBanner = ({ isRunning, latestAlert }: StatusBannerProps) => {
  const [alertActive, setAlertActive] = useState(false);
  
  useEffect(() => {
    if (latestAlert) {
      setAlertActive(true);
      
      const timer = setTimeout(() => {
        setAlertActive(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [latestAlert]);
  
  return (
    <div
      className={`mb-4 p-3 rounded-md flex items-center justify-between transition-colors duration-300 ${
        alertActive
          ? "bg-redTheme-900/70 animate-pulse-danger"
          : isRunning
          ? "bg-secondary border border-redTheme-800/30"
          : "bg-secondary border border-accent/20"
      }`}
    >
      <div className="flex items-center">
        {alertActive ? (
          <AlertTriangle className="h-5 w-5 text-redTheme-400 mr-2" />
        ) : (
          <Shield className={`h-5 w-5 mr-2 ${isRunning ? "text-green-500" : "text-gray-500"}`} />
        )}
        
        <span className="text-sm font-medium">
          {alertActive
            ? `NEW ALERT: ${latestAlert}`
            : isRunning
            ? "System Active: Monitoring CAN Bus Network"
            : "System Idle: Press Start to Begin Monitoring"}
        </span>
      </div>
      
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${isRunning ? "bg-green-500" : "bg-gray-500"}`}></div>
        <span className="text-xs text-muted-foreground">
          {isRunning ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};
