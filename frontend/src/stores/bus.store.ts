import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

interface Bus {
  _id: string;
  busNumber: string;
  driverId: string;
  routeId: string;
  capacity: number;
  currentPassengers: number;
  currentLocation: { latitude: number; longitude: number };
  schoolId?: string;
}

interface BusStore {
  buses: Bus[];
  currentBus: Bus | null;
  loading: boolean;
  error: string | null;
  withLoading: (fn: () => Promise<void>) => Promise<void>;
  // createBus: (busData: Omit<Bus, "_id">) => Promise<void>;
  createBus: (busData: Partial<Bus>) => Promise<void>;

  getAllBuses: () => Promise<void>;
  getBusById: (id: string) => Promise<void>;
  updateBus: (id: string, updateData: Partial<Bus>) => Promise<void>;
  deleteBus: (id: string) => Promise<void>;
  updateBusLocation: (
    id: string,
    location: { latitude: number; longitude: number }
  ) => Promise<void>;
}

export const useBusStore = create<BusStore>((set, get) => ({
  buses: [],
  currentBus: null,
  loading: false,
  error: null,

  withLoading: async (fn) => {
    set({ loading: true });
    try {
      await fn();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  createBus: async (busData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/buses", busData);
      set((state) => ({ buses: [...state.buses, data], loading: false }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  getAllBuses: async () => {
    await get().withLoading(async () => {
      const res = await axiosInstance.get<{ data: Bus[] }>("/bus");
      set({ buses: res.data.data });
    });
  },

  getBusById: async (id) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.get<Bus>(`/bus/${id}`);
      set({ currentBus: res.data });
    });
  },

  updateBus: async (id, updateData) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.put<Bus>(`/bus/${id}`, updateData);
      set((state) => ({
        buses: state.buses.map((bus) => (bus._id === id ? res.data : bus)),
      }));
      toast.success("Bus updated successfully");
    });
  },

  // deleteBus: async (id) => {
  //   await get().withLoading(async () => {
  //     await axiosInstance.delete(`/buses/${id}`);
  //     set((state) => ({
  //       buses: state.buses.filter((bus) => bus._id !== id),
  //     }));
  //     toast.success("Bus deleted successfully");
  //   });
  // },
  deleteBus: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/buses/${id}`);
      set((state) => ({
        buses: state.buses.filter((bus) => bus._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  updateBusLocation: async (id, location) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.put<Bus>(`/bus/${id}/location`, location);
      set((state) => ({
        buses: state.buses.map((bus) => (bus._id === id ? res.data : bus)),
      }));
      toast.success("Bus location updated successfully");
    });
  },
}));

// Axios interceptor for token refresh (if needed)
let refreshPromise: Promise<void> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axiosInstance(originalRequest);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
