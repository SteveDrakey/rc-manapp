import React, { useEffect, useState } from 'react';
import { loadProjectData } from '../data/csvLoader';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Search, Download } from 'lucide-react';

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [siteFilter, setSiteFilter] = useState('all');

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

  const sites = [...new Set(tasks.map((t) => t.SiteName))];
  const categories = [...new Set(tasks.map((t) => t.Category))];
  const statuses = [...new Set(tasks.map((t) => t.Status))];

  const filtered = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.Status !== statusFilter) return false;
    if (categoryFilter !== 'all' && t.Category !== categoryFilter) return false;
    if (siteFilter !== 'all' && t.SiteName !== siteFilter) return false;
    if (
      search &&
      !t.TaskName.toLowerCase().includes(search.toLowerCase()) &&
      !t.Description.toLowerCase().includes(search.toLowerCase()) &&
      !t.AssignedTo.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['TaskID', 'Site', 'Category', 'Task', 'Status', 'Priority', 'Assigned To', 'Due Date', 'Notes'];
    const rows = filtered.map((t) => [
      t.TaskID, t.SiteName, t.Category, t.TaskName, t.Status, t.Priority, t.AssignedTo, t.DueDate, t.Notes,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pizza-express-tasks.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">
            {filtered.length} of {tasks.length} tasks
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 shadow-sm"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, descriptions, assignees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <option value="all">All Sites</option>
            {sites.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">ID</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Task</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden md:table-cell">Site</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden md:table-cell">Category</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden lg:table-cell">Assigned</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden md:table-cell">Due</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3 hidden lg:table-cell">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((task) => {
                const isOverdue =
                  task.Status !== 'Complete' &&
                  task.DueDate &&
                  new Date(task.DueDate) < new Date();
                return (
                  <tr key={task.TaskID} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono">
                      {task.TaskID}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-700">{task.TaskName}</p>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">
                        {task.Description}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-500">{task.SiteName?.replace('Pizza Express ', '')}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-slate-500">{task.Category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={task.Status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{task.AssignedTo}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={`text-xs ${
                          isOverdue ? 'text-red-500 font-medium' : 'text-slate-500'
                        }`}
                      >
                        {task.DueDate}
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
        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-slate-400">
            No tasks match your filters
          </div>
        )}
      </div>
    </div>
  );
}
