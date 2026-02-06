import React from 'react';

const statusStyles = {
  Complete: 'bg-emerald-100 text-emerald-700',
  'In Progress': 'bg-rc-100 text-rc-700',
  'Not Started': 'bg-shark-100 text-shark-600',
};

const priorityStyles = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-shark-100 text-shark-600',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || 'bg-shark-100 text-shark-600'
      }`}
    >
      {status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        priorityStyles[priority] || 'bg-shark-100 text-shark-600'
      }`}
    >
      {priority}
    </span>
  );
}
