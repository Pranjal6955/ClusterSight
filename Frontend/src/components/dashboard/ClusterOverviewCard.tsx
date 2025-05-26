import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, MemoryStick as Memory, Database, ChevronRight } from 'lucide-react';
import { Cluster } from '../../types';
import StatusBadge from '../common/StatusBadge';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

interface ClusterOverviewCardProps {
  cluster: Cluster;
}

const ClusterOverviewCard: React.FC<ClusterOverviewCardProps> = ({ cluster }) => {
  // Format data for chart
  const formatChartData = (history: { timestamp: string; value: number }[]) => {
    return history.map((point) => ({
      time: new Date(point.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: point.value,
    }));
  };

  const cpuData = formatChartData(cluster.cpu.history);
  const memoryData = formatChartData(cluster.memory.history);

  // Get color based on status
  const getStatusColor = () => {
    switch (cluster.status) {
      case 'healthy': return 'border-status-healthy';
      case 'warning': return 'border-status-warning';
      case 'critical': return 'border-status-critical';
      default: return 'border-gray-700';
    }
  };

  return (
    <div className={`bg-background-card rounded-lg shadow-sm border-l-4 ${getStatusColor()} transition-all duration-300 hover:shadow-md`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">{cluster.name}</h3>
            <div className="mt-1 flex items-center space-x-3 text-sm text-gray-400">
              <span>{cluster.provider.toUpperCase()}</span>
              <span>•</span>
              <span>{cluster.region}</span>
              <span>•</span>
              <span>{cluster.version}</span>
            </div>
          </div>
          <StatusBadge status={cluster.status} pulse={cluster.status === 'critical'} />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center">
            <Cpu className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-gray-400">CPU</div>
              <div className="font-medium">{cluster.cpu.usage}%</div>
            </div>
          </div>
          <div className="flex items-center">
            <Memory className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-gray-400">Memory</div>
              <div className="font-medium">{cluster.memory.usage}%</div>
            </div>
          </div>
          <div className="flex items-center">
            <Database className="h-5 w-5 text-primary mr-2" />
            <div>
              <div className="text-sm text-gray-400">Storage</div>
              <div className="font-medium">{cluster.storage.usage}%</div>
            </div>
          </div>
        </div>

        <div className="mt-4 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cpuData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`cpuGradient-${cluster.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1DCD9F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1DCD9F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tick={false} 
                axisLine={false} 
              />
              <YAxis 
                hide 
                domain={[0, 100]} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#333', 
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}%`, 'CPU']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#1DCD9F" 
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#cpuGradient-${cluster.id})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Last updated {new Date(cluster.lastUpdated).toLocaleTimeString()}
          </div>
          <Link
            to={`/cluster/${cluster.id}`}
            className="inline-flex items-center text-primary hover:text-primary-400 text-sm font-medium"
          >
            View details
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClusterOverviewCard;