import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, color = 'blue' }) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    slate: 'bg-slate-50 text-slate-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4 shadow-sm">
      {Icon && (
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
