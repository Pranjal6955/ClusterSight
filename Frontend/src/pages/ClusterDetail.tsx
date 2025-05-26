import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiService, Node, Pod, ClusterMetrics } from '../services/api'

const ClusterDetail: React.FC = () => {
  const { clusterName } = useParams<{ clusterName: string }>()
  const [nodes, setNodes] = useState<Node[]>([])
  const [pods, setPods] = useState<Pod[]>([])
  const [metrics, setMetrics] = useState<ClusterMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClusterData = async () => {
      if (!clusterName) return

      try {
        setLoading(true)
        const [nodesData, podsData, metricsData] = await Promise.all([
          apiService.getClusterNodes(clusterName),
          apiService.getClusterPods(clusterName),
          apiService.getClusterMetrics(clusterName),
        ])

        setNodes(nodesData.nodes)
        setPods(podsData.pods)
        setMetrics(metricsData)
      } catch (err) {
        setError('Failed to fetch cluster data')
        console.error('Error fetching cluster data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchClusterData()
  }, [clusterName])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="btn-primary mt-4 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{clusterName}</h1>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Nodes</h3>
            <div className="text-2xl font-bold text-gray-900">
              {metrics.nodes.ready}/{metrics.nodes.total}
            </div>
            <p className="text-sm text-gray-600">Ready</p>
          </div>
          
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pods</h3>
            <div className="text-2xl font-bold text-gray-900">{metrics.pods.running}</div>
            <p className="text-sm text-gray-600">Running</p>
          </div>
          
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">CPU Usage</h3>
            <div className="text-2xl font-bold text-gray-900">{metrics.cpu.usage_percent}%</div>
            <p className="text-sm text-gray-600">{metrics.cpu.used_cores}/{metrics.cpu.total_cores} cores</p>
          </div>
          
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Memory Usage</h3>
            <div className="text-2xl font-bold text-gray-900">{metrics.memory.usage_percent}%</div>
            <p className="text-sm text-gray-600">{metrics.memory.used_memory}/{metrics.memory.total_memory}</p>
          </div>
        </div>
      )}

      {/* Nodes Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Nodes ({nodes.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nodes.map((node) => (
                <tr key={node.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{node.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      node.status === 'Ready' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {node.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {node.roles.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{node.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{node.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pods Table */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pods ({pods.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Namespace</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ready</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restarts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pods.slice(0, 10).map((pod) => (
                <tr key={`${pod.namespace}-${pod.name}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pod.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pod.namespace}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pod.status === 'Running' ? 'text-green-600 bg-green-100' : 
                      pod.status === 'Pending' ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {pod.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pod.ready}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pod.restarts}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{pod.age}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pods.length > 10 && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Showing first 10 of {pods.length} pods
          </div>
        )}
      </div>
    </div>
  )
}

export default ClusterDetail