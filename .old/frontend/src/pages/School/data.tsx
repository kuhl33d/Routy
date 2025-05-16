type SidebarItem = {
  icon: JSX.Element;
  label: string;
  isActive?: boolean;
  path?: string;
};

export const sidebarItems: SidebarItem[] = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M240,160v24a16,16,0,0,1-16,16H115.93a4,4,0,0,1-3.24-6.35L174.27,109a8.21,8.21,0,0,0-1.37-11.3,8,8,0,0,0-11.37,1.61l-72,99.06A4,4,0,0,1,86.25,200H32a16,16,0,0,1-16-16V161.13c0-1.79,0-3.57.13-5.33a4,4,0,0,1,4-3.8H48a8,8,0,0,0,8-8.53A8.17,8.17,0,0,0,47.73,136H23.92a4,4,0,0,1-3.87-5c12-43.84,49.66-77.13,95.52-82.28a4,4,0,0,1,4.43,4V80a8,8,0,0,0,8.53,8A8.17,8.17,0,0,0,136,79.73V52.67a4,4,0,0,1,4.43-4A112.18,112.18,0,0,1,236.23,131a4,4,0,0,1-3.88,5H208.27a8.17,8.17,0,0,0-8.25,7.47,8,8,0,0,0,8,8.53h27.92a4,4,0,0,1,4,3.86C240,157.23,240,158.61,240,160Z" />
      </svg>
    ),
    label: "Dashboard",
    isActive: true,
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M228.92,49.69a8,8,0,0,0-6.86-1.45L160.93,63.52,99.58,32.84a8,8,0,0,0-5.52-.6l-64,16A8,8,0,0,0,24,56V200a8,8,0,0,0,9.94,7.76l61.13-15.28,61.35,30.68A8.15,8.15,0,0,0,160,224a8,8,0,0,0,1.94-.24l64-16A8,8,0,0,0,232,200V56A8,8,0,0,0,228.92,49.69ZM104,52.94l48,24V203.06l-48-24ZM40,62.25l48-12v127.5l-48,12Zm176,131.5-48,12V78.25l48-12Z" />
      </svg>
    ),
    label: "Routes",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M184,32H72A32,32,0,0,0,40,64V208a16,16,0,0,0,16,16H80a16,16,0,0,0,16-16V192h64v16a16,16,0,0,0,16,16h24a16,16,0,0,0,16-16V64A32,32,0,0,0,184,32ZM56,176V120H200v56Zm0-96H200v24H56ZM72,48H184a16,16,0,0,1,16,16H56A16,16,0,0,1,72,48Zm8,160H56V192H80Zm96,0V192h24v16Zm-72-60a12,12,0,1,1-12-12A12,12,0,0,1,104,148Zm72,0a12,12,0,1,1-12-12A12,12,0,0,1,176,148Zm72-68v24a8,8,0,0,1-16,0V80a8,8,0,0,1,16,0ZM24,80v24a8,8,0,0,1-16,0V80a8,8,0,0,1,16,0Z" />
      </svg>
    ),
    label: "Buses",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
      </svg>
    ),
    label: "Drivers",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M226.53,56.41l-96-32a8,8,0,0,0-5.06,0l-96,32A8,8,0,0,0,24,64v80a8,8,0,0,0,16,0V75.1L73.59,86.29a64,64,0,0,0,20.65,88.05c-18,7.06-33.56,19.83-44.94,37.29a8,8,0,1,0,13.4,8.74C77.77,197.25,101.57,184,128,184s50.23,13.25,65.3,36.37a8,8,0,0,0,13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64,64,0,0,0,20.65-88l44.12-14.7a8,8,0,0,0,0-15.18ZM176,120A48,48,0,1,1,89.35,91.55l36.12,12a8,8,0,0,0,5.06,0l36.12-12A47.89,47.89,0,0,1,176,120ZM128,87.57,57.3,64,128,40.43,198.7,64Z" />
      </svg>
    ),
    label: "Students",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
      </svg>
    ),
    label: "Reports",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
      </svg>
    ),
    label: "Settings",
  },
];

type Activity = {
  icon: JSX.Element;
  title: string;
  description: string;
  time: string;
};
export const activities: Activity[] = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
      </svg>
    ),
    title: "New student enrolled",
    description: "Name: Jane Doe",
    time: "10:00 AM",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M228.92,49.69a8,8,0,0,0-6.86-1.45L160.93,63.52,99.58,32.84a8,8,0,0,0-5.52-.6l-64,16A8,8,0,0,0,24,56V200a8,8,0,0,0,9.94,7.76l61.13-15.28,61.35,30.68A8.15,8.15,0,0,0,160,224a8,8,0,0,0,1.94-.24l64-16A8,8,0,0,0,232,200V56A8,8,0,0,0,228.92,49.69ZM104,52.94l48,24V203.06l-48-24ZM40,62.25l48-12v127.5l-48,12Zm176,131.5-48,12V78.25l48-12Z" />
      </svg>
    ),
    title: "Updated bus route",
    description: "Route 23",
    time: "9:30 AM",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24px"
        height="24px"
        fill="currentColor"
        viewBox="0 0 256 256"
      >
        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
      </svg>
    ),
    title: "Driver assigned",
    description: "Driver: John Smith",
    time: "9:00 AM",
  },
];
export const summaryCards = [
  { title: "Total Students Enrolled", value: 34 },
  { title: "Total Routes", value: 3 },
  { title: "Total Buses", value: 3 },
  { title: "Total Drivers", value: 3 },
];
export const todaysOverviewCards = [
  { title: "Total Trips", value: 34 },
  { title: "On Time", value: 32 },
  { title: "Delayed", value: 2 },
  { title: "Absent", value: 3 },
];
export const Routes = [
  {
    id: 1,
    route: "Route 1",
    description: "Nasr City - Maadi",
    type: "Morning",
    bus: "Bus 1",
    stops: "8 Stops",
    status: "Active",
  },
  {
    id: 2,
    route: "Route 2",
    description: "6th October - Dokki",
    type: "Morning",
    bus: "Bus 2",
    stops: "8 Stops",
    status: "Active",
  },
  {
    id: 3,
    route: "Route 3",
    description: "Heliopolis - New Cairo",
    type: "Afternoon",
    bus: "Bus 3",
    stops: "12 Stops",
    status: "Active",
  },
  {
    id: 4,
    route: "Route 4",
    description: "Zamalek - Downtown",
    type: "Afternoon",
    bus: "Bus 4",
    stops: "12 Stops",
    status: "Active",
  },
  {
    id: 5,
    route: "Route 5",
    description: "Garden City - Mohandessin",
    type: "Evening",
    bus: "Bus 5",
    stops: "6 Stops",
    status: "Inactive",
  },
];
export const Students = [
  {
    id: 1,
    StudentName: "Ali Hassan",
    Email: "ali.hassan@example.com",
    ParentContactNumber: "+201234567890",
    StudentIDNumber: "STU2025001",
    HomeAddress: "12 El-Tahrir St, Cairo, Egypt",
    AssignedBusNumber: "B12",
    BusRoute: "Route 1",
  },
  {
    id: 2,
    StudentName: "Mariam Adel",
    Email: "mariam.adel@example.com",
    ParentContactNumber: "+201112345678",
    StudentIDNumber: "STU2025002",
    HomeAddress: "45 Mohandessin St, Giza, Egypt",
    AssignedBusNumber: "B08",
    BusRoute: "Route 2",
  },
  {
    id: 3,
    StudentName: "Omar Youssef",
    Email: "omar.youssef@example.com",
    ParentContactNumber: "+201556789012",
    StudentIDNumber: "STU2025003",
    HomeAddress: "23 Heliopolis Ave, Cairo, Egypt",
    AssignedBusNumber: "B05",
    BusRoute: "Route 3",
  },
  {
    id: 4,
    StudentName: "Salma Khaled",
    Email: "salma.khaled@example.com",
    ParentContactNumber: "+201078945612",
    StudentIDNumber: "STU2025004",
    HomeAddress: "78 Zamalek Rd, Cairo, Egypt",
    AssignedBusNumber: "B15",
    BusRoute: "Route 4",
  },
  {
    id: 5,
    StudentName: "Ahmed Mostafa",
    Email: "ahmed.mostafa@example.com",
    ParentContactNumber: "+201265478903",
    StudentIDNumber: "STU2025005",
    HomeAddress: "34 Garden City, Cairo, Egypt",
    AssignedBusNumber: "B20",
    BusRoute: "Route 5",
  },
];

export const Buses = [
  {
    id: 1,
    BusNumber: "B12",
    Capacity: 40,
    AssignedRoute: "Route 1",
    DriverName: "Hassan Mahmoud",
    CurrentOccupancy: 35,
  },
  {
    id: 2,
    BusNumber: "B08",
    Capacity: 40,
    AssignedRoute: "Route 2",
    DriverName: "Khaled Ahmed",
    CurrentOccupancy: 28,
  },
  {
    id: 3,
    BusNumber: "B05",
    Capacity: 40,
    AssignedRoute: "Route 3",
    DriverName: "Mostafa Youssef",
    CurrentOccupancy: 40,
  },
  {
    id: 4,
    BusNumber: "B15",
    Capacity: 40,
    AssignedRoute: "Route 4",
    DriverName: "Adel Samir",
    CurrentOccupancy: 39,
  },
  {
    id: 5,
    BusNumber: "B20",
    Capacity: 40,
    AssignedRoute: "Route 5",
    DriverName: "Youssef Tarek",
    CurrentOccupancy: 30,
  },
];

export const Drivers = [
  {
    id: 1, // Changed "Id" to "id"
    DriverName: "Hassan Mahmoud",
    LicenseNumber: "LIC202501",
    PhoneNumber: "+201234567890",
    AssignedBus: "B12",
  },
  {
    id: 2,
    DriverName: "Khaled Ahmed",
    LicenseNumber: "LIC202502",
    PhoneNumber: "+201112345678",
    AssignedBus: "B08",
  },
  {
    id: 3,
    DriverName: "Mostafa Youssef",
    LicenseNumber: "LIC202503",
    PhoneNumber: "+201556789012",
    AssignedBus: "B05",
  },
  {
    id: 4,
    DriverName: "Adel Samir",
    LicenseNumber: "LIC202504",
    PhoneNumber: "+201078945612",
    AssignedBus: "B15",
  },
  {
    id: 5,
    DriverName: "Youssef Tarek",
    LicenseNumber: "LIC202505",
    PhoneNumber: "+201265478903",
    AssignedBus: "B20",
  },
];
