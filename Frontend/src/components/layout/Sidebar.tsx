import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Cpu, 
  Database, 
  ServerCrash, 
  PieChart, 
  AlertTriangle, 
  Settings, 
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  hasSubMenu?: boolean;
  subMenuOpen?: boolean;
  toggleSubMenu?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  to, 
  icon, 
  label, 
  isActive,
  hasSubMenu = false,
  subMenuOpen = false,
  toggleSubMenu
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors duration-200 ${
        isActive 
          ? 'bg-primary bg-opacity-20 text-primary' 
          : 'text-gray-300 hover:bg-background-light hover:text-white'
      }`}
      onClick={hasSubMenu ? (e) => {
        e.preventDefault();
        if (toggleSubMenu) toggleSubMenu();
      } : undefined}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">{label}</div>
      {hasSubMenu && (
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${subMenuOpen ? 'transform rotate-180' : ''}`} 
        />
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [clustersOpen, setClustersOpen] = React.useState(true);

  const toggleClusters = () => {
    setClustersOpen(!clustersOpen);
  };

  return (
    <div className="w-64 bg-background-card border-r border-gray-800 h-screen overflow-y-auto fixed left-0 top-16 hidden md:block">
      <div className="px-4 py-6">
        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-4">
          Main
        </h2>
        <div className="space-y-1">
          <SidebarItem
            to="/"
            icon={<LayoutDashboard className="h-5 w-5" />}
            label="Dashboard"
            isActive={location.pathname === '/'}
          />

          <SidebarItem
            to="/clusters"
            icon={<Cpu className="h-5 w-5" />}
            label="Clusters"
            isActive={location.pathname.startsWith('/cluster')}
            hasSubMenu={true}
            subMenuOpen={clustersOpen}
            toggleSubMenu={toggleClusters}
          />

          {clustersOpen && (
            <div className="ml-9 space-y-1 mt-1 border-l border-gray-700 pl-3">
              <Link
                to="/cluster/cluster-1"
                className={`block py-2 text-sm transition-colors duration-200 ${
                  location.pathname === '/cluster/cluster-1'
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Production US-East
              </Link>
              <Link
                to="/cluster/cluster-2"
                className={`block py-2 text-sm transition-colors duration-200 ${
                  location.pathname === '/cluster/cluster-2'
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Staging EU
              </Link>
              <Link
                to="/cluster/cluster-3"
                className={`block py-2 text-sm transition-colors duration-200 ${
                  location.pathname === '/cluster/cluster-3'
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Development APAC
              </Link>
              <Link
                to="/cluster/cluster-4"
                className={`block py-2 text-sm transition-colors duration-200 ${
                  location.pathname === '/cluster/cluster-4'
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Data Processing
              </Link>
              <Link
                to="/cluster/cluster-5"
                className={`block py-2 text-sm transition-colors duration-200 ${
                  location.pathname === '/cluster/cluster-5'
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Analytics Platform
              </Link>
            </div>
          )}

          <SidebarItem
            to="/resources"
            icon={<Database className="h-5 w-5" />}
            label="Resources"
            isActive={location.pathname === '/resources'}
          />

          <SidebarItem
            to="/events"
            icon={<ServerCrash className="h-5 w-5" />}
            label="Events"
            isActive={location.pathname === '/events'}
          />
        </div>

        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-8 mb-4">
          Monitoring
        </h2>
        <div className="space-y-1">
          <SidebarItem
            to="/metrics"
            icon={<PieChart className="h-5 w-5" />}
            label="Metrics"
            isActive={location.pathname === '/metrics'}
          />

          <SidebarItem
            to="/alerts"
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Alerts"
            isActive={location.pathname === '/alerts'}
          />
        </div>

        <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mt-8 mb-4">
          Configuration
        </h2>
        <div className="space-y-1">
          <SidebarItem
            to="/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Settings"
            isActive={location.pathname === '/settings'}
          />

          <SidebarItem
            to="/help"
            icon={<HelpCircle className="h-5 w-5" />}
            label="Help & Support"
            isActive={location.pathname === '/help'}
          />
        </div>
      </div>

      <div className="px-4 py-4 mt-auto border-t border-gray-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-md bg-primary-700 flex items-center justify-center">
              <span className="text-white font-semibold">CS</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">ClusterSight</p>
            <p className="text-xs text-gray-400">v1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;