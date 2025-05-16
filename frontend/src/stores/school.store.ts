import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";
import { Driver, Route, Student, Bus } from "../types/Types";

interface School {
  _id: string;
  name: string;
  address: string;
  phoneNumber: string[];
  email: string[];
  adminEmails: string[];
  website?: string;
  active: boolean;
}

interface SchoolState {
  students: Student[];
  schools: School[];
  loading: boolean;
  currentSchool: School | null;
  routes: Route[];
  drivers: Driver[];
  buses: Bus[];
  error: string | null;
  withLoading: (fn: () => Promise<void>) => Promise<void>;
  fetchSchools: () => Promise<void>;
  getSchoolById: (id: string) => Promise<School | null>;
  getSchoolStatsById: (id: string) => Promise<any>;
  createSchool: (data: Omit<School, "_id">) => Promise<void>;
  updateSchool: (id: string, data: Partial<School>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  getAllStudents: () => Promise<void>;
  getStudentById: (id: string) => Promise<Student | null>;
  createStudent: (data: Partial<Student>) => Promise<void>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  safeDeleteStudent: (id: string) => Promise<void>;
  finalDeleteStudent: (id: string) => Promise<void>;
  getAllRoutes: () => Promise<void>;
  getRouteById: (id: string) => Promise<Route | null>;
  createRoute: (data: Partial<Route>) => Promise<void>;
  updateRoute: (id: string, data: Partial<Route>) => Promise<void>;
  deleteRoute: (id: string) => Promise<void>;
  getAllDrivers: () => Promise<void>;
  getDriverById: (id: string) => Promise<Driver | null>;
  createDriver: (data: Partial<Driver>) => Promise<void>;
  updateDriver: (id: string, data: Partial<Driver>) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
  assignDriverUsingEmail: (data: object) => Promise<void>;
  getAllBuses: () => Promise<void>;
  getBusById: (id: string) => Promise<Bus | null>;
  createBus: (data: Partial<Bus>) => Promise<void>;
  updateBus: (id: string, data: Partial<Bus>) => Promise<void>;
  deleteBus: (id: string) => Promise<void>;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set, get) => ({
      students: [],
      schools: [],
      loading: false,
      currentSchool: null,
      routes: [],
      drivers: [],
      buses: [],
      error: null,

      withLoading: async (fn) => {
        set({ loading: true, error: null });
        try {
          await fn();
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || "An error occurred";
          set({ error: errorMessage });
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      fetchSchools: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get<School[]>("/api/schools");
          set({ schools: res.data });
        });
      },

      getSchoolById: async (id) => {
        try {
          const res = await axiosInstance.get<School>(`/schools/${id}`);
          set({ currentSchool: res.data });
          return res.data;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "School not found");
          return null;
        }
      },

      getSchoolStatsById: async (id) => {
        try {
          const res = await axiosInstance.get<any>(`/schools/${id}/stats`);
          return res.data;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "School not found");
          return null;
        }
      },

      createSchool: async (data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post<School>("/api/schools", data);
          set((state) => ({ schools: [...state.schools, res.data] }));
          toast.success("School created successfully");
        });
      },

      updateSchool: async (id, data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.put<School>(`/api/schools/${id}`, data);
          set((state) => ({
            schools: state.schools.map((school) =>
              school._id === id ? res.data : school
            ),
          }));
          toast.success("School updated successfully");
        });
      },

      deleteSchool: async (id) => {
        await get().withLoading(async () => {
          await axiosInstance.delete(`/api/schools/${id}`);
          set((state) => ({
            schools: state.schools.filter((school) => school._id !== id),
          }));
          toast.success("School deleted successfully");
        });
      },

      getAllStudents: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get("/students");
          set({ students: res.data.data });
        });
      },

      getStudentById: async (id) => {
        try {
          const res = await axiosInstance.get<Student>(`/students/${id}`);
          return res.data;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Student not found");
          return null;
        }
      },

      createStudent: async (data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post("/students", data);
          set((state) => ({ 
            students: Array.isArray(state.students) 
              ? [...state.students, res.data.data] 
              : [res.data.data] 
          }));
          toast.success("Student created successfully");
        });
      },

      updateStudent: async (id, data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.put(`/students/${id}`, data);
          set((state) => ({
            students: Array.isArray(state.students)
              ? state.students.map((student) => 
                  student._id === id ? res.data.data : student
                )
              : [res.data.data]
          }));
          toast.success("Student updated successfully");
        });
      },

      safeDeleteStudent: async (id) => {
        await get().withLoading(async () => {
          await axiosInstance.delete(`/students/${id}`);
          set((state) => ({
            students: Array.isArray(state.students)
              ? state.students.filter((student) => student._id !== id)
              : []
          }));
          toast.success("Student deleted successfully");
        });
      },

      finalDeleteStudent: async (id) => {
        await get().withLoading(async () => {
          await axiosInstance.delete(`/students/final/${id}`);
          set((state) => ({
            students: Array.isArray(state.students)
              ? state.students.filter((student) => student._id !== id)
              : []
          }));
          toast.success("Student permanently deleted");
        });
      },

      getAllRoutes: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get("/routes");
          set({ routes: res.data.data || res.data.routes || [] });
        });
      },

      getRouteById: async (id) => {
        try {
          const res = await axiosInstance.get<Route>(`/routes/${id}`);
          return res.data;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Route not found");
          return null;
        }
      },

      createRoute: async (data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post("/routes", data);
          set((state) => ({ routes: [...state.routes, res.data.data] }));
          toast.success("Route created successfully");
        });
      },

      updateRoute: async (id, data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.put(`/routes/${id}`, data);
          set((state) => ({
            routes: state.routes.map((route) =>
              route._id === id ? res.data.data : route
            ),
          }));
          toast.success("Route updated successfully");
        });
      },

      deleteRoute: async (id) => {
        await get().withLoading(async () => {
          await axiosInstance.delete(`/routes/${id}`);
          set((state) => ({
            routes: state.routes.filter((route) => route._id !== id),
          }));
          toast.success("Route deleted successfully");
        });
      },

      getAllDrivers: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get("/drivers");
          set({ drivers: res.data.data });
        });
      },

      getDriverById: async (id) => {
        try {
          const res = await axiosInstance.get<Driver>(`/drivers/${id}`);
          return res.data;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Driver not found");
          return null;
        }
      },

      createDriver: async (data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post("/drivers", data);
          set((state) => ({ drivers: [...state.drivers, res.data.data] }));
          toast.success("Driver created successfully");
        });
      },

      updateDriver: async (id, data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.put(`/drivers/${id}`, data);
          set((state) => ({
            drivers: state.drivers.map((driver) =>
              driver._id === id ? res.data.data : driver
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

      assignDriverUsingEmail: async (data: object) => {
        await get().withLoading(async () => {
          const schoolId = get().currentSchool?._id;
          const res = await axiosInstance.post(`/schools/addDriver`, {
            driverEmail: data.driverEmail,
            schoolId,
          });
          toast.success("Driver assigned successfully");
        });
      },

      getAllBuses: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get("/buses");
          set({ buses: res.data.data });
        });
      },

      getBusById: async (id) => {
        try {
          const res = await axiosInstance.get<Bus>(`/buses/${id}`);
          return res.data;
        } catch (error: any) {
          toast.error(error.response?.data?.message || "Bus not found");
          return null;
        }
      },

      createBus: async (data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.post("/buses", data);
          set((state) => ({ buses: [...state.buses, res.data.data] }));
          toast.success("Bus created successfully");
        });
      },

      updateBus: async (id, data) => {
        await get().withLoading(async () => {
          const res = await axiosInstance.put(`/buses/${id}`, data);
          set((state) => ({
            buses: state.buses.map((bus) =>
              bus._id === id ? res.data.data : bus
            ),
          }));
          toast.success("Bus updated successfully");
        });
      },

      deleteBus: async (id) => {
        await get().withLoading(async () => {
          await axiosInstance.delete(`/buses/${id}`);
          set((state) => ({
            buses: state.buses.filter((bus) => bus._id !== id),
          }));
          toast.success("Bus deleted successfully");
        });
      },
    }),
    {
      name: "school-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        currentSchool: state.currentSchool,
        schools: state.schools,
        students: state.students,
        routes: state.routes,
      }),
    }
  )
);
