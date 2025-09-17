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
        className={`py-2 transition-colors ${
          active === tab
            ? 'border-b-2 border-accent text-accent'
            : 'text-text-muted hover:text-text-secondary hover:border-b-2 hover:border-border-hover'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default TabNav;
