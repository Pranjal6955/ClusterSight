import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { ClusterDetails as ClusterDetailsType, Pod, Namespace, Event } from '../types/cluster';
import { clusterApi } from '../api/clusterApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const ClusterDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [clusterDetails, setClusterDetails] = useState<ClusterDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pods' | 'namespaces' | 'events'>('pods');

  const fetchClusterDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await clusterApi.getClusterDetails(id);
      setClusterDetails(data);
    } catch (err) {
      setError('Failed to fetch cluster details. Please check your connection.');
      console.error('Error fetching cluster details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusterDetails();
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading cluster details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchClusterDetails} />;
  }

  if (!clusterDetails) {
    return <ErrorMessage message="Cluster not found" />;
  }

  const { cluster, pods, namespaces, events } = clusterDetails;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running': case 'Active': case 'healthy': return 'bg-green-100 text-green-800';
      case 'Pending': case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': case 'Error': case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
          <Link to="/" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-900">{cluster.name}</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{cluster.name}</h1>
            <p className="text-slate-600">{cluster.region} • Version {cluster.version}</p>
          </div>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(cluster.status)}`}>
            {cluster.status}
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-slate-600 text-sm font-medium">Nodes</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{cluster.nodeCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-slate-600 text-sm font-medium">Pods</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{cluster.podCount}</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-slate-600 text-sm font-medium">CPU Usage</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{cluster.cpuUsage}%</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="text-slate-600 text-sm font-medium">Memory Usage</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{cluster.memoryUsage}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'pods', label: 'Pods', count: pods.length },
              { key: 'namespaces', label: 'Namespaces', count: namespaces.length },
              { key: 'events', label: 'Events', count: events.length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pods' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Namespace</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">CPU</th>
                    <th className="pb-3">Memory</th>
                    <th className="pb-3">Restarts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pods.map((pod) => (
                    <tr key={pod.id}>
                      <td className="py-3 text-sm font-medium text-slate-900">{pod.name}</td>
                      <td className="py-3 text-sm text-slate-500">{pod.namespace}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pod.status)}`}>
                          {pod.status}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-slate-900">{pod.cpuUsage}%</td>
                      <td className="py-3 text-sm text-slate-900">{pod.memoryUsage}%</td>
                      <td className="py-3 text-sm text-slate-900">{pod.restarts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'namespaces' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {namespaces.map((namespace, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-slate-900">{namespace.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(namespace.status)}`}>
                      {namespace.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{namespace.podCount} pods</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.type)}`}>
                          {event.type}
                        </span>
                        <span className="text-sm font-medium text-slate-900">{event.reason}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{event.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>Source: {event.source}</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClusterDetails;
