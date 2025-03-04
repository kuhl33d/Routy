import { useQuery } from 'react-query';
import { api } from '../services/api';
import TransportationOverview from '../components/dashboard/TransportationOverview';
import ActiveBuses from '../components/dashboard/ActiveBuses';
import RouteMap from '../components/routes/RouteMap';
import RecentAlerts from '../components/dashboard/RecentAlerts';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery('dashboardStats', 
    () => api.get('/admin/dashboard-stats')
  );

  const { data: activeBuses, isLoading: busesLoading } = useQuery('activeBuses',
    () => api.get('/buses/active')
  );

  if (statsLoading || busesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <TransportationOverview stats={stats?.data} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActiveBuses buses={activeBuses?.data} />
        <RouteMap />
      </div>
      
      <RecentAlerts />
    </div>
  );
}
