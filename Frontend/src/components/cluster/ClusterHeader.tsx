import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cluster } from '../../types';
import StatusBadge from '../common/StatusBadge';

interface ClusterHeaderProps {
  cluster: Cluster;
  onRefresh: () => void;
  isLoading: boolean;
}

const ClusterHeader: React.FC<ClusterHeaderProps> = ({ 
  cluster, 
  onRefresh,
  isLoading
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <Link 
          to="/" 
          className="text-gray-400 hover:text-white mr-2 transition-colors duration-200"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">{cluster.name}</h1>
        <StatusBadge 
          status={cluster.status} 
          pulse={cluster.status === 'critical'} 
          className="ml-3" 
        />
        <button 
          onClick={onRefresh}
          className="ml-auto p-2 text-gray-400 hover:text-white rounded-full transition-colors duration-200"
          disabled={isLoading}
          aria-label="Refresh cluster data"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <div>
          <span className="mr-1">Region:</span>
          <span className="text-white">{cluster.region}</span>
        </div>
        <div>
          <span className="mr-1">Provider:</span>
          <span className="text-white">{cluster.provider.toUpperCase()}</span>
        </div>
        <div>
          <span className="mr-1">Version:</span>
          <span className="text-white">{cluster.version}</span>
        </div>
        <div>
          <span className="mr-1">Nodes:</span>
          <span className="text-white">{cluster.nodes}</span>
        </div>
        <div>
          <span className="mr-1">Last Updated:</span>
          <span className="text-white">
            {new Date(cluster.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ClusterHeader;