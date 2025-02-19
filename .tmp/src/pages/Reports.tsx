import { useState } from 'react';
import { useQuery } from 'react-query';
import { api } from '../services/api';
import DateRangePicker from '../components/shared/DateRangePicker';
import ReportCard from '../components/reports/ReportCard';
import { DownloadIcon } from '@heroicons/react/outline';

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  const { data: reports, isLoading } = useQuery(
    ['reports', dateRange],
    () => api.get('/reports', { 
      params: {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      }
    })
  );

  const reportTypes = [
    {
      id: 'bus-activity',
      title: 'Bus Activity',
      description: 'Daily bus routes and student attendance',
      icon: 'chart-bar'
    },
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'Student pickup and drop-off records',
      icon: 'user-group'
    },
    {
      id: 'incidents',
      title: 'Incident Reports',
      description: 'Safety and emergency incidents',
      icon: 'exclamation'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-2 text-sm text-gray-600">
          Generate and download detailed reports for your school transportation system
        </p>
      </div>

      <div className="mb-6">
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={setDateRange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <ReportCard
            key={report.id}
            title={report.title}
            description={report.description}
            icon={report.icon}
            onGenerate={() => {
              // Handle report generation
              toast.promise(
                api.get(`/reports/${report.id}`, {
                  params: {
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate
                  },
                  responseType: 'blob'
                }).then(response => {
                  const url = window.URL.createObjectURL(new Blob([response.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', `${report.id}-report.pdf`);
                  document.body.appendChild(link);
                  link.click();
                }),
                {
                  loading: 'Generating report...',
                  success: 'Report generated successfully!',
                  error: 'Failed to generate report'
                }
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}