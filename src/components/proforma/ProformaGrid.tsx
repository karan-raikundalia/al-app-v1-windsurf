
import React from 'react';
import { DataPanel } from '@/components/ui/DataPanel';
import { cn } from '@/lib/utils';

interface ProformaGridProps {
  timeView: 'monthly' | 'quarterly' | 'yearly';
}

const ProformaGrid = ({ timeView }: ProformaGridProps) => {
  // Generate column headers based on timeView
  const generateHeaders = () => {
    const headers = [];
    const years = 20;
    
    if (timeView === 'yearly') {
      for (let i = 0; i < years; i++) {
        headers.push(`Year ${i + 1}`);
      }
    } else if (timeView === 'quarterly') {
      for (let i = 0; i < years; i++) {
        for (let q = 1; q <= 4; q++) {
          headers.push(`Y${i + 1} Q${q}`);
        }
      }
    } else {
      for (let i = 0; i < years; i++) {
        for (let m = 1; m <= 12; m++) {
          headers.push(`Y${i + 1} M${m}`);
        }
      }
    }
    return headers;
  };

  const headers = generateHeaders();

  return (
    <DataPanel className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap border-r">
                    Metric
                  </th>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/* Capital Expenditure Section */}
                <tr className="bg-gray-50">
                  <td className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-sm font-semibold" colSpan={headers.length + 1}>
                    Capital Expenditure (Capex)
                  </td>
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-gray-900 border-r">
                    Equipment Costs
                  </td>
                  {headers.map((_, index) => (
                    <td key={index} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      ${((Math.random() * 1000000) + 500000).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Operational Expenditure Section */}
                <tr className="bg-gray-50">
                  <td className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-sm font-semibold" colSpan={headers.length + 1}>
                    Operational Expenditure (Opex)
                  </td>
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-gray-900 border-r">
                    Maintenance
                  </td>
                  {headers.map((_, index) => (
                    <td key={index} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      ${((Math.random() * 100000) + 50000).toFixed(2)}
                    </td>
                  ))}
                </tr>

                {/* Energy Production Section */}
                <tr className="bg-gray-50">
                  <td className="sticky left-0 z-10 bg-gray-50 px-6 py-3 text-sm font-semibold" colSpan={headers.length + 1}>
                    Energy Production
                  </td>
                </tr>
                <tr>
                  <td className="sticky left-0 z-10 bg-white px-6 py-4 text-sm text-gray-900 border-r">
                    MWh Generated
                  </td>
                  {headers.map((_, index) => (
                    <td key={index} className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {((Math.random() * 1000) + 500).toFixed(2)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DataPanel>
  );
};

export default ProformaGrid;
