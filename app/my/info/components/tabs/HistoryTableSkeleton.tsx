type ColumnAlignment = 'left' | 'center' | 'right';

interface HistoryTableSkeletonProps {
  title: string;
  columnAlignments: ColumnAlignment[];
  rows?: number;
  showPagination?: boolean;
}

const HEADER_WIDTHS = ['w-24', 'w-20', 'w-16', 'w-24', 'w-14'];
const BODY_WIDTHS = ['w-28', 'w-24', 'w-20', 'w-16', 'w-14'];

const ALIGNMENT_OFFSET_CLASS: Record<ColumnAlignment, string> = {
  left: '',
  center: 'mx-auto',
  right: 'ml-auto',
};

export default function HistoryTableSkeleton({
  title,
  columnAlignments,
  rows = 6,
  showPagination = true,
}: HistoryTableSkeletonProps) {
  return (
    <div className="flex flex-col w-full h-full p-6" aria-hidden="true">
      <h2 className="text-xl font-bold mb-6 text-text-primary">{title}</h2>

      <div className="rounded-lg overflow-hidden border border-border-primary">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-bg-secondary">
              <tr>
                {columnAlignments.map((alignment, index) => (
                  <th key={index} className="px-6 py-4">
                    <div
                      className={`h-4 animate-pulse rounded bg-bg-tertiary ${HEADER_WIDTHS[index % HEADER_WIDTHS.length]} ${ALIGNMENT_OFFSET_CLASS[alignment]}`}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-bg-primary">
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-tableRowBorder">
                  {columnAlignments.map((alignment, columnIndex) => (
                    <td key={columnIndex} className="px-6 py-4">
                      <div
                        className={`h-4 animate-pulse rounded bg-bg-secondary ${BODY_WIDTHS[(rowIndex + columnIndex) % BODY_WIDTHS.length]} ${ALIGNMENT_OFFSET_CLASS[alignment]}`}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-10 w-16 animate-pulse rounded border border-border-primary bg-bg-secondary" />
          <div className="h-10 w-10 animate-pulse rounded border border-border-primary bg-accent/15" />
          <div className="h-10 w-10 animate-pulse rounded border border-border-primary bg-bg-secondary" />
          <div className="h-10 w-10 animate-pulse rounded border border-border-primary bg-bg-secondary" />
          <div className="h-10 w-16 animate-pulse rounded border border-border-primary bg-bg-secondary" />
        </div>
      )}
    </div>
  );
}
