import { UserCircleIcon } from '@heroicons/react/solid';

export default function StudentList() {
  const students = [
    { id: 1, name: 'Ava Smith', route: 'Route 1', status: 'On Bus' },
    { id: 2, name: 'Mia Johnson', route: 'Route 1', status: 'At School' },
    { id: 3, name: 'Ethan Davis', route: 'Route 2', status: 'At Home' },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Students</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
          Add Student
        </button>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {students.map((student) => (
            <li key={student.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {student.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {student.route}
                  </p>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    student.status === 'On Bus' 
                      ? 'bg-green-100 text-green-800'
                      : student.status === 'At School'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
