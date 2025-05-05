
import { useState, useEffect } from "react";
import { AlertTriangle, BellRing, Bug, CircleX } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AlertProps {
  timestamp: string;
  type: string;
  message: string;
  canId: string;
  details?: string;
}

export const AlertComponent = ({ timestamp, type, message, canId, details }: AlertProps) => {
  const [isNew, setIsNew] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsNew(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const getAlertClass = () => {
    let baseClass = "alert-card ";
    
    if (type.includes("Replay")) {
      return baseClass + "alert-replay";
    } else if (type.includes("Unknown")) {
      return baseClass + "alert-unknown";
    } else if (type.includes("Unexpected")) {
      return baseClass + "alert-payload";
    } else if (type.includes("DoS")) {
      return baseClass + "alert-dos";
    }
    
    return baseClass;
  };

  const getAlertIcon = () => {
    if (type.includes("Replay")) {
      return <BellRing className="h-5 w-5 text-alert-replay" />;
    } else if (type.includes("Unknown")) {
      return <CircleX className="h-5 w-5 text-alert-unknown" />;
    } else if (type.includes("Unexpected")) {
      return <AlertTriangle className="h-5 w-5 text-alert-payload" />;
    } else if (type.includes("DoS")) {
      return <Bug className="h-5 w-5 text-alert-dos" />;
    }
    
    return <AlertTriangle className="h-5 w-5" />;
  };

  return (
    <Alert className={`${getAlertClass()} ${isNew ? 'animate-pulse-danger' : ''}`}>
      <div className="flex items-center gap-2">
        {getAlertIcon()}
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
