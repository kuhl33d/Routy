import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { 
  User, 
  SystemState, 
  TotalReport, 
  PaginatedResponse, 
  School, 
  PlanWithSubscribers,
  SubscriptionPlan 
} from "@/types/admin.types";

// Separate interfaces for different state slices
interface BaseState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface DashboardState {
  totalReport: TotalReport | null;
  systemState: SystemState | null;
}

interface UserState {
  users: User[];
}

interface SchoolState {
  schools: School[];
}

interface PlanState {
  plans: PlanWithSubscribers[];
  plansLoading: boolean;
  plansError: string | null;
}

// Parameter interfaces for actions
interface GetUsersParams {
  role?: string;
  page?: number;
  limit?: number;
}

interface UpdateUserParams {
  userId: string;
  updateData: Partial<User>;
}

interface UpdateSchoolParams {
  schoolId: string;
  updateData: Partial<School>;
}

interface GetSchoolsParams {
  page?: number;
  limit?: number;
}

// Combined AdminState interface
interface AdminState extends BaseState, DashboardState, UserState, SchoolState, PlanState {
  // Utils
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;

  // Dashboard actions
  getTotalReport: () => Promise<TotalReport>;
  getSystemState: () => Promise<SystemState>;

  // User actions
  getAllUsers: (params: GetUsersParams) => Promise<PaginatedResponse<User>>;
  updateUser: (params: UpdateUserParams) => Promise<void>;
  safeDeleteUser: (params: { userId: string }) => Promise<void>;
  finalDeleteUser: (params: { userId: string }) => Promise<void>;

  // School actions
  getAllSchools: (params: GetSchoolsParams) => Promise<PaginatedResponse<School>>;
  updateSchool: (params: UpdateSchoolParams) => Promise<void>;

  // Plan actions
  getAllPlans: () => Promise<PlanWithSubscribers[]>;
  createPlan: (plan: Partial<SubscriptionPlan>) => Promise<SubscriptionPlan>;
  updatePlan: (planId: string, updates: Partial<SubscriptionPlan>) => Promise<SubscriptionPlan>;
  importPlans: (file: File) => Promise<void>;
}

// Initial state
const initialState: Omit<AdminState, 'withLoading' | 'getTotalReport' | 'getSystemState' | 'getAllUsers' | 'updateUser' | 'safeDeleteUser' | 'finalDeleteUser' | 'getAllSchools' | 'updateSchool' | 'getAllPlans' | 'createPlan' | 'updatePlan' | 'importPlans'> = {
  // Base state
  loading: false,
  error: null,
  isAuthenticated: true,

  // Dashboard state
  totalReport: null,
  systemState: null,

  // User state
  users: [],

  // School state
  schools: [],

  // Plan state
  plans: [],
  plansLoading: false,
  plansError: null,
};

export const useAdminStore = create<AdminState>((set, get) => ({
  ...initialState,

  // Utils
  withLoading: async <T>(fn: () => Promise<T>): Promise<T> => {
    if (!get().isAuthenticated) {
      throw new Error('Unauthorized');
    }
    if (get().loading) {
      return Promise.reject(new Error('Operation in progress'));
    }

    set({ loading: true, error: null });
    try {
      const result = await fn();
      return result;
    } catch (error: any) {
      if (error.response?.status === 401) {
        set({ isAuthenticated: false });
        throw new Error('Unauthorized');
      }
      const errorMessage = error.response?.data?.message || "An error occurred";
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Dashboard actions
  getTotalReport: async () => {
    return get().withLoading(async () => {
      const response = await axiosInstance.get<TotalReport>('/admin/dashboard');
      set({ totalReport: response.data });
      return response.data;
    });
  },

  getSystemState: async () => {
    return get().withLoading(async () => {
      const response = await axiosInstance.get<SystemState>('/admin/overview');
      set({ systemState: response.data });
      return response.data;
    });
  },

  // User actions
  getAllUsers: async ({ role, page = 1, limit = 10 }) => {
    return get().withLoading(async () => {
      const response = await axiosInstance.get<PaginatedResponse<User>>("/auth/users", {
        params: { page, limit, role },
      });
      set({ users: response.data.data });
      return response.data;
    });
  },

  updateUser: async ({ userId, updateData }) => {
    return get().withLoading(async () => {
      const response = await axiosInstance.put<User>(`/auth/users/${userId}`, updateData);
      set((state) => ({
        users: state.users.map((user) => user._id === userId ? response.data : user),
      }));
      toast.success("User updated successfully");
    });
  },

  safeDeleteUser: async ({ userId }) => {
    return get().withLoading(async () => {
      await axiosInstance.delete(`/auth/users/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));
      toast.success("User marked as deleted");
    });
  },

  finalDeleteUser: async ({ userId }) => {
    return get().withLoading(async () => {
      await axiosInstance.delete(`/auth/usersFinalDelete/${userId}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== userId),
      }));
      toast.success("User permanently deleted");
    });
  },

  // School actions
  getAllSchools: async ({ page = 1, limit = 10 }) => {
    return get().withLoading(async () => {
      const response = await axiosInstance.get<PaginatedResponse<School>>('/schools', {
        params: { page, limit }
      });
      set({ schools: response.data.data });
      return response.data;
    });
  },

  updateSchool: async ({ schoolId, updateData }) => {
    return get().withLoading(async () => {
      const response = await axiosInstance.put<School>(`/schools/${schoolId}`, updateData);
      set((state) => ({
        schools: state.schools.map((school) => 
          school._id === schoolId ? response.data : school
        ),
      }));
      toast.success("School updated successfully");
    });
  },

  // Plan actions
  getAllPlans: async () => {
    set({ plansLoading: true });
    try {
      const response = await axiosInstance.get<PlanWithSubscribers[]>('/admin/subscription');
      set({ plans: response.data, plansError: null });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch plans';
      set({ plansError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ plansLoading: false });
    }
  },

  createPlan: async (plan) => {
    set({ plansLoading: true });
    try {
      const response = await axiosInstance.post<SubscriptionPlan>('/admin/subscription', plan);
      set((state) => ({ 
        plans: [...state.plans, { ...response.data, subscriberCount: 0, subscribers: [] }],
        plansError: null 
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create plan';
      set({ plansError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ plansLoading: false });
    }
  },

  updatePlan: async (planId, updates) => {
    set({ plansLoading: true });
    try {
      const response = await axiosInstance.put<SubscriptionPlan>(`/admin/subscription/${planId}`, updates);
      set((state) => ({
        plans: state.plans.map(plan => 
          plan._id === planId ? { ...plan, ...response.data } : plan
        ),
        plansError: null
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update plan';
      set({ plansError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ plansLoading: false });
    }
  },

  importPlans: async (file) => {
    set({ plansLoading: true });
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axiosInstance.post('/admin/subscription/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await get().getAllPlans();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to import plans';
      set({ plansError: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ plansLoading: false });
    }
  },
}));