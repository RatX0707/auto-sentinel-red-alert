
import { useEffect, useRef, useState } from "react";

interface OscillatorProps {
  active: boolean;
  height?: number;
  className?: string;
}

export const Oscillator = ({ active, height = 40, className = "" }: OscillatorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const width = canvas.width;
    const mid = height / 2;
    let offset = 0;
    
    const draw = () => {
      if (!active) {
        // Draw flat line when not active
        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(0, mid);
        ctx.lineTo(width, mid);
        ctx.strokeStyle = "rgba(234, 56, 76, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw the wave
      ctx.beginPath();
      ctx.moveTo(0, mid);
      
      for (let x = 0; x < width; x++) {
        // Create a more complex wave pattern
        const y = mid + 
          Math.sin((x + offset) * 0.05) * (mid * 0.6) + 
          Math.sin((x + offset) * 0.03) * (mid * 0.3);
        ctx.lineTo(x, y);
      }
      
      ctx.strokeStyle = "rgba(234, 56, 76, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add glow effect
      if (active) {
        ctx.shadowColor = "rgba(234, 56, 76, 0.7)";
        ctx.shadowBlur = 10;
      }
      
      // Move the wave
      offset += active ? 5 : 0;
      
      // Request next frame
      const animId = requestAnimationFrame(draw);
      setAnimationFrame(animId);
    };
    
    draw();
    
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [active, height]);
  
  return (
    <canvas 
      ref={canvasRef} 
      width={300} 
      height={height}
      className={`rounded-md ${className}`}
    />
  );
};
