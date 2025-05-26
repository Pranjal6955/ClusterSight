import React from 'react';

type StatusType = 'healthy' | 'warning' | 'critical' | 'running' | 'pending' | 'failed' | 'succeeded' | 'unknown' | 'active' | 'terminating';

interface StatusBadgeProps {
  status: StatusType;
  pulse?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, pulse = false }) => {
  const getStatusConfig = (status: StatusType) => {
    switch (status) {
      case 'healthy':
      case 'running':
      case 'succeeded':
      case 'active':
        return {
          bgColor: 'bg-status-healthy',
          textColor: 'text-green-900',
          ringColor: 'ring-green-600',
          dotColor: 'bg-green-400',
        };
      case 'warning':
      case 'pending':
        return {
          bgColor: 'bg-status-warning',
          textColor: 'text-yellow-900',
          ringColor: 'ring-yellow-600',
          dotColor: 'bg-yellow-400',
        };
      case 'critical':
      case 'failed':
      case 'terminating':
        return {
          bgColor: 'bg-status-critical',
          textColor: 'text-red-900',
          ringColor: 'ring-red-600',
          dotColor: 'bg-red-400',
        };
      case 'unknown':
      default:
        return {
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-900',
          ringColor: 'ring-gray-400',
          dotColor: 'bg-gray-300',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      <span
        className={`-ml-0.5 mr-1.5 h-2 w-2 rounded-full ${config.dotColor} ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;