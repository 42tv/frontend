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
        className={`py-2 ${
          active === tab
            ? 'border-b-2 border-accent-100 text-accent-100 dark:text-accent-dark'
            : 'text-text-muted dark:text-text-muted-dark hover:text-text-secondary dark:hover:text-text-secondary-dark hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default TabNav;
