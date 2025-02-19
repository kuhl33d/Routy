
// src/components/reports/ReportGenerator.jsx
import { DocumentReportIcon } from '@heroicons/react/outline';

export default function ReportGenerator() {
  const reportTypes = [
    { id: 1, name: 'Bus Activity', description: 'Last 30 days' },
    { id: 2, name: 'Late Arrivals', description: 'Last 30 days' },
    { id: 3, name: 'Emergency Alerts', description: 'Last 30 days' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Reports</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {reportTypes.map((report) => (
            <li key={report.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DocumentReportIcon className="h-6 w-6 text-gray-400" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Generate
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}