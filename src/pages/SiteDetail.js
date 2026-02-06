import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Clock,
  Circle,
  AlertTriangle,
  Package,
  Wrench,
  Settings,
  FlaskConical,
  FileCheck2,
  ClipboardList,
} from 'lucide-react';
import {
  loadProjectData,
  getSites,
  getSiteProgress,
  getTasksByCategory,
} from '../data/csvLoader';
import ProgressBar from '../components/ProgressBar';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

const categoryIcons = {
  Planning: ClipboardList,
  Ordering: Package,
  Installation: Wrench,
  Configuration: Settings,
  Testing: FlaskConical,
  Handover: FileCheck2,
};

const categoryOrder = ['Planning', 'Ordering', 'Installation', 'Configuration', 'Testing', 'Handover'];

export default function SiteDetail() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProjectData().then((data) => {
      const sites = getSites(data);
      const found = sites.find((s) => s.id === siteId);
      setSite(found || null);
      setLoading(false);
    });
  }, [siteId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rc-300" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-12">
        <p className="text-shark-500">Site not found</p>
        <Link to="/sites" className="text-rc-500 text-sm mt-2 inline-block hover:text-rc-700">
          Back to sites
        </Link>
      </div>
    );
  }

  const progress = getSiteProgress(site.tasks);
  const byCategory = getTasksByCategory(site.tasks);
  const overdue = site.tasks.filter(
    (t) => t.Status !== 'Complete' && t.DueDate && new Date(t.DueDate) < new Date()
  );

  const filteredTasks =
    selectedCategory === 'all'
      ? site.tasks
      : site.tasks.filter((t) => t.Category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Back link + header */}
      <Link
        to="/sites"
        className="inline-flex items-center gap-1 text-sm text-shark-500 hover:text-rc-600"
      >
        <ArrowLeft size={16} />
        Back to all sites
      </Link>

      <div className="bg-white rounded-xl border border-shark-200 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-shark-800">{site.name}</h1>
            <div className="flex items-center gap-1 text-sm text-shark-400 mt-1">
              <MapPin size={14} />
              {site.address}
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-shark-800">{progress.percent}%</p>
            <p className="text-xs text-shark-400">Complete</p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar percent={progress.percent} size="lg" showLabel={false} />
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-5">
          <Stat icon={CheckCircle2} color="text-emerald-500" label="Complete" value={progress.complete} />
          <Stat icon={Clock} color="text-rc-500" label="In Progress" value={progress.inProgress} />
          <Stat icon={Circle} color="text-shark-400" label="Not Started" value={progress.notStarted} />
          {overdue.length > 0 && (
            <Stat icon={AlertTriangle} color="text-red-500" label="Overdue" value={overdue.length} />
          )}
        </div>
      </div>

      {/* Phase progress cards */}
      <div>
        <h2 className="text-sm font-semibold text-shark-600 uppercase tracking-wider mb-3">
          Progress by Phase
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryOrder.map((cat) => {
            const catTasks = byCategory[cat] || [];
            const complete = catTasks.filter((t) => t.Status === 'Complete').length;
            const total = catTasks.length;
            const pct = total > 0 ? Math.round((complete / total) * 100) : 0;
            const CatIcon = categoryIcons[cat] || ClipboardList;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                className={`bg-white rounded-xl border shadow-sm p-4 text-left transition-all ${
                  selectedCategory === cat
                    ? 'border-rc-300 ring-1 ring-rc-200'
                    : 'border-shark-200 hover:border-shark-300'
                }`}
              >
                <CatIcon size={18} className="text-shark-400 mb-2" />
                <p className="text-xs text-shark-500">{cat}</p>
                <p className="text-lg font-bold text-shark-800">{pct}%</p>
                <p className="text-xs text-shark-400">
                  {complete}/{total}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-shark-600 uppercase tracking-wider">
            {selectedCategory === 'all' ? 'All Tasks' : `${selectedCategory} Tasks`}
          </h2>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-rc-500 hover:text-rc-700"
            >
              Show all
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl border border-shark-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-shark-50 border-b border-shark-200">
                <th className="text-left text-xs font-semibold text-shark-500 uppercase px-4 py-3">
                  Task
                </th>
                <th className="text-left text-xs font-semibold text-shark-500 uppercase px-4 py-3 hidden md:table-cell">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-shark-500 uppercase px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-shark-500 uppercase px-4 py-3 hidden lg:table-cell">
                  Assigned
                </th>
                <th className="text-left text-xs font-semibold text-shark-500 uppercase px-4 py-3 hidden md:table-cell">
                  Due Date
                </th>
                <th className="text-left text-xs font-semibold text-shark-500 uppercase px-4 py-3 hidden lg:table-cell">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-shark-100">
              {filteredTasks.map((task) => {
                const isOverdue =
                  task.Status !== 'Complete' &&
                  task.DueDate &&
                  new Date(task.DueDate) < new Date();
                return (
                  <tr key={task.TaskID} className="hover:bg-shark-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-shark-700">
                        {task.TaskName}
                      </p>
                      <p className="text-xs text-shark-400 mt-0.5">
                        {task.Description}
                      </p>
                      {task.Notes && (
                        <p className="text-xs text-shark-300 mt-0.5 italic">
                          {task.Notes}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-shark-500">{task.Category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.Status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-shark-500">{task.AssignedTo}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`text-xs ${
                          isOverdue ? 'text-red-500 font-medium' : 'text-shark-500'
                        }`}
                      >
                        {task.DueDate}
                        {isOverdue && ' (overdue)'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <PriorityBadge priority={task.Priority} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, color, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={16} className={color} />
      <span className="text-sm text-shark-500">{label}:</span>
      <span className="text-sm font-bold text-shark-700">{value}</span>
    </div>
  );
}
