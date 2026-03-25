export function SkeletonCard({ variant = 'default' }) {
  if (variant === 'layout') {
    return (
      <div className="bg-bg-primary rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
        <div className="p-6">
          <div className="h-3 w-16 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className="glass-card-dark p-6">
        <div className="h-10 w-10 bg-gray-700 rounded-lg mb-4 animate-pulse" />
        <div className="h-8 w-16 bg-gray-700 rounded mb-2 animate-pulse" />
        <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="h-4 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="h-6 w-48 bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export default SkeletonCard;
