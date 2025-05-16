import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import * as Types from "@/types/admin.types";

// Auth helpers
const getAuthToken = () => localStorage.getItem('token');
const setAuthToken = (token: string) => localStorage.setItem('token', token);
const removeAuthToken = () => localStorage.removeItem('token');

// State Interfaces
interface LoadingState {
    dashboard: boolean;
    schools: boolean;
    users: boolean;
    plans: boolean;
}

interface BaseState {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    loadingState: LoadingState;
}

interface DashboardState {
    totalReport: Types.TotalReport | null;
    systemState: Types.SystemState | null;
}

interface UserState {
    users: Types.User[];
}

interface SchoolState {
    schools: Types.School[];
    selectedSchool: Types.School | null;
}

interface PlanState {
    plans: Types.PlanWithSubscribers[];
    plansLoading: boolean;
    plansError: string | null;
}

// Parameter Interfaces
interface GetUsersParams {
    role?: string;
    page?: number;
    limit?: number;
}

interface UpdateUserParams {
    userId: string;
    updateData: Partial<Types.User>;
}

interface UpdateSchoolParams {
    schoolId: string;
    updateData: Partial<Types.School>;
}

// Combined Store Interface
interface AdminStore extends BaseState, DashboardState, UserState, SchoolState, PlanState {
    // Utils
    withLoading: <T>(loadingKey: keyof LoadingState, fn: () => Promise<T>) => Promise<T>;
    checkAuth: () => boolean;
    
    // Dashboard Actions
    getDashboardData: () => Promise<void>;
    getTotalReport: () => Promise<Types.TotalReport>;
    getSystemState: () => Promise<Types.SystemState>;
    
    // User Actions
    getAllUsers: (params: GetUsersParams) => Promise<Types.PaginatedResponse<Types.User>>;
    updateUser: (params: UpdateUserParams) => Promise<void>;
    safeDeleteUser: (params: { userId: string }) => Promise<void>;
    finalDeleteUser: (params: { userId: string }) => Promise<void>;
    
    // School Actions
    getAllSchools: () => Promise<Types.School[]>;
    getSchoolDetails: (schoolId: string) => Promise<Types.School>;
    updateSchool: (params: UpdateSchoolParams) => Promise<void>;
    
    // Plan Actions
    getAllPlans: () => Promise<Types.PlanWithSubscribers[]>;
    createPlan: (plan: Partial<Types.SubscriptionPlan>) => Promise<Types.SubscriptionPlan>;
    updatePlan: (planId: string, updates: Partial<Types.SubscriptionPlan>) => Promise<Types.SubscriptionPlan>;
    importPlans: (file: File) => Promise<void>;
    
    createAdmin: (adminData: Partial<Types.User> & { password: string }) => Promise<Types.User>;}

// Initial State
const initialState: Omit<AdminStore, 'withLoading' | 'checkAuth' | 'getDashboardData' | 'getTotalReport' | 'getSystemState' | 'getAllUsers' | 'updateUser' | 'safeDeleteUser' | 'finalDeleteUser' | 'getAllSchools' | 'getSchoolDetails' | 'updateSchool' | 'getAllPlans' | 'createPlan' | 'updatePlan' | 'importPlans' | 'createAdmin'> = {
    loading: false,
    error: null,
    isAuthenticated: !!getAuthToken(),
    loadingState: {
        dashboard: false,
        schools: false,
        users: false,
        plans: false,
    },
    totalReport: null,
    systemState: null,
    users: [],
    schools: [] as Types.School[],
    selectedSchool: null as Types.School | null,
    plans: [],
    plansLoading: false,
    plansError: null,
};

// Axios interceptors
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeAuthToken();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Store implementation
export const useAdminStore = create<AdminStore>((set, get) => ({
    ...initialState,

    checkAuth: () => {
        const token = getAuthToken();
        const isAuth = !!token;
        set({ isAuthenticated: isAuth });
        return isAuth;
    },

    withLoading: async <T>(loadingKey: keyof LoadingState, fn: () => Promise<T>): Promise<T> => {
        // if (!get().checkAuth()) {
        //     throw new Error('Unauthorized');
        // }

        set(state => ({
            loadingState: { ...state.loadingState, [loadingKey]: true },
            error: null
        }));

        try {
            const result = await fn();
            return result;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "An error occurred";
            set({ error: errorMessage });
            toast.error(errorMessage);
            throw error;
        } finally {
            set(state => ({
                loadingState: { ...state.loadingState, [loadingKey]: false }
            }));
        }
    },

    // Dashboard Actions
    getDashboardData: async () => {
        return get().withLoading('dashboard', async () => {
            const [totalReport, systemState, schools] = await Promise.all([
                axiosInstance.get<Types.TotalReport>('/admin/dashboard'),
                axiosInstance.get<Types.SystemState>('/admin/overview'),
                axiosInstance.get<Types.School[]>('/schools')
            ]);

            set({
                totalReport: totalReport.data,
                systemState: systemState.data,
                schools: schools.data,
                error: null
            });
        });
    },

    getTotalReport: async () => {
        return get().withLoading('dashboard', async () => {
            const response = await axiosInstance.get<Types.TotalReport>('/admin/dashboard');
            set({ totalReport: response.data });
            return response.data;
        });
    },

    getSystemState: async () => {
        return get().withLoading('dashboard', async () => {
            const response = await axiosInstance.get<Types.SystemState>('/admin/overview');
            set({ systemState: response.data });
            return response.data;
        });
    },

    // User Actions
    getAllUsers: async ({ role, page = 1, limit = 10 }) => {
        return get().withLoading('users', async () => {
            const response = await axiosInstance.get<Types.PaginatedResponse<Types.User>>('/auth/users', {
                params: { role, page, limit }
            });
            set({ users: response.data.data });
            return response.data;
        });
    },

    updateUser: async ({ userId, updateData }) => {
        return get().withLoading('users', async () => {
            const response = await axiosInstance.put<Types.User>(`/auth/users/${userId}`, updateData);
            set(state => ({
                users: state.users.map(user => user._id === userId ? response.data : user)
            }));
            toast.success('User updated successfully');
        });
    },

    safeDeleteUser: async ({ userId }) => {
        return get().withLoading('users', async () => {
            await axiosInstance.delete(`/auth/users/${userId}`);
            set(state => ({
                users: state.users.filter(user => user._id !== userId)
            }));
            toast.success('User marked as deleted');
        });
    },

    finalDeleteUser: async ({ userId }) => {
        return get().withLoading('users', async () => {
            await axiosInstance.delete(`/auth/usersFinalDelete/${userId}`);
            set(state => ({
                users: state.users.filter(user => user._id !== userId)
            }));
            toast.success('User permanently deleted');
        });
    },

    // School Actions
    getAllSchools: async () => {
        return get().withLoading('schools', async () => {
            try {
                const response = await axiosInstance.get<Types.SchoolsResponse>('/schools');
                const schoolsData = response.data.data || [];
                set({ schools: schoolsData });
                return schoolsData; // Now returns School[]
            } catch (error: any) {
                set({ schools: [] });
                const errorMessage = error.response?.data?.message || 'Failed to fetch schools';
                toast.error(errorMessage);
                throw new Error(errorMessage);
            }
        });
    },

    getSchoolDetails: async (schoolId: string) => {
        return get().withLoading('schools', async () => {
            const response = await axiosInstance.get<Types.School>(`/schools/${schoolId}`);
            set({ selectedSchool: response.data });
            return response.data;
        });
    },

    updateSchool: async ({ schoolId, updateData }) => {
        return get().withLoading('schools', async () => {
            const response = await axiosInstance.put<Types.School>(`/schools/${schoolId}`, updateData);
            set(state => ({
                schools: state.schools.map(school => 
                    school._id === schoolId ? response.data : school
                ),
                selectedSchool: response.data
            }));
            toast.success('School updated successfully');
        });
    },

    // Plan Actions
    getAllPlans: async () => {
        return get().withLoading('plans', async () => {
            const response = await axiosInstance.get<Types.PlanWithSubscribers[]>('/admin/subscription');
            set({ plans: response.data, plansError: null });
            return response.data;
        });
    },

    createPlan: async (plan) => {
        return get().withLoading('plans', async () => {
            const response = await axiosInstance.post<Types.SubscriptionPlan>('/admin/subscription', plan);
            set(state => ({
                plans: [...state.plans, { ...response.data, subscriberCount: 0, subscribers: [] }],
                plansError: null
            }));
            toast.success('Plan created successfully');
            return response.data;
        });
    },

    updatePlan: async (planId, updates) => {
        return get().withLoading('plans', async () => {
            const response = await axiosInstance.put<Types.SubscriptionPlan>(`/admin/subscription/${planId}`, updates);
            set(state => ({
                plans: state.plans.map(plan => 
                    plan._id === planId ? { ...plan, ...response.data } : plan
                ),
                plansError: null
            }));
            toast.success('Plan updated successfully');
            return response.data;
        });
    },

    importPlans: async (file) => {
        return get().withLoading('plans', async () => {
            const formData = new FormData();
            formData.append('file', file);
            
            await axiosInstance.post('/admin/subscription/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            await get().getAllPlans();
            toast.success('Plans imported successfully');
        });
    },
    createAdmin: async (adminData: Partial<Types.User> & { password: string }) => {
        return get().withLoading('users', async () => {
            const response = await axiosInstance.post<Types.User>('/users', {
                ...adminData,
                role: 'admin',
            });
            set(state => ({
                users: [...state.users, response.data],
            }));
            toast.success('Admin created successfully');
            return response.data;
        });
    },
}));