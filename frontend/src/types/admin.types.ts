export type UserRole = "user" | "driver" | "admin" | "parent" | "student" | "school";
export type UserStatus = "active" | "inactive" | "suspended";
export type BusStatus = "Idle" | "Going" | "Going Back" | "Arrived" | "Inactive";

export interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string[];
    role: UserRole;
    status?: UserStatus;
    lastLogin?: string;
}

export interface SchoolUser {
    _id: string;
    name: string;
    email: string;
    addresses: string[];
}

export interface Bus {
    _id: string;
    busNumber: string;
    schoolId: string;
    capacity: number;
    status: BusStatus;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
    studentsOnBoard: string[];
    createdAt: string;
    updatedAt: string;
}

export interface School {
    _id: string;
    adminUsers: string[];
    userId: SchoolUser;
    buses: Bus[];
    active?: boolean;
    status?: UserStatus;
    city?: string;
    state?: string;
    country?: string;
    createdAt: string;
    updatedAt: string;
}

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
    activeRoutes: Array<{
        busses: Array<{
            status: string;
            currentLocation: {
                latitude: number;
                longitude: number;
            };
        }>;
    }>;
    activeBuses: Array<{
        driverId: {
            name: string;
            phoneNumber: string;
        };
        routeId: {
            name: string;
        };
    }>;
    recentAlerts: Array<{
        _id: string;
        message: string;
        createdAt: string;
    }>;
}

export interface SubscriptionPlan {
    _id: string;
    name: string;
    price: number;
    renewalPeriod: number;
    description?: string;
    features?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PlanWithSubscribers extends SubscriptionPlan {
    subscriberCount: number;
    subscribers: Array<{
        userId: string;
        name: string;
        email: string;
    }>;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export interface SchoolsResponse {
    success: boolean;
    data: School[];
    message?: string;
}