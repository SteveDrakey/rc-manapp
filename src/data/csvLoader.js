import Papa from 'papaparse';
import csvFile from './projectPlan.csv';

let cachedData = null;

export async function loadProjectData() {
  if (cachedData) return cachedData;

  const response = await fetch(csvFile);
  const csvText = await response.text();

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  cachedData = parsed.data.map((row) => ({
    ...row,
    Status: row.Status?.trim(),
    Category: row.Category?.trim(),
    Priority: row.Priority?.trim(),
  }));

  return cachedData;
}

export function getSites(tasks) {
  const siteMap = new Map();
  tasks.forEach((t) => {
    if (!siteMap.has(t.SiteID)) {
      siteMap.set(t.SiteID, {
        id: t.SiteID,
        name: t.SiteName,
        address: t.SiteAddress,
        tasks: [],
      });
    }
    siteMap.get(t.SiteID).tasks.push(t);
  });
  return Array.from(siteMap.values());
}

export function getSiteProgress(siteTasks) {
  const total = siteTasks.length;
  const complete = siteTasks.filter((t) => t.Status === 'Complete').length;
  const inProgress = siteTasks.filter((t) => t.Status === 'In Progress').length;
  const notStarted = siteTasks.filter((t) => t.Status === 'Not Started').length;
  return {
    total,
    complete,
    inProgress,
    notStarted,
    percent: total > 0 ? Math.round((complete / total) * 100) : 0,
  };
}

export function getOverallProgress(tasks) {
  return getSiteProgress(tasks);
}

export function getCategories(tasks) {
  const cats = [...new Set(tasks.map((t) => t.Category))];
  return cats;
}

export function getSiteStatus(progress) {
  if (progress.percent === 100) return 'Complete';
  if (progress.inProgress > 0 || progress.complete > 0) return 'In Progress';
  return 'Not Started';
}

export function getTasksByCategory(tasks) {
  const map = {};
  tasks.forEach((t) => {
    if (!map[t.Category]) map[t.Category] = [];
    map[t.Category].push(t);
  });
  return map;
}

export function getUpcomingDeadlines(tasks, count = 5) {
  return tasks
    .filter((t) => t.Status !== 'Complete' && t.DueDate)
    .sort((a, b) => new Date(a.DueDate) - new Date(b.DueDate))
    .slice(0, count);
}

export function getOverdueTasks(tasks) {
  const now = new Date();
  return tasks.filter(
    (t) => t.Status !== 'Complete' && t.DueDate && new Date(t.DueDate) < now
  );
}
