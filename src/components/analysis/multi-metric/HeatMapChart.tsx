
import { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function HeatMapChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create a heat map
    const cellSize = 30;
    const rows = 10;
    const cols = 10;
    const margin = 40;
    
    // Draw axis labels
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#666';
    
    // Draw y-axis labels (CapEx variations)
    for (let i = 0; i <= rows; i++) {
      const label = ((1 - i / rows) * 50 + 75).toFixed(0) + '%';
      ctx.fillText(label, 5, margin + i * cellSize + cellSize / 2);
    }
    
    // Draw x-axis labels (Energy Price variations)
    for (let j = 0; j <= cols; j++) {
      const label = ((j / cols) * 60 + 30).toFixed(0);
      ctx.fillText(label, margin + j * cellSize, margin + rows * cellSize + 15);
    }
    
    // Draw axis titles
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('CapEx (%)', 5, 20);
    ctx.fillText('Energy Price ($/MWh)', margin + cols * cellSize / 2 - 50, margin + rows * cellSize + 35);
    
    // Draw the heat map cells
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Generate a value between 0 and 1 based on position
        // This would normally come from your actual data
        const normalizedValue = Math.min(1, Math.max(0, 
          (1 - i / rows) * 0.8 + (j / cols) * 0.7 + Math.random() * 0.1
        ));
        
        // Color scale from red (low) to yellow to green (high)
        let r, g, b;
        if (normalizedValue < 0.5) {
          // Red to yellow
          r = 255;
          g = Math.floor(normalizedValue * 2 * 255);
          b = 0;
        } else {
          // Yellow to green
          r = Math.floor((1 - (normalizedValue - 0.5) * 2) * 255);
          g = 255;
          b = 0;
        }
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(margin + j * cellSize, margin + i * cellSize, cellSize, cellSize);
        
        // Add cell border
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(margin + j * cellSize, margin + i * cellSize, cellSize, cellSize);
        
        // Add IRR value label to cell
        const irrValue = (normalizedValue * 20).toFixed(1) + '%';
        ctx.fillStyle = normalizedValue > 0.6 ? '#000' : '#fff';
        ctx.font = '9px sans-serif';
        ctx.fillText(irrValue, margin + j * cellSize + cellSize/2 - 10, margin + i * cellSize + cellSize/2 + 3);
      }
    }
  }, []);
  
  return (
    <div className="w-full p-4">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Heat Map: IRR Sensitivity</h3>
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
                <SelectItem value="discount_rate">Discount Rate</SelectItem>
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
                <SelectItem value="interest_rate">Interest Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <canvas 
          ref={canvasRef} 
          width={400} 
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
    </div>
  );
}
