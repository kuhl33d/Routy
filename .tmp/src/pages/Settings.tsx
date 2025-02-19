import { useQuery, useMutation } from 'react-query';
import { api } from '../services/api';
import SettingsForm from '../components/settings/SettingsForm';
import toast from 'react-hot-toast';

export default function Settings() {
  const { data: settings, isLoading } = useQuery('settings', 
    () => api.get('/settings')
  );

  const updateSettingsMutation = useMutation(
    (newSettings: any) => api.put('/settings', newSettings),
    {
      onSuccess: () => {
        toast.success('Settings updated successfully');
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your school transportation system settings
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <SettingsForm
            initialData={settings?.data}
            onSubmit={updateSettingsMutation.mutate}
            isLoading={updateSettingsMutation.isLoading}
          />
        </div>
      </div>
    </div>
  );
}