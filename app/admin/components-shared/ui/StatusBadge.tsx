export type BadgeTone = 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'gray';

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  gray: 'bg-muted text-muted-foreground',
};

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
}

export default function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${toneClasses[tone]}`}>
      {label}
    </span>
  );
}
