import React from 'react';
import type { Cluster } from '../types/cluster';

interface DashboardCardsProps {
  clusters: Cluster[];
}

const DashboardCards: React.FC<DashboardCardsProps> = ({ clusters }) => {
  const totalNodes = clusters.reduce((sum, cluster) => sum + cluster.nodeCount, 0);
  const totalPods = clusters.reduce((sum, cluster) => sum + cluster.podCount, 0);
  const healthyClusters = clusters.filter(c => c.status === 'healthy').length;
  const avgCpuUsage = clusters.length > 0 
    ? clusters.reduce((sum, cluster) => sum + cluster.cpuUsage, 0) / clusters.length 
    : 0;

  const cards = [
    {
      title: 'Total Clusters',
      value: clusters.length,
      icon: '🎯',
      color: 'bg-blue-500',
      subtext: `${healthyClusters} healthy`
    },
    {
      title: 'Total Nodes',
      value: totalNodes,
      icon: '🖥️',
      color: 'bg-green-500',
      subtext: 'Across all clusters'
    },
    {
      title: 'Total Pods',
      value: totalPods,
      icon: '📦',
      color: 'bg-purple-500',
      subtext: 'Running workloads'
    },
    {
      title: 'Avg CPU Usage',
      value: `${Math.round(avgCpuUsage)}%`,
      icon: '📊',
      color: 'bg-orange-500',
      subtext: 'Cluster average'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
              <p className="text-slate-500 text-xs mt-1">{card.subtext}</p>
            </div>
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-xl">{card.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
