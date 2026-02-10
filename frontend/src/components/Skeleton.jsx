import React from 'react';
import { cn } from '../lib/utils';

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-shimmer bg-charcoal-light/30 rounded", className)}
      {...props}
    />
  );
};

export const SkeletonCard = () => {
  return (
    <div className="glass-card rounded-card-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
};

export const SkeletonDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <SkeletonCard />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

export default Skeleton;

