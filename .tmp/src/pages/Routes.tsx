import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { api } from '../services/api';
import { Route } from '../types';
import RouteList from '../components/routes/RouteList';
import RouteForm from '../components/routes/RouteForm';
import RouteMap from '../components/routes/RouteMap';
import Modal from '../components/shared/Modal';
import toast from 'react-hot-toast';

export default function Routes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const queryClient = useQueryClient();

  const { data: routes, isLoading } = useQuery('routes', 
    () => api.get('/routes')
  );

  const createRouteMutation = useMutation(
    (newRoute: Partial<Route>) => api.post('/routes', newRoute),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('routes');
        setIsModalOpen(false);
        toast.success('Route created successfully');
      },
    }
  );

  const updateRouteMutation = useMutation(
    (updatedRoute: Partial<Route>) => 
      api.put(`/routes/${updatedRoute.id}`, updatedRoute),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('routes');
        setIsModalOpen(false);
        toast.success('Route updated successfully');
      },
    }
  );

  const handleSubmit = (routeData: Partial<Route>) => {
    if (selectedRoute) {
      updateRouteMutation.mutate({ ...routeData, id: selectedRoute.id });
    } else {
      createRouteMutation.mutate(routeData);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Routes</h1>
        <button
          onClick={() => {
            setSelectedRoute(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Route
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RouteList
          routes={routes?.data}
          onEdit={(route) => {
            setSelectedRoute(route);
            setIsModalOpen(true);
          }}
        />
        <RouteMap selectedRoute={selectedRoute} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRoute ? 'Edit Route' : 'Add New Route'}
      >
        <RouteForm
          initialData={selectedRoute}
          onSubmit={handleSubmit}
          isLoading={createRouteMutation.isLoading || updateRouteMutation.isLoading}
        />
      </Modal>
    </div>
  );
}