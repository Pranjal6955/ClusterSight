import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Cluster } from '../../types';

interface ResourceUtilizationProps {
  clusters: Cluster[];
}

const ResourceUtilization: React.FC<ResourceUtilizationProps> = ({ clusters }) => {
  const [selectedResource, setSelectedResource] = useState<'cpu' | 'memory' | 'storage'>('cpu');
  const [timeRange, setTimeRange] = useState<'6h' | '12h' | '24h'>('24h');

  // Prepare chart data
  const prepareChartData = () => {
    const allPoints: { [timestamp: string]: { time: string; [key: string]: number | string } } = {};
    
    // First, collect all unique timestamps
    clusters.forEach(cluster => {
      cluster[selectedResource].history.forEach(point => {
        const timestamp = point.timestamp;
        if (!allPoints[timestamp]) {
          allPoints[timestamp] = {
            time: new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          };
        }
      });
    });
    
    // Then, populate cluster values for each timestamp
    clusters.forEach(cluster => {
      cluster[selectedResource].history.forEach(point => {
        const timestamp = point.timestamp;
        if (allPoints[timestamp]) {
          allPoints[timestamp][cluster.name] = point.value;
        }
      });
    });
    
    // Convert to array and sort by timestamp
    return Object.values(allPoints).sort((a, b) => {
      return new Date(a.time).getTime() - new Date(b.time).getTime();
    });
  };

  const chartData = prepareChartData();

  // Generate unique colors for each cluster
  const getClusterColor = (index: number) => {
    const colors = ['#1DCD9F', '#3B82F6', '#F97316', '#8B5CF6', '#EC4899'];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-background-card rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Resource Utilization</h3>
        <div className="flex space-x-4">
          <div className="flex bg-background-light rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${
                selectedResource === 'cpu' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedResource('cpu')}
            >
              CPU
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                selectedResource === 'memory' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedResource('memory')}
            >
              Memory
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                selectedResource === 'storage' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setSelectedResource('storage')}
            >
              Storage
            </button>
          </div>
          <div className="flex bg-background-light rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${
                timeRange === '6h' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('6h')}
            >
              6h
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                timeRange === '12h' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('12h')}
            >
              12h
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                timeRange === '24h' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('24h')}
            >
              24h
            </button>
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {clusters.map((cluster, index) => (
                <linearGradient 
                  key={cluster.id} 
                  id={`colorGradient-${cluster.id}`} 
                  x1="0" 
                  y1="0" 
                  x2="0" 
                  y2="1"
                >
                  <stop 
                    offset="5%" 
                    stopColor={getClusterColor(index)} 
                    stopOpacity={0.8} 
                  />
                  <stop 
                    offset="95%" 
                    stopColor={getClusterColor(index)} 
                    stopOpacity={0.1} 
                  />
                </linearGradient>
              ))}
            </defs>
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#4B5563' }} 
              tickLine={{ stroke: '#4B5563' }} 
            />
            <YAxis 
              tick={{ fill: '#9CA3AF' }} 
              axisLine={{ stroke: '#4B5563' }} 
              tickLine={{ stroke: '#4B5563' }} 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                borderColor: '#4B5563',
                borderRadius: '4px'
              }} 
              formatter={(value) => [`${value}%`, '']} 
            />
            <Legend />
            {clusters.map((cluster, index) => (
              <Area 
                key={cluster.id}
                type="monotone" 
                dataKey={cluster.name} 
                name={cluster.name}
                stroke={getClusterColor(index)} 
                fillOpacity={1}
                fill={`url(#colorGradient-${cluster.id})`} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResourceUtilization;