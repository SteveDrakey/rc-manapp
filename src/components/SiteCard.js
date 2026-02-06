import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, CheckCircle2, Clock, Circle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { getSiteProgress, getSiteStatus } from '../data/csvLoader';

export default function SiteCard({ site }) {
  const progress = getSiteProgress(site.tasks);
  const status = getSiteStatus(progress);

  const statusColor = {
    Complete: 'border-emerald-400',
    'In Progress': 'border-blue-400',
    'Not Started': 'border-slate-300',
  };

  return (
    <Link
      to={`/sites/${site.id}`}
      className={`block bg-white rounded-xl border-l-4 ${statusColor[status]} border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-800">{site.name}</h3>
          <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
            <MapPin size={12} />
            {site.address}
          </div>
        </div>
        <ArrowRight size={18} className="text-slate-400" />
      </div>

      <ProgressBar percent={progress.percent} size="sm" />

      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 size={12} className="text-emerald-500" />
          {progress.complete} done
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} className="text-blue-500" />
          {progress.inProgress} active
        </span>
        <span className="flex items-center gap-1">
          <Circle size={12} className="text-slate-400" />
          {progress.notStarted} pending
        </span>
      </div>
    </Link>
  );
}
