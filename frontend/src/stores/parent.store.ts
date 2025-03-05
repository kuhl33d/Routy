import { create } from "zustand";
// import { Parent } from "../types/parent";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Parent, CreateParentUser } from "@/types/parent.types";

interface ParentStore {
  parents: Parent[];
  currentParent: Parent | null;
  loading: boolean;
  withLoading: (fn: () => Promise<void>) => Promise<void>;
  getAllParents: (params?: { page?: number; limit?: number }) => Promise<void>;
  getParentById: (id: string) => Promise<void>;
  createParent: (parentData: CreateParentUser) => Promise<void>;
  updateParent: (id: string, parentData: Partial<Parent>) => Promise<void>;
  deleteParent: (id: string) => Promise<void>;
}

export const useParentStore = create<ParentStore>((set, get) => ({
  parents: [],
  currentParent: null,
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

  getAllParents: async ({ page, limit } = {}) => {
    await get().withLoading(async () => {
      const params: Record<string, any> = {};
      if (page !== undefined) params.page = page;
      if (limit !== undefined) params.limit = limit;
      const res = await axiosInstance.get("/parents", { params });
      set({ parents: res.data.data });
    });
  },

  getParentById: async (id) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.get(`/parents/${id}`);
      set({ currentParent: res.data });
    });
  },

  createParent: async ({
    name,
    password,
    email,
    phoneNumber,
    addresses,
  }: CreateParentUser) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.post("/parents", {
        name,
        password,
        email,
        phoneNumber,
        addresses,
      });
      set((state) => ({ parents: [...state.parents, res.data.data] }));
      toast.success("Parent created successfully");
    });
  },

  updateParent: async (id, updateData) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.put(`/parents/${id}`, updateData);
      set((state) => ({
        parents: state.parents.map((parent) =>
          parent._id === id ? res.data : parent
        ),
      }));
      toast.success("Parent updated successfully");
    });
  },

  deleteParent: async (id) => {
    await get().withLoading(async () => {
      await axiosInstance.delete(`/parents/${id}`);
      set((state) => ({
        parents: state.parents.filter((parent) => parent._id !== id),
      }));
      toast.success("Parent deleted successfully");
    });
  },
}));
