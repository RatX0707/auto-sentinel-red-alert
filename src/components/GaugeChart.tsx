
import { useEffect, useState } from "react";
import { Car } from "lucide-react";

interface GaugeChartProps {
  value: number;
  label: string;
  color: string;
  icon?: React.ReactNode;
  max?: number;
  size?: number;
}

export const GaugeChart = ({
  value,
  label,
  color,
  icon,
  max = 100,
  size = 120
}: GaugeChartProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  // Convert value to percentage for the gauge
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  // Circle parameters
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
  
  // Center position
  const center = size / 2;
  
  useEffect(() => {
    // Animate the gauge on mount and when value changes
    const timer = setTimeout(() => {
      setAnimatedValue(percentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percentage]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-secondary opacity-30"
          />
          
          {/* Foreground circle with animation */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            style={{
              transition: "stroke-dasharray 1s ease-in-out",
            }}
          />
        </svg>
        
        {/* Value and icon in the center */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          {icon || <Car className="h-6 w-6 mb-1" style={{ color }} />}
          <span className="text-xl font-bold">
            {Math.round(animatedValue)}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-sm text-muted-foreground">{label}</span>
    </div>
  );
};
