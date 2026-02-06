import React, { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import {
  loadProjectData,
  getSites,
  getOverallProgress,
  getUpcomingDeadlines,
  getOverdueTasks,
} from '../data/csvLoader';
import KpiCard from '../components/KpiCard';
import SiteCard from '../components/SiteCard';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  const sites = getSites(tasks);
  const overall = getOverallProgress(tasks);
  const upcoming = getUpcomingDeadlines(tasks, 6);
  const overdue = getOverdueTasks(tasks);
  const sitesComplete = sites.filter(
    (s) => s.tasks.every((t) => t.Status === 'Complete')
  ).length;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Project Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pizza Express New Site IT Rollout — 5 locations
        </p>
      </div>

      {/* Overall progress */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Overall Programme Progress
          </h2>
          <span className="text-2xl font-bold text-slate-800">
            {overall.percent}%
          </span>
        </div>
        <ProgressBar percent={overall.percent} size="lg" showLabel={false} />
        <p className="text-xs text-slate-400 mt-2">
          {overall.complete} of {overall.total} tasks complete across all sites
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Sites"
          value={sites.length}
          subtitle={`${sitesComplete} complete`}
          icon={Building2}
          color="blue"
        />
        <KpiCard
          title="Tasks Complete"
          value={overall.complete}
          subtitle={`of ${overall.total} total`}
          icon={CheckCircle2}
          color="green"
        />
        <KpiCard
          title="In Progress"
          value={overall.inProgress}
          subtitle="Active tasks"
          icon={Clock}
          color="orange"
        />
        <KpiCard
          title="Overdue"
          value={overdue.length}
          subtitle={overdue.length > 0 ? 'Needs attention' : 'All on track'}
          icon={AlertTriangle}
          color={overdue.length > 0 ? 'red' : 'green'}
        />
      </div>

      {/* Sites grid + Upcoming deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sites */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
            Site Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div>
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-3">
            Upcoming Deadlines
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {upcoming.length === 0 ? (
              <div className="p-4 text-sm text-slate-400 text-center">
                No upcoming deadlines
              </div>
            ) : (
              upcoming.map((task) => {
                const isOverdue = new Date(task.DueDate) < new Date();
                return (
                  <div key={task.TaskID} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {task.TaskName}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {task.SiteName}
                        </p>
                      </div>
                      <StatusBadge status={task.Status} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-xs ${
                          isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'
                        }`}
                      >
                        {isOverdue ? 'Overdue: ' : 'Due: '}
                        {task.DueDate}
                      </span>
                      <PriorityBadge priority={task.Priority} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4">
          Progress by Phase
        </h2>
        <CategoryBreakdown tasks={tasks} />
      </div>
    </div>
  );
}

function CategoryBreakdown({ tasks }) {
  const categories = ['Planning', 'Ordering', 'Installation', 'Configuration', 'Testing', 'Handover'];

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const catTasks = tasks.filter((t) => t.Category === cat);
        const complete = catTasks.filter((t) => t.Status === 'Complete').length;
        const total = catTasks.length;
        const pct = total > 0 ? Math.round((complete / total) * 100) : 0;

        return (
          <div key={cat} className="flex items-center gap-2 sm:gap-4">
            <span className="text-xs sm:text-sm text-slate-600 w-20 sm:w-28 flex-shrink-0">{cat}</span>
            <div className="flex-1 min-w-0">
              <ProgressBar percent={pct} size="sm" showLabel={false} />
            </div>
            <span className="text-xs text-slate-500 w-16 sm:w-24 text-right flex-shrink-0">
              {complete}/{total}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 w-10 sm:w-12 text-right flex-shrink-0">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
