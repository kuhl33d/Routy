
import { ClockIcon, LocationMarkerIcon, UserGroupIcon } from '@heroicons/react/outline';

export default function RouteDetails() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Morning Routes</h3>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <ClockIcon className="h-5 w-5" />
            <span>7:00 AM - Start Route</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <ClockIcon className="h-5 w-5" />
            <span>8:00 AM - Drop off students</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-500">
            <ClockIcon className="h-5 w-5" />
            <span>9:00 AM - Return to school</span>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <LocationMarkerIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">10 Stops</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">12 Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}