import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance";

interface Route {
  _id: string;
  name: string;
  distance?: number;
  duration?: number;
  startLocation: string;
  endLocation: string;
  busses: string[];
  stops: { address: string; stopName: string; order: number }[];
}

interface RouteStore {
  routes: Route[];
  loading: boolean;
  error: string | null;
  fetchRoutes: () => Promise<void>;
  createRoute: (routeData: Partial<Route>) => Promise<void>;
  updateRoute: (id: string, routeData: Partial<Route>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
}

export const useRouteStore = create<RouteStore>((set) => ({
  routes: [],
  loading: false,
  error: null,

  fetchRoutes: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get("/routes");
      set({ routes: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createRoute: async (routeData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post("/routes", routeData);
      set((state) => ({ routes: [...state.routes, data], loading: false }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateRoute: async (id, routeData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.put(`/routes/${id}`, routeData);
      set((state) => ({
        routes: state.routes.map((route) => (route._id === id ? data : route)),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteRoute: async (id) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/routes/${id}`);
      set((state) => ({
        routes: state.routes.filter((route) => route._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
