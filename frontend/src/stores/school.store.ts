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
  withLoading: (fn: () => Promise<void>) => Promise<void>;
  fetchSchools: () => Promise<void>;
  getSchoolById: (id: string) => Promise<School | null>;
  createSchool: (data: Omit<School, "_id">) => Promise<void>;
  updateSchool: (id: string, data: Partial<School>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  fetchStudentsBySchoolId: (schoolId: string) => Promise<void>;
  getAllRoutes: () => Promise<void>;
  assignDriverUsingEmail: (data: object) => Promise<void>;
  getAllDrivers: () => Promise<void>;
  getAllBuses: () => Promise<void>;
  getAllStudents: () => Promise<void>;
  safeDeleteStudent: (id: string) => Promise<void>;
  finalDeleteStudent: (id: string) => Promise<void>;
  getSchoolStatsById: (id: string) => Promise<any>;
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
          const res = await axiosInstance.put<School>(
            `/api/schools/${id}`,
            data
          );
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

      fetchStudentsBySchoolId: async () => {
        const schoolId = get().currentSchool?._id;

        await get().withLoading(async () => {
          const res = await axiosInstance.get<Student[]>(
            `/api/students/school/${schoolId}`
          );
          set({ students: res.data });
        });
      },
      getAllStudents: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get<Student[]>(`/students/`);
          set({ students: res.data });
        });
      },
      safeDeleteStudent: async (id) => {
        await get().withLoading(async () => {
          await axiosInstance.delete(`/students/${id}`);
          set((state) => ({
            students: state.students.filter((student) => student._id !== id),
          }));
          toast.success("Student deleted successfully");
        });
      },
      finalDeleteStudent: async (id) => {
        await get().withLoading(async () => {
          await axiosInstance.delete(`/students/final/${id}`);
          set((state) => ({
            students: state.students.filter((student) => student._id !== id),
          }));
          toast.success("Student deleted successfully");
        });
      },
      getAllRoutes: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get("/routes");
          set({ routes: res.data.routes });
          console.log("Routes fetched:", res.data);
        });
      },
      assignDriverUsingEmail: async (data: object) => {
        await get().withLoading(async () => {
          const schoolId = get().currentSchool?._id;
          const res = await axiosInstance.post(`/schools/addDriver`, {
            driverEmail: data.driverEmail,
            schoolId,
          });
          console.log("Driver assigned successfully:", res.data);
        });
      },
      getAllDrivers: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get("/drivers");
          set({ drivers: res.data.data });
          console.log("Drivers fetched:", res.data.data);
        });
      },
      //get all buses
      getAllBuses: async () => {
        await get().withLoading(async () => {
          const res = await axiosInstance.get("/buses");
          set({ buses: res.data.data });
          console.log("Buses fetched:", res.data.data);
        });
      },
    }),
    {
      name: "school-store", // Key for localStorage
      storage: createJSONStorage(() => sessionStorage), // Use localStorage
      partialize: (state) => ({
        currentSchool: state.currentSchool,
        schools: state.schools,
        students: state.students,
        routes: state.routes,
      }),
    }
  )
);
