import React from 'react';

export default function ProgressBar({ percent, size = 'md', showLabel = true }) {
  const heightMap = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const barColor =
    percent === 100
      ? 'bg-emerald-500'
      : percent >= 50
      ? 'bg-blue-500'
      : percent > 0
      ? 'bg-orange-500'
      : 'bg-slate-300';

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${heightMap[size]}`}>
        <div
          className={`${barColor} ${heightMap[size]} rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-semibold text-slate-600 min-w-[40px] text-right">
          {percent}%
        </span>
      )}
    </div>
  );
}
