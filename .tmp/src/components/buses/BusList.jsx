import { PencilIcon } from '@heroicons/react/solid';

export default function BusList() {
  const buses = [
    {
      id: 1,
      number: 'Bus 1',
      route: 'Route 1',
      driver: 'John Smith',
    },
    {
      id: 2,
      number: 'Bus 2',
      route: 'Route 2',
      driver: 'Jane Doe',
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Buses</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          New Bus
        </button>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {buses.map((bus) => (
            <li key={bus.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TruckIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {bus.number}
                    </div>
                    <div className="text-sm text-gray-500">
                      Route: {bus.route}
                    </div>
                    <div className="text-sm text-gray-500">
                      Driver: {bus.driver}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}