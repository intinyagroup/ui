import * as React from 'react';
import { cn } from '../utils.js';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse rounded-[var(--ui-radius)] bg-[var(--ui-muted)]', className)}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';
