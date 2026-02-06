import React, { useEffect, useState } from 'react';
import { loadProjectData, getSites } from '../data/csvLoader';
import SiteCard from '../components/SiteCard';

export default function SitesList() {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rc-300" />
      </div>
    );
  }

  const sites = getSites(tasks);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-shark-800">All Sites</h1>
        <p className="text-shark-500 text-sm mt-1">
          Click a site to view detailed progress and tasks
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  );
}
