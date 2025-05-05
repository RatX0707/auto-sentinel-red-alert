
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, StopCircle } from "lucide-react";
import { toast } from "sonner";

interface ControlPanelProps {
  isRunning: boolean;
  onStartStop: (running: boolean) => void;
}

export const ControlPanel = ({ isRunning, onStartStop }: ControlPanelProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = async () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newState = !isRunning;
    onStartStop(newState);

    if (newState) {
      toast.success("Vehicle Attack Detection Engine Started", {
        description: "Monitoring CAN bus traffic for intrusions",
      });
    } else {
      toast.info("Vehicle Attack Detection Engine Stopped", {
        description: "CAN bus monitoring paused",
      });
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-secondary p-4 rounded-md border border-accent/20">
        <h3 className="text-sm font-medium mb-2">Detection Engine Control</h3>
        
        <Button
          onClick={handleToggle}
          disabled={isProcessing}
          className={`w-full ${
            isRunning 
              ? "bg-red-700 hover:bg-red-800" 
              : "bg-redTheme-500 hover:bg-redTheme-600"
          } ${isRunning ? "animate-glow" : ""}`}
        >
          {isProcessing ? (
            "Processing..."
          ) : isRunning ? (
            <>
              <StopCircle className="mr-2 h-4 w-4" />
              Stop Detection
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Start Detection
            </>
          )}
        </Button>
        
        <div className="text-xs text-muted-foreground mt-2">
          {isRunning
            ? "Detection engine is actively monitoring CAN bus traffic"
            : "Engine is ready to start monitoring"}
        </div>
      </div>
    </div>
  );
};
