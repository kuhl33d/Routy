import { MapIcon, UserGroupIcon, TruckIcon } from '@heroicons/react/outline';

export default function TransportationOverview() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-lg">
            <TruckIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Buses</p>
            <p className="text-xl font-semibold">2</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <MapIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Routes</p>
            <p className="text-xl font-semibold">2</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-xl font-semibold">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}