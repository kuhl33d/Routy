export interface Child {
  _id: string;
  name: string;
  // status: 'pending' | 'picked_up' | 'dropped_off';
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

export interface Parent {
  _id?: string;
  children: string[];
  userId: {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string[];
    addresses: string[];
    role: string;
  };
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateParentUser {
  name: string;
  email: string;
  password: string;
  phoneNumber: string[];
  addresses: string[];
  children?: string[];
}
