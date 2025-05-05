
import { useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { LogDisplay } from "@/components/LogDisplay";
import { StatsPanel } from "@/components/StatsPanel";
import { StatusBanner } from "@/components/StatusBanner";

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [latestAlert, setLatestAlert] = useState<string | null>(null);
  const [alertCounts, setAlertCounts] = useState({
    replay: 0,
    unknown: 0,
    payload: 0,
    dos: 0,
  });
  
  const handleStartStop = (running: boolean) => {
    setIsRunning(running);
    
    if (!running) {
      // Reset the latest alert when stopping
      setLatestAlert(null);
    }
  };
  
  const handleNewAlert = (type: string) => {
    setLatestAlert(type);
    
    // Update alert counts
    if (type.includes("Replay")) {
      setAlertCounts(prev => ({ ...prev, replay: prev.replay + 1 }));
    } else if (type.includes("Unknown")) {
      setAlertCounts(prev => ({ ...prev, unknown: prev.unknown + 1 }));
    } else if (type.includes("Unexpected")) {
      setAlertCounts(prev => ({ ...prev, payload: prev.payload + 1 }));
    } else if (type.includes("DoS")) {
      setAlertCounts(prev => ({ ...prev, dos: prev.dos + 1 }));
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-redTheme-400">
            Vehicle Attack Detection System
          </h1>
          <div className="text-sm text-muted-foreground">
            IDS Engine v1.0
          </div>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time CAN bus monitoring and intrusion detection
        </p>
      </header>
      
      <StatusBanner 
        isRunning={isRunning} 
        latestAlert={latestAlert} 
      />
      
      <div className="grid grid-cols-12 gap-4">
        {/* Main content area - alert logs */}
        <div className="col-span-12 lg:col-span-9">
          <h2 className="text-lg font-medium mb-2 text-redTheme-300">
            CAN Bus Alert Log
          </h2>
          <LogDisplay 
            isRunning={isRunning}
            onNewAlert={handleNewAlert}
          />
        </div>
        
        {/* Side panel with controls and stats */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <ControlPanel 
            isRunning={isRunning}
            onStartStop={handleStartStop}
          />
          
          <h2 className="text-lg font-medium mb-2 text-redTheme-300">
            Attack Statistics
          </h2>
          
          <StatsPanel 
            alertCounts={alertCounts}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
