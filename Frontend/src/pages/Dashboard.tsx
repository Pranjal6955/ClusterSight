import React, { useState, useEffect } from 'react';
import type { Cluster } from '../types/cluster';
import { clusterApi } from '../api/clusterApi';
import DashboardCards from '../components/DashboardCards';
import ClusterTable from '../components/ClusterTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard: React.FC = () => {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clusterApi.getClusters();
      setClusters(data);
    } catch (err) {
      setError('Failed to fetch cluster data. Please check your connection.');
      console.error('Error fetching clusters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading cluster data..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchClusters} />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">Monitor your Kubernetes clusters at a glance</p>
      </div>
      
      <DashboardCards clusters={clusters} />
      <ClusterTable clusters={clusters} />
    </div>
  );
};

export default Dashboard;
