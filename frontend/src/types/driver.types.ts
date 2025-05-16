// src/types/driver.types.ts
export interface Driver {
  _id: string;
  name: string;
  email: string;
  status?: "active" | "suspended" | string;
  lastLogin?: string;
  phoneNumber?: string[];
  licenseNumber?: string;
  vehicleType?: string;
  // If your backend populates the user data on driver
  userId?: {
    email: string;
    name: string;
    lastLogin?: Date;
    isVerified?: boolean;
    phoneVerified?: boolean;
    phoneNumber: string[];
    addresses?: string[];
    role: "user" | "school" | "parent" | "admin" | "driver" | "student";
    deleted?: boolean;
    active?: boolean;

  };
  // Optionally, if you use the bus details on driver:
  busId?: {
    _id: string;
    busNumber: string;
    // any other bus properties
  };
}

export interface CreateDriverDTO {
  name: string;
  password: string;
  email: string;
  phoneNumber?: string[];
  licenseNumber?: string;
  vehicleType?: string;
}

// Additional types
export interface Route {
  // Define route fields as needed
}

export interface Student {
  // Define student fields as needed
}
