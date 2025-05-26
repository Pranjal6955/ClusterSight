import React, { createContext, useContext, ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  onChange: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  children: ReactNode;
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ children, activeTab, onChange }) => {
  return (
    <TabsContext.Provider value={{ activeTab, onChange }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex border-b border-gray-800 mb-6 ${className}`}>
      {children}
    </div>
  );
};

interface TabProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ children, id, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }
  
  const { activeTab, onChange } = context;
  const isActive = activeTab === id;
  
  return (
    <button
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 relative ${
        isActive 
          ? 'text-primary' 
          : 'text-gray-400 hover:text-white'
      } ${className}`}
      onClick={() => onChange(id)}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
    >
      {children}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      )}
    </button>
  );
};

interface TabPanelProps {
  children: ReactNode;
  id: string;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, id, className = '' }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }
  
  const { activeTab } = context;
  
  if (activeTab !== id) {
    return null;
  }
  
  return (
    <div 
      className={className}
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
    >
      {children}
    </div>
  );
};