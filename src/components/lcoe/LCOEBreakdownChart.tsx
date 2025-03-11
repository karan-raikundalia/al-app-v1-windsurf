
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { LCOEBreakdown } from '@/models/lcoe';
import { formatNumber } from '@/lib/utils';

interface LCOEBreakdownChartProps {
  breakdown: LCOEBreakdown;
}

export function LCOEBreakdownChart({ breakdown }: LCOEBreakdownChartProps) {
  // Transform the breakdown data for the chart
  const transformedData = [
    {
      name: 'Capital',
      value: breakdown.capitalComponent,
      color: '#3b82f6', // blue-500
    },
    {
      name: 'O&M',
      value: breakdown.oAndMComponent,
      color: '#10b981', // emerald-500
    },
    {
      name: 'Fuel',
      value: breakdown.fuelComponent,
      color: '#f59e0b', // amber-500
    },
    {
      name: 'Carbon',
      value: breakdown.carbonComponent,
      color: '#6b7280', // gray-500
    },
    {
      name: 'Tax',
      value: breakdown.taxComponent,
      color: '#ef4444', // red-500
    },
    {
      name: 'Incentives',
      value: breakdown.incentiveComponent,
      color: '#8b5cf6', // violet-500
    },
  ].filter(item => Math.abs(item.value) > 0.01); // Filter out negligible components

  // Create total LCOE data
  const totalData = [
    {
      name: 'Total LCOE',
      value: breakdown.totalLCOE,
      color: '#000000',
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">LCOE Breakdown ($/MWh)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={transformedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `$${formatNumber(value)}`}
              label={{ value: '$/MWh', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: any) => [`$${formatNumber(value)}`, 'Value']}
            />
            <Legend />
            <Bar dataKey="value" name="$/MWh">
              {transformedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Total LCOE</h3>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart
            data={totalData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `$${formatNumber(value)}`}
            />
            <Tooltip 
              formatter={(value: any) => [`$${formatNumber(value)}`, 'Value']}
            />
            <Bar dataKey="value" name="$/MWh" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
