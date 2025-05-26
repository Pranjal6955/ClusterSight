import React, { useState } from 'react';
import { SearchIcon, Filter, ChevronDown } from 'lucide-react';
import { Pod } from '../../types';
import StatusBadge from '../common/StatusBadge';

interface PodTableProps {
  pods: Pod[];
}

const PodTable: React.FC<PodTableProps> = ({ pods }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [namespaceFilter, setNamespaceFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique namespaces for filter
  const namespaces = [...new Set(pods.map(pod => pod.namespace))];

  // Filter pods based on search and filters
  const filteredPods = pods.filter(pod => {
    const matchesSearch = pod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? pod.status === statusFilter : true;
    const matchesNamespace = namespaceFilter ? pod.namespace === namespaceFilter : true;
    
    return matchesSearch && matchesStatus && matchesNamespace;
  });

  return (
    <div className="bg-background-card rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h3 className="text-lg font-semibold text-white">Pods</h3>
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="bg-background-light text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Search pods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              className="bg-background-light p-2 rounded-md text-gray-300 hover:text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <div className="relative">
                <select
                  className="bg-background-light text-white py-2 px-3 pr-8 rounded-md w-full appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  <option value="running">Running</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="succeeded">Succeeded</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Namespace</label>
              <div className="relative">
                <select
                  className="bg-background-light text-white py-2 px-3 pr-8 rounded-md w-full appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                  value={namespaceFilter || ''}
                  onChange={(e) => setNamespaceFilter(e.target.value || null)}
                >
                  <option value="">All Namespaces</option>
                  {namespaces.map(ns => (
                    <option key={ns} value={ns}>{ns}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-800">
          <thead className="bg-background-light">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Namespace
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Restarts
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Age
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                CPU
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                Memory
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filteredPods.length > 0 ? (
              filteredPods.map((pod) => (
                <tr key={pod.id} className="hover:bg-background-light">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {pod.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.namespace}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={pod.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.restarts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.age}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.cpu}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {pod.memory}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                  No pods found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PodTable;