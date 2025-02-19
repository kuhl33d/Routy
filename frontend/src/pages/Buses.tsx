import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Bus } from '../types';
import BusList from '../components/buses/BusList';
import BusForm from '../components/buses/BusForm';
import Modal from '../components/shared/Modal';
import toast from 'react-hot-toast';

export default function Buses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const queryClient = useQueryClient();

  const { data: buses, isLoading } = useQuery('buses', 
    () => api.get('/buses')
  );

  const createBusMutation = useMutation(
    (newBus: Partial<Bus>) => api.post('/buses', newBus),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('buses');
        setIsModalOpen(false);
        toast.success('Bus created successfully');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to create bus');
      },
    }
  );

  const updateBusMutation = useMutation(
    (updatedBus: Partial<Bus>) => 
      api.put(`/buses/${updatedBus.id}`, updatedBus),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('buses');
        setIsModalOpen(false);
        toast.success('Bus updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update bus');
      },
    }
  );

  const handleSubmit = (busData: Partial<Bus>) => {
    if (selectedBus) {
      updateBusMutation.mutate({ ...busData, id: selectedBus.id });
    } else {
      createBusMutation.mutate(busData);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Buses</h1>
        <button
          onClick={() => {
            setSelectedBus(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Bus
        </button>
      </div>

      <BusList
        buses={buses?.data}
        onEdit={(bus) => {
          setSelectedBus(bus);
          setIsModalOpen(true);
        }}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBus ? 'Edit Bus' : 'Add New Bus'}
      >
        <BusForm
          initialData={selectedBus}
          onSubmit={handleSubmit}
          isLoading={createBusMutation.isLoading || updateBusMutation.isLoading}
        />
      </Modal>
    </div>
  );
}