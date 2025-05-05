
import { useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { LogDisplay } from "@/components/LogDisplay";
import { StatsPanel } from "@/components/StatsPanel";
import { StatusBanner } from "@/components/StatusBanner";
import { GaugeChart } from "@/components/GaugeChart";
import { Oscillator } from "@/components/Oscillator";
import { Car, Gauge, Shield } from "lucide-react";

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

  const totalAlerts = alertCounts.replay + alertCounts.unknown + alertCounts.payload + alertCounts.dos;
  const busLoad = isRunning ? Math.min(25 + Math.random() * 40, 100) : 0;
  const networkActivity = isRunning ? Math.min(30 + Math.random() * 50, 100) : 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="py-6 px-4">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-redTheme-400 mr-3" />
              <h1 className="auto-astra-title text-redTheme-500">
                AutoAstra <span className="text-sm font-normal text-muted-foreground">IDS Engine</span>
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              CAN Bus Monitor v1.0
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Advanced intrusion detection system for automotive security
          </p>
        </header>
        
        <StatusBanner 
          isRunning={isRunning} 
          latestAlert={latestAlert} 
        />
        
        {/* Network activity oscillator */}
        <div className="mb-4 p-3 rounded-md bg-secondary border border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Network Activity</h3>
            <div className="text-xs text-muted-foreground">
              {isRunning ? `${Math.round(networkActivity)} msg/s` : "Idle"}
            </div>
          </div>
          <Oscillator active={isRunning} className="w-full" />
        </div>
        
        {/* Gauge metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-secondary p-3 rounded-md border border-accent/20 flex justify-center">
            <GaugeChart 
              value={busLoad} 
              label="CAN Bus Load" 
              color="#ea384c"
              icon={<Gauge className="h-6 w-6 text-redTheme-400" />}
            />
          </div>
          
          <div className="bg-secondary p-3 rounded-md border border-accent/20 flex justify-center">
            <GaugeChart 
              value={isRunning ? totalAlerts : 0} 
              label="Alert Level" 
              color={totalAlerts > 10 ? "#f94144" : totalAlerts > 5 ? "#f9c74f" : "#90be6d"}
              max={15}
              icon={<Shield className="h-6 w-6" style={{ 
                color: totalAlerts > 10 ? "#f94144" : totalAlerts > 5 ? "#f9c74f" : "#90be6d" 
              }} />}
            />
          </div>
          
          <div className="bg-secondary p-3 rounded-md border border-accent/20 flex justify-center">
            <GaugeChart 
              value={isRunning ? Math.round(Math.random() * 60) + 30 : 0} 
              label="Packet Analysis" 
              color="#90be6d"
            />
          </div>
          
          <div className="bg-secondary p-3 rounded-md border border-accent/20 flex justify-center">
            <GaugeChart 
              value={isRunning ? Math.round(Math.random() * 80) + 10 : 0} 
              label="System Performance" 
              color="#f9c74f"
            />
          </div>
        </div>
        
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
    </div>
  );
};

export default Index;
