import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'teal' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    teal: 'bg-rc-50 text-rc-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    slate: 'bg-shark-50 text-shark-600',
  };

  return (
    <div className="bg-white rounded-xl border border-shark-200 p-5 flex items-start gap-4 shadow-sm">
      {Icon && (
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-sm text-shark-500">{title}</p>
        <p className="text-2xl font-bold text-shark-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-shark-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
