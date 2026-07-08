'use client';

export interface TabItem<T extends string> {
  key: T;
  label: string;
  badge?: number;
}

interface TabNavProps<T extends string> {
  tabs: readonly TabItem<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export default function TabNav<T extends string>({ tabs, activeTab, onChange }: TabNavProps<T>) {
  return (
    <div className="border-b border-border">
      <div className="flex gap-0 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-semibold">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
