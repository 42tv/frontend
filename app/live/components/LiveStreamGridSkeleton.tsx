import LiveStreamCardSkeleton from './LiveStreamCardSkeleton';

interface LiveStreamGridSkeletonProps {
  count?: number;
}

export const liveGridClassName = 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

export default function LiveStreamGridSkeleton({ count = 8 }: LiveStreamGridSkeletonProps) {
  return (
    <div className={liveGridClassName} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <LiveStreamCardSkeleton key={index} />
      ))}
    </div>
  );
}
