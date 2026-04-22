import React from 'react';

interface TabNavProps {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}

const TabNav: React.FC<TabNavProps> = ({ tabs, active, onChange }) => (
  <div className="flex space-x-6 border-b">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`border-b-2 py-2 font-medium transition-colors ${
          active === tab
            ? 'border-current text-text-primary'
            : 'border-transparent text-text-secondary hover:border-current hover:text-text-primary'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default TabNav;
