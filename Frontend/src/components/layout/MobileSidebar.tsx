import React, { useState } from 'react';
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
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const MobileSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="fixed bottom-4 right-4 md:hidden z-50 bg-primary rounded-full p-3 shadow-lg"
        onClick={toggleSidebar}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      />

      <div 
        className={`fixed top-0 right-0 h-full w-64 bg-background-card z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Menu</h2>
          <button 
            className="text-gray-400 hover:text-white" 
            onClick={closeSidebar}
            aria-label="Close navigation menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-full pb-20">
          <nav className="space-y-6">
            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Main
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      location.pathname === '/' 
                        ? 'bg-primary bg-opacity-20 text-primary' 
                        : 'text-gray-300 hover:bg-background-light'
                    }`}
                    onClick={closeSidebar}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center justify-between p-2 rounded-md text-gray-300 hover:bg-background-light">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-5 w-5" />
                      <span>Clusters</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>
                      <Link
                        to="/cluster/cluster-1"
                        className={`block py-2 px-2 text-sm rounded-md ${
                          location.pathname === '/cluster/cluster-1' 
                            ? 'text-primary' 
                            : 'text-gray-300 hover:text-white'
                        }`}
                        onClick={closeSidebar}
                      >
                        Production US-East
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cluster/cluster-2"
                        className={`block py-2 px-2 text-sm rounded-md ${
                          location.pathname === '/cluster/cluster-2' 
                            ? 'text-primary' 
                            : 'text-gray-300 hover:text-white'
                        }`}
                        onClick={closeSidebar}
                      >
                        Staging EU
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cluster/cluster-3"
                        className={`block py-2 px-2 text-sm rounded-md ${
                          location.pathname === '/cluster/cluster-3' 
                            ? 'text-primary' 
                            : 'text-gray-300 hover:text-white'
                        }`}
                        onClick={closeSidebar}
                      >
                        Development APAC
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      location.pathname === '/resources' 
                        ? 'bg-primary bg-opacity-20 text-primary' 
                        : 'text-gray-300 hover:bg-background-light'
                    }`}
                    onClick={closeSidebar}
                  >
                    <Database className="h-5 w-5" />
                    <span>Resources</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/events"
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      location.pathname === '/events' 
                        ? 'bg-primary bg-opacity-20 text-primary' 
                        : 'text-gray-300 hover:bg-background-light'
                    }`}
                    onClick={closeSidebar}
                  >
                    <ServerCrash className="h-5 w-5" />
                    <span>Events</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Monitoring
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/metrics"
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      location.pathname === '/metrics' 
                        ? 'bg-primary bg-opacity-20 text-primary' 
                        : 'text-gray-300 hover:bg-background-light'
                    }`}
                    onClick={closeSidebar}
                  >
                    <PieChart className="h-5 w-5" />
                    <span>Metrics</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/alerts"
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      location.pathname === '/alerts' 
                        ? 'bg-primary bg-opacity-20 text-primary' 
                        : 'text-gray-300 hover:bg-background-light'
                    }`}
                    onClick={closeSidebar}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>Alerts</span>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="mb-2 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                Configuration
              </div>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/settings"
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      location.pathname === '/settings' 
                        ? 'bg-primary bg-opacity-20 text-primary' 
                        : 'text-gray-300 hover:bg-background-light'
                    }`}
                    onClick={closeSidebar}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/help"
                    className={`flex items-center space-x-2 p-2 rounded-md ${
                      location.pathname === '/help' 
                        ? 'bg-primary bg-opacity-20 text-primary' 
                        : 'text-gray-300 hover:bg-background-light'
                    }`}
                    onClick={closeSidebar}
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>Help & Support</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;