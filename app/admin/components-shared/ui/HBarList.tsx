export interface BarDatum {
  label: string;
  value: number;
}

interface HBarListProps {
  data: BarDatum[];
  formatValue: (value: number) => string;
}

/**
 * 단일 시리즈 수평 막대 목록 (magnitude — 단일 색조).
 * 값 라벨을 막대 끝에 직접 표기하고, 표 형태 마크업으로 접근성을 확보합니다.
 */
export default function HBarList({ data, formatValue }: HBarListProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2" role="table">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3 group" role="row" title={`${d.label}: ${formatValue(d.value)}`}>
          <span className="w-16 text-sm text-muted-foreground text-right shrink-0" role="rowheader">{d.label}</span>
          <div className="flex-1 h-5 flex items-center">
            <div
              className="h-4 rounded-r bg-primary/80 group-hover:bg-primary transition-colors"
              style={{ width: `${Math.max((d.value / max) * 100, 2)}%` }}
            />
            <span className="ml-2 text-xs font-medium text-foreground whitespace-nowrap" role="cell">
              {formatValue(d.value)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
