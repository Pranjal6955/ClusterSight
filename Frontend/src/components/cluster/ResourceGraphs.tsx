import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ClusterMetrics } from '../../types';

interface ResourceGraphsProps {
  metrics: ClusterMetrics;
}

const ResourceGraphs: React.FC<ResourceGraphsProps> = ({ metrics }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('6h');

  // Format data for charts
  const formatTimeSeriesData = (history: { timestamp: string; value: number }[]) => {
    // Filter data based on selected time range
    const now = new Date().getTime();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000
    };
    
    const filteredHistory = history.filter(point => {
      const pointTime = new Date(point.timestamp).getTime();
      return now - pointTime <= timeRangeMs[timeRange];
    });
    
    return filteredHistory.map(point => ({
      time: new Date(point.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: point.value
    }));
  };

  const cpuData = formatTimeSeriesData(metrics.cpu.history);
  const memoryData = formatTimeSeriesData(metrics.memory.history);

  // Format pod data for bar chart
  const podData = [
    { name: 'Running', value: metrics.pods.running, color: '#10B981' },
    { name: 'Pending', value: metrics.pods.pending, color: '#F59E0B' },
    { name: 'Failed', value: metrics.pods.failed, color: '#EF4444' },
    { name: 'Succeeded', value: metrics.pods.succeeded, color: '#3B82F6' }
  ];

  // Format node data for bar chart
  const nodeData = [
    { name: 'Ready', value: metrics.nodes.ready, color: '#10B981' },
    { name: 'Not Ready', value: metrics.nodes.notReady, color: '#EF4444' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* CPU Usage */}
      <div className="bg-background-card rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">CPU Usage</h3>
          <div className="flex space-x-1 bg-background-light rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-xs ${
                timeRange === '1h' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('1h')}
            >
              1h
            </button>
            <button
              className={`px-3 py-1 text-xs ${
                timeRange === '6h' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('6h')}
            >
              6h
            </button>
            <button
              className={`px-3 py-1 text-xs ${
                timeRange === '24h' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('24h')}
            >
              24h
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cpuData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }} 
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#4B5563',
                  borderRadius: '4px'
                }}
                formatter={(value) => [`${value}%`, 'CPU Usage']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="CPU Usage" 
                stroke="#1DCD9F" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-400">Current: <span className="text-white font-medium">{metrics.cpu.usage}%</span></div>
          <div className="text-gray-400">Limit: <span className="text-white font-medium">{metrics.cpu.limit}%</span></div>
        </div>
      </div>
      
      {/* Memory Usage */}
      <div className="bg-background-card rounded-lg shadow-sm p-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Memory Usage</h3>
          <div className="flex space-x-1 bg-background-light rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-xs ${
                timeRange === '1h' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('1h')}
            >
              1h
            </button>
            <button
              className={`px-3 py-1 text-xs ${
                timeRange === '6h' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('6h')}
            >
              6h
            </button>
            <button
              className={`px-3 py-1 text-xs ${
                timeRange === '24h' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setTimeRange('24h')}
            >
              24h
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={memoryData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }} 
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#4B5563',
                  borderRadius: '4px'
                }}
                formatter={(value) => [`${value}%`, 'Memory Usage']}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="Memory Usage" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="text-gray-400">Current: <span className="text-white font-medium">{metrics.memory.usage}%</span></div>
          <div className="text-gray-400">Limit: <span className="text-white font-medium">{metrics.memory.limit}%</span></div>
        </div>
      </div>
      
      {/* Pod Status */}
      <div className="bg-background-card rounded-lg shadow-sm p-5">
        <h3 className="text-lg font-semibold text-white mb-6">Pod Status</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={podData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }} 
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#4B5563',
                  borderRadius: '4px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Pods" 
                radius={[4, 4, 0, 0]}
              >
                {podData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Total Pods:</div>
            <div className="text-white font-medium">{metrics.pods.total}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Running:</div>
            <div className="text-green-400 font-medium">{metrics.pods.running}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Pending:</div>
            <div className="text-yellow-400 font-medium">{metrics.pods.pending}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Failed:</div>
            <div className="text-red-400 font-medium">{metrics.pods.failed}</div>
          </div>
        </div>
      </div>
      
      {/* Node Status */}
      <div className="bg-background-card rounded-lg shadow-sm p-5">
        <h3 className="text-lg font-semibold text-white mb-6">Node Status</h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={nodeData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }} 
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }} 
                axisLine={{ stroke: '#4B5563' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#4B5563',
                  borderRadius: '4px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Nodes" 
                radius={[4, 4, 0, 0]}
              >
                {nodeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Total Nodes:</div>
            <div className="text-white font-medium">{metrics.nodes.total}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Ready:</div>
            <div className="text-green-400 font-medium">{metrics.nodes.ready}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Not Ready:</div>
            <div className="text-red-400 font-medium">{metrics.nodes.notReady}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-gray-400">Readiness:</div>
            <div className="text-white font-medium">
              {metrics.nodes.ready === metrics.nodes.total 
                ? '100%' 
                : `${Math.round((metrics.nodes.ready / metrics.nodes.total) * 100)}%`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceGraphs;