import React from 'react';

interface TabNavProps {
  tabs: readonly string[];
  active: string;
  onChange: (tab: string) => void;
}

const TAB_LABELS: Record<string, string> = {
  FAN: '팬클럽',
  BOOKMARK: '북마크',
};

const TabNav: React.FC<TabNavProps> = ({ tabs, active, onChange }) => (
  <div className="flex items-center gap-1 border-t border-[#2c2c38] bg-[#141419] px-4 py-2">
    {tabs.map(tab => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`relative rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors ${
          active === tab
            ? 'text-[#e2e2ea]'
            : 'text-[#72728a] hover:bg-[#20202a] hover:text-[#e2e2ea]'
        }`}
      >
        {TAB_LABELS[tab] ?? tab}
        {active === tab && (
          <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-accent" />
        )}
      </button>
    ))}
  </div>
);

export default TabNav;
