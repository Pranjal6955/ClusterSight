import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Bell, Menu, X, User, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (showNotifications) setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (isOpen) setIsOpen(false);
  };

  return (
    <nav className="bg-background-card border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Activity className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-semibold">ClusterSight</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleNotifications}
              className="p-2 rounded-md text-gray-300 hover:text-white relative"
              aria-label="Notifications"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <Link to="/settings" className="p-2 rounded-md text-gray-300 hover:text-white">
              <Settings className="h-6 w-6" />
            </Link>
            <div className="flex items-center ml-4 pl-4 border-l border-gray-700">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                <User className="h-5 w-5" />
              </div>
              <span className="ml-2 text-sm font-medium">Admin</span>
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
              aria-label="Main menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background-light">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary hover:bg-opacity-10"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary hover:bg-opacity-10"
              onClick={toggleMenu}
            >
              Settings
            </Link>
            <button
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary hover:bg-opacity-10"
              onClick={toggleNotifications}
            >
              Notifications
            </button>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-4 md:right-24 top-16 w-80 bg-background-card border border-gray-700 rounded-md shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-medium">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-700 hover:bg-background-light">
              <p className="text-sm text-red-400 font-medium">Critical Alert</p>
              <p className="text-sm">Production US-East cluster CPU usage at 92%</p>
              <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
            </div>
            <div className="p-4 border-b border-gray-700 hover:bg-background-light">
              <p className="text-sm text-yellow-400 font-medium">Warning</p>
              <p className="text-sm">Staging EU cluster has 2 pods in pending state</p>
              <p className="text-xs text-gray-400 mt-1">30 minutes ago</p>
            </div>
            <div className="p-4 hover:bg-background-light">
              <p className="text-sm text-green-400 font-medium">Info</p>
              <p className="text-sm">Development APAC cluster updated to v1.25.12</p>
              <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="p-2 border-t border-gray-700">
            <button className="w-full px-4 py-2 text-sm text-primary hover:bg-primary hover:bg-opacity-10 rounded-md">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;