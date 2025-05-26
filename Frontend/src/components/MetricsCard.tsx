import React from 'react';
import { CpuIcon, HardDriveIcon } from 'lucide-react';
import { MetricsData } from '../types/metrics';

interface MetricsCardProps {
  data: MetricsData[];
  type: 'cpu' | 'memory';
}

const MetricsCard: React.FC<MetricsCardProps> = ({ data, type }) => {
  const latestValue = data.length > 0 ? data[data.length - 1][type] : 0;
  const avgValue = data.length > 0 
    ? Math.round(data.reduce((sum, curr) => sum + curr[type], 0) / data.length) 
    : 0;
  
  const getColor = (value: number): string => {
    if (value < 50) return 'text-green-500';
    if (value < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  const valueColor = getColor(latestValue);
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-5 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-300 font-medium text-lg capitalize">
          {type === 'cpu' ? 'CPU Usage' : 'Memory Usage'}
        </h3>
        <div className="p-2 rounded-full bg-gray-700">
          {type === 'cpu' ? (
            <CpuIcon className="h-5 w-5 text-blue-500" />
          ) : (
            <HardDriveIcon className="h-5 w-5 text-green-500" />
          )}
        </div>
      </div>
      
      <div className="flex flex-col">
        <div className={`text-3xl font-bold ${valueColor}`}>
          {latestValue}%
        </div>
        <div className="text-gray-400 text-sm mt-1">
          Avg: {avgValue}%
        </div>
      </div>
      
      <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${type === 'cpu' ? 'bg-blue-500' : 'bg-green-500'}`}
          style={{ width: `${latestValue}%`, transition: 'width 1s ease-in-out' }}
        />
      </div>
    </div>
  );
};

export default MetricsCard;