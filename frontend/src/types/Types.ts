// export interface Driver {
//   id: string;
//   // name: string;
//   // email: string;
//   // phoneNumber: string;
//   // status: 'active' | 'inactive' | 'suspended';
//   licenseNumber: string;
//   vehicleType: string;
//   busId: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Admin {
//   id: string;
//   name: string;
//   email: string;
//   phoneNumber?: string;
//   role: "admin";
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface Bus {
//   id: string;
//   busNumber: string;
//   driverId: string;
//   routeId: string;
//   capacity: number;
//   currentPassengers: number;
//   currentLocation: { latitude: number; longitude: number };
//   status: "Idle" | "On Route" | "Arrived" | "Inactive";
//   studentsOnBoard: {
//     studentId: string;
//     pickedUp: boolean;
//     droppedOff: boolean;
//   }[];
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface Student {
  _id?: string;
  name: string;
  email: string;
  School: string;
  parentId: string[];
  schoolId: string;
  status?: "Waiting" | "Picked Up" | "Dropped Off" | "Idle" | "Absent";
  routeId: string;
  userId: string;
  pickupLocation?: string;
  age: number;
  grade: string;
  enrolled?: boolean;
  fees?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
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
}

export interface School {
  _id?: string;
  name: string;
  address: string;
  phoneNumber: string[];
  email?: string[];
  adminEmails: string[];
  website?: string;
  buses?: string[];
  adminUsers?: string[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Route Interface
export interface Stop {
  address: Address;
  stopName: string;
  order: number;
}

export interface Route {
  _id?: string;
  name: string;
  distance?: number;
  duration?: number;
  startLocation: Address;
  endLocation: Address;
  buses?: Bus[];
  stops?: Stop[];
  createdAt?: Date;
  updatedAt?: Date;
  schoolId?: string;
}

// Parent Interface
export interface Parent {
  _id?: string;
  children?: string[];
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Driver Interface
export interface Driver {
  _id?: string;
  licenseNumber: string;
  vehicleType: string;
  busId?: string;
  userId: User;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Bus Interface
export interface StudentOnBoard {
  studentId: string;
  pickedUp: boolean;
  droppedOff: boolean;
}

export interface Bus {
  _id?: string;
  busNumber: string;
  driverId: string;
  routeId: string;
  capacity: number;
  currentPassengers?: number;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  status: "Idle" | "On Route" | "Arrived" | "Inactive";
  studentsOnBoard?: StudentOnBoard[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Address Interface
export interface Address {
  _id?: string;
  userId: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  zipCode?: string;
  notes?: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
