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
      <aside className="w-64 bg-shark-900 text-white flex flex-col flex-shrink-0">
        {/* Logo / Brand */}
        <div className="p-5 border-b border-shark-700">
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-rc-300">Redcentric</span>
            <br />
            <span className="text-sm font-normal text-shark-400">
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
                    ? 'bg-shark-800 text-rc-300 border-r-2 border-rc-300'
                    : 'text-shark-300 hover:bg-shark-800 hover:text-white'
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
        <div className="p-4 border-t border-shark-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rc-300 flex items-center justify-center text-shark-900 text-sm font-semibold">
              JS
            </div>
            <div>
              <p className="text-sm font-medium">John Smith</p>
              <p className="text-xs text-shark-400">Project Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-shark-200 px-6 py-4 flex items-center justify-between">
          <Breadcrumbs />
          <div className="flex items-center gap-3">
            <span className="text-xs text-shark-400">Logged in as</span>
            <div className="flex items-center gap-2">
              <User size={16} className="text-shark-500" />
              <span className="text-sm font-medium text-shark-700">
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
    return <h2 className="text-lg font-semibold text-shark-800">Dashboard</h2>;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link to="/" className="text-shark-500 hover:text-rc-600">
        Dashboard
      </Link>
      {segments.map((seg, i) => (
        <React.Fragment key={i}>
          <ChevronRight size={14} className="text-shark-400" />
          <span className="text-shark-700 font-medium capitalize">
            {decodeURIComponent(seg).replace(/-/g, ' ')}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
