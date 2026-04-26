interface ArticleListSkeletonProps {
  showCreateButton?: boolean;
  rows?: number;
}

export default function ArticleListSkeleton({
  showCreateButton = false,
  rows = 5,
}: ArticleListSkeletonProps) {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="flex justify-end items-center">
        {showCreateButton && (
          <div className="h-9 w-32 animate-pulse rounded-lg bg-background-secondary dark:bg-background-secondary-dark" />
        )}
      </div>

      <div className="grid gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-4 min-h-[180px] border border-border-primary dark:border-border-primary-dark"
          >
            <div className="flex justify-between items-start gap-4 h-full">
              <div className="flex-1 flex flex-col gap-3 h-full">
                <div className="h-5 w-2/3 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-full animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
                  <div className="h-4 w-4/6 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
                </div>
                <div className="h-3 w-24 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark mt-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
