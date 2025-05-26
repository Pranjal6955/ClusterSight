import React from 'react';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  cluster: string;
}

interface AlertsListProps {
  alerts: Alert[];
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts }) => {
  // Sort alerts by severity and then by timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    // First by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const severityDiff = severityOrder[a.type] - severityOrder[b.type];
    if (severityDiff !== 0) return severityDiff;
    
    // Then by timestamp (newest first)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-400" />;
    }
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-red-800 bg-red-900 bg-opacity-20';
      case 'warning':
        return 'border-yellow-800 bg-yellow-900 bg-opacity-20';
      case 'info':
        return 'border-blue-800 bg-blue-900 bg-opacity-20';
      default:
        return 'border-gray-700';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-background-card rounded-lg shadow-sm p-5">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
      
      <div className="space-y-3">
        {sortedAlerts.length > 0 ? (
          sortedAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-3 border rounded-md ${getAlertClass(alert.type)}`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-baseline">
                    <h4 className="text-sm font-medium text-white">
                      {alert.cluster}
                    </h4>
                    <span className="text-xs text-gray-400">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-400">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-70" />
            <p>No active alerts</p>
            <p className="text-sm mt-1">All systems operating normally</p>
          </div>
        )}
      </div>
      
      {alerts.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-primary hover:text-primary-400 text-sm font-medium">
            View all alerts
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertsList;