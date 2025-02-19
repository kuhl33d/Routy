import React from 'react';
import { Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Sidebar } from '../components/Sidebar';
import  Header  from '../components/Header';

interface School {
  name: string;
  city: string;
  state: string;
  country: string;
  status: 'Active' | 'Pending';
}

const columns: ColumnDef<School>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          row.original.status === 'Active'
            ? 'bg-green-100 text-green-800'
            : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Action',
    cell: () => (
      <button className="text-blue-600 hover:text-blue-800">
        Approve/Reject
      </button>
    ),
  },
];

const data: School[] = [
  {
    name: "Bishop's School",
    city: 'La Jolla',
    state: 'CA',
    country: 'USA',
    status: 'Active',
  },
  {
    name: 'La Jolla Country Day School',
    city: 'La Jolla',
    state: 'CA',
    country: 'USA',
    status: 'Pending',
  },
  {
    name: 'Francis Parker School',
    city: 'La Jolla',
    state: 'CA',
    country: 'USA',
    status: 'Active',
  },
  {
    name: 'The Gillispie School',
    city: 'La Jolla',
    state: 'CA',
    country: 'USA',
    status: 'Active',
  },
];

export function Schools() {
  return (
    <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
                <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900">Schools</h1>
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Add a school
                    </button>
                </div>
                <div className="mb-6">
                    <input
                    type="text"
                    placeholder="Search schools"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <DataTable columns={columns} data={data} />
                </div>
            </main>
        </div>
    </div>
  );
}