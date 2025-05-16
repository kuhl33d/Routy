import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
}

interface Address {
  _id: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  checkingAuth: boolean;
  addresses: Address[];
  withLoading: (fn: () => Promise<void>) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => Promise<void>;
  login: (data: {
    email?: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (data: { code: string; email: string }) => Promise<void>;
  reSendVerificationEmail: (data: { email: string }) => Promise<void>;
  forgotPassword: (data: { email: string }) => Promise<void>;
  resetPassword: (data: { token: string; password: string }) => Promise<void>;
  makeNewAddress: (data: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    zipCode: string;
    notes: string;
  }) => Promise<void>;
  deleteAddress: (data: { addressId: string }) => Promise<void>;
  updateAddress: (data: {
    addressId: string;
    address: string;
    city: string;
    zipCode: string;
    notes: string;
  }) => Promise<void>;
  getAddresses: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: true,
      addresses: [],

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

      signup: async ({ name, email, password, role }) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post<{ user: User }>("/auth/signup", {
            role,
            name,
            email,
            password,
          });
          set({ user: res.data.user });
        });
      },

      login: async ({ email, password, phoneNumber }) => {
        console.log("Login Logic");
        await get().withLoading(async () => {
          const res = await axiosInstance.post<{ user: User }>("/auth/login", {
            email,
            password,
            phoneNumber,
          });
          set({ user: res.data.user });
        });
      },

      logout: async () => {
        await get().withLoading(async () => {
          await axiosInstance.post("/auth/logout");
          set({ user: null, addresses: [] });
        });
      },

      verifyEmail: async ({ code, email }) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.put<{ user: User }>(
            "/auth/verifyEmail",
            {
              code,
              email,
            }
          );
          set({ user: res.data.user });
        });
      },

      reSendVerificationEmail: async ({ email }) => {
        await get().withLoading(async () => {
          await axiosInstance.post("/auth/generateVerificationCode", { email });
          toast.success("Verification email sent successfully");
        });
      },

      forgotPassword: async ({ email }) => {
        await get().withLoading(async () => {
          await axiosInstance.post("/auth/forgotPassword", { email });
          toast.success("Password reset link sent to your email");
        });
      },

      resetPassword: async ({ token, password }) => {
        await get().withLoading(async () => {
          await axiosInstance.post(`/auth/resetPassword/${token}`, {
            password,
          });
          toast.success("Password reset successful");
        });
      },

      makeNewAddress: async ({
        latitude,
        longitude,
        address,
        city,
        zipCode,
        notes,
      }) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post<Address>("/auth/address", {
            latitude,
            longitude,
            address,
            city,
            zipCode,
            notes,
          });
          set((state) => ({ addresses: [...state.addresses, res.data] }));
          toast.success("Address added successfully");
        });
      },

      deleteAddress: async ({ addressId }) => {
        await get().withLoading(async () => {
          await axiosInstance.delete("/auth/address", { data: { addressId } });
          set((state) => ({
            addresses: state.addresses.filter((addr) => addr._id !== addressId),
          }));
          toast.success("Address deleted successfully");
        });
      },

      updateAddress: async ({ addressId, address, city, zipCode, notes }) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.put<Address>("/auth/address", {
            addressId,
            address,
            city,
            zipCode,
            notes,
          });
          set((state) => ({
            addresses: state.addresses.map((addr) =>
              addr._id === addressId ? res.data : addr
            ),
          }));
          toast.success("Address updated successfully");
        });
      },

      getAddresses: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get<{ addresses: Address[] }>(
            "/auth/address"
          );
          set({ addresses: res.data.addresses });
        });
      },

      refreshToken: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post<{ user: User }>(
            "/auth/refresh-token"
          );
          set({ user: res.data.user });
        });
      },
    }),
    {
      name: "user-storage", // Key in sessionStorage
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
      partialize: (state) => ({ user: state.user, addresses: state.addresses }), // Persist only user & addresses
    }
  )
);
