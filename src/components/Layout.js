import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  ClipboardList,
  User,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/sites', label: 'Sites', icon: Building2 },
  { path: '/tasks', label: 'All Tasks', icon: ClipboardList },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        {/* Logo / Brand */}
        <div className="p-5 border-b border-slate-700">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-orange-400">Pizza Express</span>
            <br />
            <span className="text-sm font-normal text-slate-400">
              IT Rollout Programme
            </span>
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-orange-400 border-r-2 border-orange-400'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-semibold">
              JS
            </div>
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-slate-400">Project Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <Breadcrumbs />
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Logged in as</span>
            <div className="flex items-center gap-2">
              <User size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                John Smith
              </span>
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return <h2 className="text-lg font-semibold text-slate-800">Dashboard</h2>;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link to="/" className="text-slate-500 hover:text-slate-700">
        Dashboard
      </Link>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={14} className="text-slate-400" />
          <span className="text-slate-700 font-medium capitalize">
            {decodeURIComponent(seg).replace(/-/g, ' ')}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
