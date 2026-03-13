import React from 'react';
import VenueCardSkeleton from './VenueCardSkeleton';

interface VenueGridSkeletonProps {
  count?: number;
}

export default function VenueGridSkeleton({ count = 8 }: VenueGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <VenueCardSkeleton key={index} />
      ))}
    </div>
  );
}
