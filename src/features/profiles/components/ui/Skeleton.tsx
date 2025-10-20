import React from 'react';
import { cn } from '../../../../lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-skeleton-1",
        className
      )}
    >
      {children}
    </div>
  );
};

// ProfileCard용 스켈레톤 (저장된 MCP)
export const ProfileCardSkeleton: React.FC = () => {
  return (
    <article className="bg-surface-6 rounded-xl p-6 border border-border/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      
      <div className="flex justify-end">
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </article>
  );
};

// DeployedCard용 스켈레톤 (배포된 MCP)
export const DeployedCardSkeleton: React.FC = () => {
  return (
    <article className="bg-surface-6 rounded-xl p-6 border border-border/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
      
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </article>
  );
};

// DraftCard용 스켈레톤 (임시저장 MCP)
export const DraftCardSkeleton: React.FC = () => {
  return (
    <article className="bg-surface-6 rounded-xl p-6 border border-border/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
      
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </article>
  );
};

// 그리드용 스켈레톤 (저장된 MCP)
export const ProfileGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProfileCardSkeleton key={index} />
      ))}
    </div>
  );
};

// 그리드용 스켈레톤 (배포된 MCP)
export const DeployedGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <DeployedCardSkeleton key={index} />
      ))}
    </div>
  );
};

// 그리드용 스켈레톤 (임시저장 MCP)
export const DraftGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <DraftCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default Skeleton;
