export default function LiveStreamCardSkeleton() {
  return (
    <div
      className="flex flex-col overflow-hidden rounded-md border border-[#2c2c38] bg-[#20202a]"
      aria-hidden="true"
    >
      <div className="relative aspect-video w-full animate-pulse bg-[#2a2a36]">
        <div className="absolute left-1.5 top-1.5 h-4 w-10 rounded-sm bg-[#3a3a48]" />
        <div className="absolute bottom-1.5 right-1.5 h-4 w-12 rounded-sm bg-[#17171c]" />
      </div>

      <div className="space-y-2 px-2.5 py-2">
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-[#2a2a36]" />
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 flex-shrink-0 animate-pulse rounded-full bg-[#2a2a36]" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-[#2a2a36]" />
          <div className="ml-auto h-4 w-12 flex-shrink-0 animate-pulse rounded-sm bg-[#2a2a36]" />
        </div>
      </div>
    </div>
  );
}
