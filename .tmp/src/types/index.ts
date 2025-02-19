export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'driver' | 'parent' | 'school';
  }
  
  export interface Bus {
    id: string;
    busNumber: string;
    capacity: number;
    driverId: string;
    routeId: string;
    currentLocation?: {
      latitude: number;
      longitude: number;
    };
    status: 'Idle' | 'On Route' | 'Arrived' | 'Inactive';
    studentsOnBoard: StudentOnBus[];
  }
  
  export interface Route {
    id: string;
    name: string;
    startLocation: Location;
    endLocation: Location;
    stops: Stop[];
    distance: number;
    duration: number;
    busses: string[];
  }
  
  export interface Student {
    id: string;
    name: string;
    parentId: string[];
    schoolId: string;
    busId: string;
    pickupLocation: Location;
    status: 'Waiting' | 'Picked Up' | 'Dropped Off' | 'Idle' | 'Absent';
    grade: string;
    age: number;
  }
  
  export interface Location {
    id: string;
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    zipCode: string;
  }
  
  export interface Stop {
    address: Location;
    order: number;
    estimatedTime: string;
  }
  
  export interface StudentOnBus {
    studentId: string;
    pickedUp: boolean;
    droppedOff: boolean;
  }
  
  export interface Report {
    id: string;
    type: string;
    date: string;
    data: any;
  }