import React, { useState } from 'react';
import { Namespace } from '../../types';
import StatusBadge from '../common/StatusBadge';

interface NamespaceListProps {
  namespaces: Namespace[];
}

const NamespaceList: React.FC<NamespaceListProps> = ({ namespaces }) => {
  const [activeNamespace, setActiveNamespace] = useState<string | null>(null);

  // Toggle namespace details
  const toggleNamespace = (id: string) => {
    setActiveNamespace(activeNamespace === id ? null : id);
  };

  return (
    <div className="bg-background-card rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-800">
        <h3 className="text-lg font-semibold text-white">Namespaces</h3>
      </div>
      
      <div className="divide-y divide-gray-800">
        {namespaces.map((namespace) => (
          <div key={namespace.id} className="transition-colors duration-200 hover:bg-background-light">
            <button
              className="w-full text-left px-5 py-4 flex items-center justify-between focus:outline-none"
              onClick={() => toggleNamespace(namespace.id)}
              aria-expanded={activeNamespace === namespace.id}
            >
              <div className="flex items-center">
                <div className="mr-3">
                  <StatusBadge status={namespace.status} />
                </div>
                <span className="font-medium text-white">{namespace.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-400">{namespace.pods} pods</div>
                <div className="text-sm text-gray-400">{namespace.age}</div>
                <svg
                  className={`h-5 w-5 text-gray-400 transform transition-transform duration-200 ${
                    activeNamespace === namespace.id ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </button>
            
            {activeNamespace === namespace.id && (
              <div className="px-5 py-4 bg-background-light border-t border-gray-800">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Resource Usage</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">CPU</p>
                        <p className="text-sm font-medium text-white">{namespace.cpu}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Memory</p>
                        <p className="text-sm font-medium text-white">{namespace.memory}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Pod Status</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Running</p>
                        <p className="text-sm font-medium text-white">
                          {Math.floor(Math.random() * namespace.pods)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Pending</p>
                        <p className="text-sm font-medium text-white">
                          {Math.floor(Math.random() * 3)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="text-primary hover:text-primary-400 text-sm font-medium">
                    View details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NamespaceList;