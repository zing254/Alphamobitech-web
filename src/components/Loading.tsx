import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <Loader2 className={`animate-spin text-amber-500 ${className}`} size={size} />
);

export const PageLoader = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-amber-100 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={32} />
        </div>
      </div>
      <p className="text-slate-600 font-medium">Loading...</p>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-6 shadow-md animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 bg-slate-200 rounded-2xl"></div>
      <div className="flex-1">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
  </div>
);

export const SkeletonText = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {[...Array(lines)].map((_, i) => (
      <div 
        key={i} 
        className="h-4 bg-slate-200 rounded animate-pulse"
        style={{ width: i === lines - 1 ? '60%' : '100%' }}
      ></div>
    ))}
  </div>
);

export const SkeletonButton = () => (
  <div className="h-12 bg-slate-200 rounded-xl animate-pulse w-32"></div>
);

export const SkeletonAvatar = ({ size = 48 }: { size?: number }) => (
  <div 
    className="bg-slate-200 rounded-full animate-pulse" 
    style={{ width: size, height: size }}
  ></div>
);
