export interface Stop {
    _id: string;
    address: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    order: number;
    scheduledTime: string;
    status: 'pending' | 'completed';
  }
  
  export interface Route {
    _id: string;
    startLocation: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    endLocation: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    stops: Stop[];
    status: 'pending' | 'in_progress' | 'completed';
    startTime?: string;
    endTime?: string;
    distance?: number;
    duration?: number;
  }
  
  export interface Student {
    _id: string;
    name: string;
    status: 'pending' | 'picked_up' | 'dropped_off';
    pickupLocation: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    parentId: {
      name: string;
      phoneNumber: string;
    }[];
    avatar?: string;
  }

  export interface Driver {
    _id?: string;
    licenseNumber: string;
    vehicleType: string;
    busId?: string;
    userId: {
      _id: string;
      name: string;
      email: string;
      phoneNumber?: string[];
      role: string;
    };
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface CreateDriverDTO {
    name: string;
    email: string;
    password: string;
    phoneNumber: string[];
    licenseNumber: string;
    vehicleType: string;
  }