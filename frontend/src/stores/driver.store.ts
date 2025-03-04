import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Driver, CreateDriverDTO } from "@/types/driver.types";

interface DriverStore {
  drivers: Driver[];
  currentDriver: Driver | null;
  loading: boolean;
  withLoading: (fn: () => Promise<void>) => Promise<void>;
  createDriver: (data: CreateDriverDTO) => Promise<void>;
  getAllDrivers: (params?: { page?: number; limit?: number }) => Promise<void>;
  getDriverById: (id: string) => Promise<void>;
  updateDriver: (id: string, updateData: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  getCurrentRoute: (id: string) => Promise<any>;
  startRoute: (id: string) => Promise<any>;
  endRoute: (id: string) => Promise<any>;
  updateLocation: (
    id: string,
    coords: { latitude: number; longitude: number }
  ) => Promise<any>;
  getAssignedStudents: (id: string) => Promise<any>;
}

export const useDriverStore = create<DriverStore>((set, get) => ({
  drivers: [],
  currentDriver: null,
  loading: false,

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

  createDriver: async ({
    name,
    password,
    email,
    phoneNumber,
    licenseNumber,
    vehicleType,
  }: CreateDriverDTO) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.post("/drivers", {
        name,
        password,
        email,
        phoneNumber,
        licenseNumber,
        vehicleType,
      });
      set((state) => ({ drivers: [...state.drivers, res.data.data] }));
      toast.success("Driver created successfully");
    });
  },

  getAllDrivers: async ({ page, limit } = {}) => {
    await get().withLoading(async () => {
      const params: Record<string, any> = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      const res = await axiosInstance.get("/drivers", { params });
      set({ drivers: res.data.data });
    });
  },

  getDriverById: async (id) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.get(`/drivers/${id}`);
      set({ currentDriver: res.data });
    });
  },

  updateDriver: async (id, updateData) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.put(`/drivers/${id}`, updateData);
      set((state) => ({
        drivers: state.drivers.map((driver) =>
          driver._id === id ? res.data : driver
        ),
      }));
      toast.success("Driver updated successfully");
    });
  },

  deleteDriver: async (id) => {
    await get().withLoading(async () => {
      await axiosInstance.delete(`/drivers/${id}`);
      set((state) => ({
        drivers: state.drivers.filter((driver) => driver._id !== id),
      }));
      toast.success("Driver deleted successfully");
    });
  },

  getCurrentRoute: async (id) => {
    return await get().withLoading(async () => {
      const res = await axiosInstance.get(`/drivers/${id}/current-route`);
      return res.data;
    });
  },

  startRoute: async (id) => {
    return await get().withLoading(async () => {
      const res = await axiosInstance.post(`/drivers/${id}/start-route`);
      toast.success("Route started successfully");
      return res.data;
    });
  },

  endRoute: async (id) => {
    return await get().withLoading(async () => {
      const res = await axiosInstance.post(`/drivers/${id}/end-route`);
      toast.success("Route ended successfully");
      return res.data;
    });
  },

  updateLocation: async (id, { latitude, longitude }) => {
    return await get().withLoading(async () => {
      const res = await axiosInstance.post(`/drivers/${id}/update-location`, {
        latitude,
        longitude,
      });
      toast.success("Location updated successfully");
      return res.data;
    });
  },

  getAssignedStudents: async (id) => {
    return await get().withLoading(async () => {
      const res = await axiosInstance.get(`/drivers/${id}/students`);
      return res.data;
    });
  },
}));