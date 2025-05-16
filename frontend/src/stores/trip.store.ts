import { Trip } from "./../types/trip.types";
import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

interface TripState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  getAllTrips: () => Promise<void>;
  createTrip: (tripData: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  getTripById: (schoolId: string) => Promise<void>;
  pickStudent: (tripId: string, studentId: string) => Promise<void>;
  startTrip: (tripId: string) => Promise<void>;
  endTrip: (tripId: string) => Promise<void>;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  loading: false,
  error: null,
  getAllTrips: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<Trip[]>("/trips");
      console.log("Trips Response from API:", res.data);
      set({ trips: res.data });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "An error occurred" });
    } finally {
      set({ loading: false });
    }
  },
  createTrip: async (tripData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post<Trip>("/trips", tripData);
      set((state) => ({ trips: [...state.trips, res.data] }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },

  startTrip: async (tripId) => {
    set({ loading: true }); // Set loading to true
    try {
      await axiosInstance.put(`/trips/${tripId}/start`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred"); // Display error message
    } finally {
      set({ loading: false }); // Set loading to false
    }
  },

  endTrip: async (tripId) => {
    set({ loading: true }); // Set loading to true
    try {
      await axiosInstance.put(`/trips/${tripId}/end`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred"); // Display error message
    } finally {
      set({ loading: false }); // Set loading to false
    }
  },
  pickStudent: async (tripId, studentId) => {
    set({ loading: true }); // Set loading to true
    try {
      await axiosInstance.put(`/trips/${tripId}/pick/${studentId}`); // Make request to pick student
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred"); // Display error message
    } finally {
      set({ loading: false }); // Set loading to false
    }
  },
  deleteTrip: async (id) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/trips/${id}`);
      set((state) => ({ trips: state.trips.filter((trip) => trip.id !== id) }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
  getTripById: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get<Trip>(`/trips/${id}`);
      set({ trips: [res.data] });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      set({ loading: false });
    }
  },
}));
