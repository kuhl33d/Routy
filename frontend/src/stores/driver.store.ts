import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Driver, CreateDriverDTO, Route, Student } from "@/types/driver.types";
import { Bus } from "@/types/admin.types";

interface DriverStore {
  drivers: Driver[];
  currentDriver: Driver | null;
  loading: boolean;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
  createDriver: (data: CreateDriverDTO) => Promise<void>;
  getAllDrivers: (params?: { page?: number; limit?: number }) => Promise<{ data: Driver[]; total: number; page: number; limit: number }>;
  getDriverById: (id: string, state?: 'user' | undefined) => Promise<void>;
  updateDriver: (id: string, updateData: Partial<CreateDriverDTO> & { isActive?: boolean }) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  getCurrentRoute: (id: string) => Promise<Route>;
  startRoute: (id: string) => Promise<Bus>;
  endRoute: (id: string) => Promise<Bus>;
  updateLocation: (id: string, coords: { latitude: number; longitude: number }) => Promise<{ latitude: number; longitude: number }>;
  getAssignedStudents: (id: string) => Promise<Student[]>;
  updateStudentStatus: (driverId: string, studentId: string, status: 'picked_up' | 'dropped_off') => Promise<void>;
  markStopCompleted: (driverId: string, stopId: string) => Promise<void>;
}

export const useDriverStore = create<DriverStore>((set, get) => ({
  drivers: [],
  currentDriver: null,
  loading: false,

  // Helper wrapper for operations that should toast on error/success
  withLoading: async <T>(fn: () => Promise<T>): Promise<T> => {
    set({ loading: true });
    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  // Create a new driver (creates both user and driver)
  createDriver: async (data: CreateDriverDTO) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.post<{
        success: boolean;
        data: Driver;
      }>("/admin/drivers", data);

      // append newly created driver
      set((s) => ({ drivers: [...s.drivers, res.data.data] }));
      toast.success("Driver created successfully");
    });
  },

  // List all drivers (always returns 200 with empty array)
  getAllDrivers: async ({ page, limit } = {}) => {
    set({ loading: true });
    try {
      const params: Record<string, any> = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;

      const res = await axiosInstance.get<{
        success: boolean;
        data: Driver[];
        total: number;
        page: number;
        limit: number;
      }>("/drivers", { params });

      set({ drivers: res.data.data });
      return res.data;
    } catch (err) {
      console.warn('Failed fetching drivers:', err);
      return { data: [], total: 0, page: page || 1, limit: limit || 10 };
    } finally {
      set({ loading: false });
    }
  },

  // Fetch single driver by id or by user id
  getDriverById: async (id, state) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.get<Driver>(`/admin/drivers/${id}`, {
        params: { state }
      });
      set({ currentDriver: res.data });
    });
  },

  // Update driver details and/or isActive
  updateDriver: async (id, updateData) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.put<Driver>(`/admin/drivers/${id}`, updateData);
      set((s) => ({
        drivers: s.drivers.map((d) => d._id === id ? res.data : d)
      }));
      toast.success('Driver updated successfully');
    });
  },

  // Delete a driver
  deleteDriver: async (id) => {
    await get().withLoading(async () => {
      await axiosInstance.delete(`/admin/drivers/${id}`);
      set((s) => ({ drivers: s.drivers.filter((d) => d._id !== id) }));
      toast.success('Driver deleted successfully');
    });
  },

  // Route & location & student endpoints
  getCurrentRoute: async (id) =>
    get().withLoading(async () => {
      const res = await axiosInstance.get<Route>(`/admin/drivers/${id}/current-route`);
      return res.data;
    }),

  startRoute: async (id) =>
    get().withLoading(async () => {
      const res = await axiosInstance.post<{ message: string; bus: Bus }>(`/admin/drivers/${id}/start-route`);
      toast.success('Route started successfully');
      return res.data.bus;
    }),

  endRoute: async (id) =>
    get().withLoading(async () => {
      const res = await axiosInstance.post<{ message: string; bus: Bus }>(`/admin/drivers/${id}/end-route`);
      toast.success('Route ended successfully');
      return res.data.bus;
    }),

  updateLocation: async (id, coords) =>
    get().withLoading(async () => {
      const res = await axiosInstance.post<{ message: string; location: { latitude: number; longitude: number } }>(
        `/admin/drivers/${id}/update-location`, coords
      );
      toast.success('Location updated successfully');
      return res.data.location;
    }),

  getAssignedStudents: async (id) =>
    get().withLoading(async () => {
      const res = await axiosInstance.get<Student[]>(`/admin/drivers/${id}/students`);
      return res.data;
    }),

  updateStudentStatus: async (driverId, studentId, status) =>
    get().withLoading(async () => {
      await axiosInstance.post(`/admin/drivers/${driverId}/students/${studentId}/status`, { status });
      toast.success(`Student marked as ${status}`);
    }),

  markStopCompleted: async (driverId, stopId) =>
    get().withLoading(async () => {
      await axiosInstance.post(`/admin/drivers/${driverId}/stops/${stopId}/complete`);
      toast.success('Stop marked as completed');
    }),
}));