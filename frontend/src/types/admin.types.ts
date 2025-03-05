export interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string[];
    role: "user" | "driver" | "admin" | "parent" | "student" | "school";
    status?: "active" | "inactive" | "suspended";
    city?: string;
    state?: string;
    country?: string;
    lastLogin?: string;
}

// export interface TotalReport {
//   stats: {
//     totalParents: number;
//     totalDrivers: number;
//     totalSchools: number;
//     totalBuses: number;
//     totalRoutes: number;
//     totalStudents: number;
//   };
// }

// export interface SystemState {
//   activeRoutes: Array<{
//     busses: Array<{
//       status: string;
//       currentLocation: {
//         latitude: number;
//         longitude: number;
//       };
//     }>;
//   }>;
//   activeBuses: Array<{
//     driverId: {
//       name: string;
//       phoneNumber: string;
//     };
//     routeId: {
//       name: string;
//     };
//   }>;
//   recentAlerts: Array<{
  //     _id: string;
  //     message: string;
  //     createdAt: string;
  //   }>;
  // }

// export interface AdminState {
//   schools: School[]; // Consider renaming this to schools
//   loading: boolean;
//   error: string | null;
//   plans: PlanWithSubscribers[];
//   plansLoading: boolean;
//   plansError: string | null;
//   getAllSchools: (params: { page?: number; limit?: number }) => Promise<PaginatedResponse<School>>;
//   updateSchool: (params: { schoolId: string; updateData: Partial<School> }) => Promise<void>;

//   getAllPlans: () => Promise<PlanWithSubscribers[]>;
//   createPlan: (plan: Partial<SubscriptionPlan>) => Promise<SubscriptionPlan>;
//   updatePlan: (planId: string, updates: Partial<SubscriptionPlan>) => Promise<SubscriptionPlan>;
//   deletePlan: (planId: string) => Promise<void>;
//   importPlans: (file: File) => Promise<void>;
// }

export interface TotalReport {
  success: boolean;
  stats: {
    totalParents: number;
    totalDrivers: number;
    totalSchools: number;
    totalBuses: number;
    totalRoutes: number;
    totalStudents: number;
  };
}

export interface SystemState {
  activeRoutes: any[];
  activeBuses: any[];
  recentAlerts: Array<{
    _id: string;
    message: string;
    createdAt: string;
  }>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface School {
  _id: string;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface SchoolsResponse {
  data: School[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}


export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  renewalPeriod: number; // in days
  description?: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  _id: string;
  planId: string;
  userId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  amount: number;
}

export interface PlanWithSubscribers extends SubscriptionPlan {
  subscriberCount: number;
  subscribers: Array<{
    userId: string;
    name: string;
    email: string;
  }>;
}