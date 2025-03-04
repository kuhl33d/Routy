import { Student } from "./../types/Types";
import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import { toast } from "react-hot-toast";

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
  students: Student[]; // Corrected from 'Student' to 'students'
  schools: School[];
  loading: boolean;
  withLoading: (fn: () => Promise<void>) => Promise<void>;
  fetchSchools: () => Promise<void>;
  getSchoolById: (id: string) => Promise<School | null>;
  createSchool: (data: Omit<School, "_id">) => Promise<void>;
  updateSchool: (id: string, data: Partial<School>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;
  fetchStudentsBySchoolId: (schoolId: string) => Promise<void>;
  fetchStudentsinSchool: () => Promise<void>;
}

export const useSchoolStore = create<SchoolState>((set, get) => ({
  students: [], // Corrected initialization
  schools: [],
  loading: false,

  withLoading: async (fn) => {
    set({ loading: true });
    try {
      await fn();
    } catch (error: unknown) {
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
      const res = await axiosInstance.get<School>(`/api/schools/${id}`);
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

  fetchStudentsinSchool: async () => {
    await get().withLoading(async () => {
      try {
        console.log("Fetching students from API...");
        const res = await axiosInstance.get<Student[]>("/students");
        console.log("API Response:", res.data);
        set({ students: res.data });
      } catch (error: any) {
        console.error(
          "Error fetching students:",
          error.response?.data || error
        );
      }
    });
  },

  fetchStudentsBySchoolId: async (schoolId) => {
    await get().withLoading(async () => {
      const res = await axiosInstance.get<Student[]>(
        `/api/students/school/${schoolId}`
      );

      set({ students: res.data });
    });
  },
}));
