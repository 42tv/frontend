export type StatCardColor = 'blue' | 'green' | 'yellow' | 'purple' | 'red';

const colorClasses: Record<StatCardColor, string> = {
  blue: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20',
  green: 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20',
  yellow: 'border-l-yellow-500 bg-yellow-50/50 dark:bg-yellow-950/20',
  purple: 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/20',
  red: 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20',
};

interface StatCardProps {
  title: string;
  value: number | string;
  color: StatCardColor;
  description?: string;
}

export default function StatCard({ title, value, color, description }: StatCardProps) {
  return (
    <div className={`rounded-lg border border-l-4 p-6 ${colorClasses[color]} bg-card`}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
