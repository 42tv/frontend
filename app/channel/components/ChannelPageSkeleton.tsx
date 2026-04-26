export default function ChannelPageSkeleton() {
  return (
    <div aria-hidden="true">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full animate-pulse bg-background-secondary dark:bg-background-secondary-dark flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-7 w-56 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
            <div className="h-4 w-32 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-background-secondary dark:bg-background-secondary-dark rounded-lg p-4 border border-border-primary dark:border-border-primary-dark text-center space-y-2"
            >
              <div className="h-8 w-16 mx-auto animate-pulse rounded bg-bg-secondary dark:bg-bg-secondary" />
              <div className="h-3 w-12 mx-auto animate-pulse rounded bg-bg-secondary dark:bg-bg-secondary" />
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border-primary dark:border-border-primary-dark mb-6">
        <div className="flex space-x-8 pb-2">
          <div className="h-4 w-14 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
          <div className="h-4 w-14 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
        </div>
      </div>

      {/* Article Content */}
      <div className="min-h-96 grid gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-4 min-h-[180px] border border-border-primary dark:border-border-primary-dark"
          >
            <div className="flex flex-col gap-3 h-full">
              <div className="h-5 w-2/3 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-full animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
                <div className="h-4 w-4/6 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark" />
              </div>
              <div className="h-3 w-24 animate-pulse rounded bg-background-secondary dark:bg-background-secondary-dark mt-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
