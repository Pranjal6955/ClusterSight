import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CS</span>
          </div>
          <span className="text-white text-xl font-semibold">ClusterSight</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <span className="text-slate-300 text-sm">Kubernetes Multi-Cluster Dashboard</span>
          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">U</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
