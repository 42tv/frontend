import React from 'react';

interface ContentSkeletonProps {
  showEditAction?: boolean;
}

export default function ContentSkeleton({ showEditAction = false }: ContentSkeletonProps) {
  return (
    <div className="rounded-2xl border border-[#2c2c38] bg-[#17171c] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-16 animate-pulse rounded-full bg-[#20202a]" />
          <div className="h-7 w-16 animate-pulse rounded-full bg-[#20202a]" />
          {showEditAction && <div className="h-7 w-16 animate-pulse rounded-full bg-[#20202a]" />}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-14 animate-pulse rounded bg-[#20202a]" />
          <div className="h-6 w-11 animate-pulse rounded-full bg-[#20202a]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-[#2c2c38] bg-[#20202a]">
            <div className="aspect-[16/9] animate-pulse bg-[#2a2a36]" />
            <div className="space-y-2 px-3 py-3">
              <div className="h-3 w-2/3 animate-pulse rounded bg-[#2a2a36]" />
              <div className="h-2 w-1/3 animate-pulse rounded bg-[#2a2a36]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
