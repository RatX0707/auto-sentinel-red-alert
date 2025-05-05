
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsPanelProps {
  alertCounts: {
    replay: number;
    unknown: number;
    payload: number;
    dos: number;
  };
  isRunning: boolean;
}

export const StatsPanel = ({ alertCounts, isRunning }: StatsPanelProps) => {
  const [totalAlerts, setTotalAlerts] = useState(0);
  
  useEffect(() => {
    const total = 
      alertCounts.replay + 
      alertCounts.unknown + 
      alertCounts.payload + 
      alertCounts.dos;
    
    setTotalAlerts(total);
  }, [alertCounts]);
  
  const getPercentage = (count: number) => {
    if (totalAlerts === 0) return 0;
    return Math.round((count / totalAlerts) * 100);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-secondary border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <div className="w-3 h-3 rounded-full bg-alert-replay mr-2"></div>
            Replay Attacks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-redTheme-400">{alertCounts.replay}</div>
          <Progress className="h-2 mt-2" value={getPercentage(alertCounts.replay)} />
        </CardContent>
      </Card>
      
      <Card className="bg-secondary border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <div className="w-3 h-3 rounded-full bg-alert-unknown mr-2"></div>
            Unknown CAN IDs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-redTheme-400">{alertCounts.unknown}</div>
          <Progress className="h-2 mt-2" value={getPercentage(alertCounts.unknown)} />
        </CardContent>
      </Card>
      
      <Card className="bg-secondary border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <div className="w-3 h-3 rounded-full bg-alert-payload mr-2"></div>
            Unexpected Payloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-redTheme-400">{alertCounts.payload}</div>
          <Progress className="h-2 mt-2" value={getPercentage(alertCounts.payload)} />
        </CardContent>
      </Card>
      
      <Card className="bg-secondary border-accent/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <div className="w-3 h-3 rounded-full bg-alert-dos mr-2"></div>
            DoS Attacks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-redTheme-400">{alertCounts.dos}</div>
          <Progress className="h-2 mt-2" value={getPercentage(alertCounts.dos)} />
        </CardContent>
      </Card>
      
      <Card className="bg-secondary border-accent/20 col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-redTheme-500">{totalAlerts}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {isRunning ? "Detection engine is running" : "Detection engine is stopped"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
