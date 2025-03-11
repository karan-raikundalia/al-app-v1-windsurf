
import { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export function Surface3DChart() {
  // This is a placeholder for a 3D surface chart
  // In a real implementation, you would use a library like Three.js or Plot.ly
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a simple grid to represent a 3D surface (this is just a placeholder)
    const width = canvas.width;
    const height = canvas.height;
    const gridSize = 20;
    const margin = 40;
    
    // Draw perspective grid lines
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 0.5;
    
    // Draw x-z grid lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      const startX = margin + i * (width - 2 * margin) / 10;
      const startY = height - margin;
      const endX = margin + width / 2 + (i - 5) * (width - 2 * margin) / 20;
      const endY = margin;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
    
    // Draw y-z grid lines
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      const y = margin + i * (height - 2 * margin) / 10;
      ctx.moveTo(margin, y);
      ctx.lineTo(width - margin, y);
      ctx.stroke();
    }
    
    // Draw a colorful surface
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        // Calculate positions for the quadrilateral
        const x1 = margin + x * (width - 2 * margin) / 10;
        const y1 = height - margin - y * (height - 2 * margin) / 10;
        
        const x2 = margin + (x + 1) * (width - 2 * margin) / 10;
        const y2 = height - margin - y * (height - 2 * margin) / 10;
        
        const x3 = margin + (x + 1) * (width - 2 * margin) / 10;
        const y3 = height - margin - (y + 1) * (height - 2 * margin) / 10;
        
        const x4 = margin + x * (width - 2 * margin) / 10;
        const y4 = height - margin - (y + 1) * (height - 2 * margin) / 10;
        
        // Calculate z value (height) based on x and y
        const z = Math.sin(x / 3) * Math.cos(y / 3) * 0.5 + 0.5;
        
        // Color based on z value
        let r, g, b;
        if (z < 0.5) {
          // Red to yellow
          r = 255;
          g = Math.floor(z * 2 * 255);
          b = 0;
        } else {
          // Yellow to green
          r = Math.floor((1 - (z - 0.5) * 2) * 255);
          g = 255;
          b = 0;
        }
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        
        // Draw the quadrilateral
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
    
    // Draw axis labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#666';
    
    // Draw axis titles
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('CapEx', 10, height / 2);
    ctx.fillText('Energy Price', width / 2, height - 10);
    ctx.fillText('IRR', width - 30, 20);
    
  }, []);
  
  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">3D Surface Plot: IRR Sensitivity</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">X-Axis:</span>
            <Select defaultValue="energy_price">
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Select variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="energy_price">Energy Price</SelectItem>
                <SelectItem value="capacity_factor">Capacity Factor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">Y-Axis:</span>
            <Select defaultValue="capex">
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Select variable" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capex">CapEx</SelectItem>
                <SelectItem value="opex">OpEx</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm">Z-Axis:</span>
            <Select defaultValue="irr">
              <SelectTrigger className="w-[140px] h-8 text-xs">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="irr">IRR</SelectItem>
                <SelectItem value="npv">NPV</SelectItem>
                <SelectItem value="lcoe">LCOE</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={400} 
          className="border rounded-md"
        />
      </div>
      
      <div className="flex justify-center items-center mt-4">
        <div className="flex items-center">
          <div className="text-xs pr-2">Low IRR</div>
          <div className="w-48 h-4 rounded-md" style={{
            background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00)'
          }}></div>
          <div className="text-xs pl-2">High IRR</div>
        </div>
      </div>
      
      <div className="mt-4 border-t pt-2">
        <p className="text-xs text-muted-foreground text-center">
          Note: This is a simplified representation. In a production environment, 
          this would be replaced with an interactive 3D visualization.
        </p>
      </div>
    </div>
  );
}
