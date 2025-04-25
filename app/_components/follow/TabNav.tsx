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
            ? 'border-b-2 border-blue-500 text-blue-500'
            : 'text-gray-400'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default TabNav;
