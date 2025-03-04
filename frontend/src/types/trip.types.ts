export interface Trip {
  id: string;
  busId: string;
  routeId: string;
  studentIds: string[];
  startTime: Date;
  endTime: Date;
  status: string;
  notifications: {
    notification: string;
    time: Date;
    user: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}
