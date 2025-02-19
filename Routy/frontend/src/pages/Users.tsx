import React from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';

interface User {
  email: string;
  lastLogin: string;
  actions: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: () => (
      <button className="text-blue-600 hover:text-blue-800">
        Suspend
      </button>
    ),
  },
];

const data: User[] = [
  {
    email: 'admin@school.org',
    lastLogin: '2 days ago',
    actions: '',
  },
  {
    email: 'staff@school.org',
    lastLogin: '3 hours ago',
    actions: '',
  },
  {
    email: 'manager@school.org',
    lastLogin: '1 day ago',
    actions: '',
  },
  {
    email: 'driver@school.org',
    lastLogin: '5 days ago',
    actions: '',
  },
];

export function Users() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New Admin
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by email"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}