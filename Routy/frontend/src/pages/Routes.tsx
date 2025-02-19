import React from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';

interface Route {
  id: string;
  name: string;
  school: string;
  driver: string;
  students: number;
  status: 'Active' | 'Inactive';
}

const columns: ColumnDef<Route>[] = [
  {
    accessorKey: 'name',
    header: 'Route Name',
  },
  {
    accessorKey: 'school',
    header: 'School',
  },
  {
    accessorKey: 'driver',
    header: 'Driver',
  },
  {
    accessorKey: 'students',
    header: 'Students',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          row.original.status === 'Active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex gap-2">
        <button className="text-blue-600 hover:text-blue-800">Edit</button>
        <button className="text-red-600 hover:text-red-800">Delete</button>
      </div>
    ),
  },
];

const data: Route[] = [
  {
    id: '1',
    name: 'Morning Route A',
    school: "Bishop's School",
    driver: 'John Smith',
    students: 25,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Afternoon Route B',
    school: 'La Jolla Country Day',
    driver: 'Sarah Johnson',
    students: 18,
    status: 'Active',
  },
  {
    id: '3',
    name: 'Special Events',
    school: 'Francis Parker',
    driver: 'Mike Wilson',
    students: 30,
    status: 'Inactive',
  },
];

export function Routes() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Routes</h1>
        <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add new route
        </button>
      </div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search routes"
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}