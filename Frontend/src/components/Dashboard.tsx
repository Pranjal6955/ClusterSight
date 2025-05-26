import React from 'react';
import MetricsChart from './MetricsChart';
import MetricsCard from './MetricsCard';
import { ActivityIcon, RefreshCwIcon } from 'lucide-react';
import { useMetrics } from '../hooks/useMetrics';

const Dashboard: React.FC = () => {
  const { metricsData, isLoading, error } = useMetrics(3000);
  const lastUpdated = metricsData.length > 0 
    ? new Date(metricsData[metricsData.length - 1].timestamp).toLocaleTimeString() 
    : '-';

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg text-center">
        <p className="text-red-500 mb-3 font-semibold">Error loading metrics</p>
        <p className="text-gray-300">{error}</p>
        <p className="text-gray-400 mt-4 text-sm">
          Make sure your backend is running at localhost:8081
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ActivityIcon className="h-6 w-6 text-blue-500 mr-2" />
          <h2 className="text-xl font-semibold text-gray-200">System Metrics</h2>
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      </div>

      {isLoading && metricsData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-3"></div>
            <p className="text-gray-400">Loading metrics data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <MetricsCard data={metricsData} type="cpu" />
            <MetricsCard data={metricsData} type="memory" />
          </div>
          
          <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <MetricsChart 
              data={metricsData}
              title="System Resource Usage Over Time" 
            />
          </div>
          
          <div className="mt-6 text-xs text-gray-500 text-center">
            Displaying up to 20 most recent data points • Auto-refreshes every 3 seconds
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;