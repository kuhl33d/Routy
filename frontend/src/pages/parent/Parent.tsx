import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RideCard from "./RideCard";
import { sidebarItems } from "./data";
import SmartSidebar from "@/components/SmartSidebar";
import { PlusCircle, Pencil, Trash2, X, Clock, Bell } from "lucide-react";
import { toast } from "react-hot-toast";

// Dummy data interfaces
interface Child {
  id: string;
  name: string;
  age: number;
  grade: string;
  school: string;
  busId: string;
  routeId: string;
}

interface Trip {
  id: string;
  name: string;
  status: string;
  busId: {
    busNumber: string;
  };
  routeId: {
    name: string;
  };
  driverId: {
    userId: {
      name: string;
    };
  };
  img: string;
  start: string;
  end: string;
  button: string;
  date: string;
  childId: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Add NotificationSetting interface
interface NotificationSetting {
  id: string;
  type: string;
  time: number; // minutes before
  enabled: boolean;
  childId?: string; // optional, if notification is specific to a child
}

// Initial dummy data
const initialChildren: Child[] = [
  {
    id: "c1",
    name: "Ahmed Mohamed",
    age: 9,
    grade: "4th Grade",
    school: "Al Azhar School",
    busId: "bus123",
    routeId: "route456",
  },
  {
    id: "c2",
    name: "Layla Ibrahim",
    age: 7,
    grade: "2nd Grade",
    school: "Al Azhar School",
    busId: "bus123",
    routeId: "route456",
  },
];

const initialTrips: Trip[] = [
  {
    id: "t1",
    name: "Morning Pickup",
    status: "Trip Started",
    busId: {
      busNumber: "123",
    },
    routeId: {
      name: "Route 1",
    },
    driverId: {
      userId: {
        name: "Mohamed Samir",
      },
    },
    img: "",
    start: "7:30 AM",
    end: "8:15 AM",
    button: "Track",
    date: "2023-09-12",
    childId: "c1",
  },
  {
    id: "t2",
    name: "Afternoon Return",
    status: "Trip Ended",
    busId: {
      busNumber: "123",
    },
    routeId: {
      name: "Route 1",
    },
    driverId: {
      userId: {
        name: "Mohamed Samir",
      },
    },
    img: "",
    start: "3:00 PM",
    end: "3:45 PM",
    button: "Track",
    date: "2023-09-12",
    childId: "c1",
  },
  {
    id: "t3",
    name: "Morning Pickup",
    status: "Trip Started",
    busId: {
      busNumber: "456",
    },
    routeId: {
      name: "Route 2",
    },
    driverId: {
      userId: {
        name: "Ali Hassan",
      },
    },
    img: "",
    start: "7:30 AM",
    end: "8:15 AM",
    button: "Track",
    date: "2023-09-12",
    childId: "c2",
  },
];

const dummyUser: User = {
  _id: "u1",
  name: "Omar Ahmed",
  email: "omar.ahmed@example.com",
  role: "parent",
};

const Parent: React.FC = () => {
  const [activeItem, setActiveItem] = useState("Today Trips");
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [user] = useState<User>(dummyUser);
  const [loading, setLoading] = useState(false);
  // Add notification settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { id: "n1", type: "trip_start", time: 5, enabled: true },
    { id: "n2", type: "trip_end", time: 5, enabled: true },
    { id: "n3", type: "child_pickup", time: 10, enabled: true },
  ]);

  // Simulation of loading data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SmartSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          image=""
          title="Parent Dashboard"
          items={sidebarItems}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full md:w-3/4 max-w-[960px] flex-1">
        {activeItem === "Today Trips" && <Trip trips={trips} user={user} onDeleteTrip={(id) => setTrips(trips.filter(trip => trip.id !== id))} />}
        {activeItem === "History" && <History trips={trips} user={user} onDeleteTrip={(id) => setTrips(trips.filter(trip => trip.id !== id))} />}
        {activeItem === "Children" && (
          <Children 
            children={children} 
            user={user} 
            onAddChild={(child) => setChildren([...children, child])}
            onUpdateChild={(updatedChild) => setChildren(children.map(child => child.id === updatedChild.id ? updatedChild : child))}
            onDeleteChild={(id) => setChildren(children.filter(child => child.id !== id))}
          />
        )}
        {activeItem === "Settings" && (
          <Settings
            user={user}
            notificationSettings={notificationSettings}
            onUpdateSettings={(settings) => setNotificationSettings(settings)}
          />
        )}
      </div>
    </div>
  );
};

const Trip: React.FC<{
  trips: Trip[];
  user: User;
  onDeleteTrip: (id: string) => void;
}> = ({ trips, user, onDeleteTrip }) => {
  const navigate = useNavigate();
  const [todayTrips, setTodayTrips] = useState<Trip[]>(trips);

  const handleTrackClick = () => {
    navigate("/tracking");
  };

  const handleDeleteTrip = (id: string) => {
    setTodayTrips(todayTrips.filter(trip => trip.id !== id));
    onDeleteTrip(id);
    toast.success("Trip deleted successfully");
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4 py-10">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#181711] dark:text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome, {user?.name}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-base font-normal leading-normal">
            Track your child's routes and ensure their safety
          </p>
        </div>
      </div>

      {/* Rides List */}
      <div className="space-y-4 py-4">
        {todayTrips.map((trip) => (
          <div key={trip.id} className="relative">
            <button 
              onClick={() => handleDeleteTrip(trip.id)}
              className="absolute top-6 right-6 z-10 p-2 bg-red-100 hover:bg-red-200 rounded-full"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
            <RideCard
              ride={trip}
              onButtonClick={handleTrackClick}
              cardKey={0}
              goingToSchoolEnded={trip.status === "Trip Ended"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const History: React.FC<{
  trips: Trip[];
  user: User;
  onDeleteTrip: (id: string) => void;
}> = ({ trips, user, onDeleteTrip }) => {
  const [activeItem, setActiveItem] = useState("All");
  const [historyTrips, setHistoryTrips] = useState<Trip[]>(trips);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>(trips);

  useEffect(() => {
    filterTrips(activeItem);
  }, [activeItem, historyTrips]);

  const filterTrips = (filter: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const lastMonth = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

    switch (filter) {
      case "Today":
        setFilteredTrips(historyTrips.filter(trip => trip.date === today));
        break;
      case "Yesterday":
        setFilteredTrips(historyTrips.filter(trip => trip.date === yesterday));
        break;
      case "Last 7 Days":
        setFilteredTrips(historyTrips.filter(trip => trip.date >= lastWeek));
        break;
      case "Last 30 Days":
        setFilteredTrips(historyTrips.filter(trip => trip.date >= lastMonth));
        break;
      default:
        setFilteredTrips(historyTrips);
    }
  };

  const handleDeleteTrip = (id: string) => {
    setHistoryTrips(historyTrips.filter(trip => trip.id !== id));
    onDeleteTrip(id);
    toast.success("Trip deleted from history");
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4 py-10">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#181711] dark:text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome, {user?.name}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-base font-normal leading-normal">
            Review your child's past trips and stay informed about their travel
            history
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 p-3 overflow-x-auto">
        {["All", "Today", "Yesterday", "Last 7 Days", "Last 30 Days"].map(
          (label) => (
            <button
              key={label}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
                activeItem === label
                  ? "bg-[#F4C752] dark:bg-[#F4C752] text-[#181711] dark:text-gray-900"
                  : "bg-[#f5f4f0] dark:bg-gray-700 text-[#181711] dark:text-white"
              }`}
              onClick={() => setActiveItem(label)}
            >
              <p className="text-sm font-medium leading-normal">{label}</p>
            </button>
          )
        )}
      </div>

      {/* Rides List */}
      <div className="space-y-4 py-4">
        {filteredTrips.map((trip) => (
          <div key={trip.id} className="relative">
            <button 
              onClick={() => handleDeleteTrip(trip.id)}
              className="absolute top-6 right-6 z-10 p-2 bg-red-100 hover:bg-red-200 rounded-full"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
            <RideCard
              ride={trip}
              onButtonClick={() => {}}
              cardKey={0}
              goingToSchoolEnded={trip.status === "Trip Ended"}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Children: React.FC<{
  children: Child[];
  user: User;
  onAddChild: (child: Child) => void;
  onUpdateChild: (child: Child) => void;
  onDeleteChild: (id: string) => void;
}> = ({ children, user, onAddChild, onUpdateChild, onDeleteChild }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentChild, setCurrentChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState<Omit<Child, 'id'>>({
    name: '',
    age: 0,
    grade: '',
    school: '',
    busId: '',
    routeId: ''
  });

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setFormData({
      name: '',
      age: 0,
      grade: '',
      school: '',
      busId: '',
      routeId: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (child: Child) => {
    setIsEditMode(true);
    setCurrentChild(child);
    setFormData({
      name: child.name,
      age: child.age,
      grade: child.grade,
      school: child.school,
      busId: child.busId,
      routeId: child.routeId
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentChild(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'age' ? parseInt(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && currentChild) {
      const updatedChild = {
        ...currentChild,
        ...formData
      };
      onUpdateChild(updatedChild);
      toast.success(`${updatedChild.name}'s information updated successfully`);
    } else {
      const newChild = {
        id: `c${Date.now()}`,
        ...formData
      };
      onAddChild(newChild);
      toast.success(`${newChild.name} added successfully`);
    }
    
    handleCloseModal();
  };

  const handleDeleteChild = (id: string) => {
    onDeleteChild(id);
    toast.success("Child removed successfully");
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4 py-10">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#181711] dark:text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome, {user?.name}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-base font-normal leading-normal">
            Manage your children's information
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 bg-[#F4C752] hover:bg-[#e9bb40] text-[#181711] px-4 py-2 rounded-xl"
        >
          <PlusCircle size={18} />
          <span>Add Child</span>
        </button>
      </div>

      {/* Children List */}
      <div className="space-y-4 py-4 px-4">
        {children.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-[#8c835f] dark:text-gray-400">No children added yet. Click "Add Child" to get started.</p>
          </div>
        ) : (
          children.map((child) => (
            <div key={child.id} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#181711] dark:text-white">{child.name}</h3>
                <p className="text-[#8c835f] dark:text-gray-400">Age: {child.age} • Grade: {child.grade}</p>
                <p className="text-[#8c835f] dark:text-gray-400">School: {child.school}</p>
                <p className="text-[#8c835f] dark:text-gray-400">Bus: {child.busId} • Route: {child.routeId}</p>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => handleOpenEditModal(child)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDeleteChild(child.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Child Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#181711] dark:text-white">
                {isEditMode ? 'Edit Child' : 'Add New Child'}
              </h2>
              <button onClick={handleCloseModal} className="p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#181711] dark:text-gray-200 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181711] dark:text-gray-200 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181711] dark:text-gray-200 mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181711] dark:text-gray-200 mb-1">
                  School
                </label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181711] dark:text-gray-200 mb-1">
                  Bus ID
                </label>
                <input
                  type="text"
                  name="busId"
                  value={formData.busId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#181711] dark:text-gray-200 mb-1">
                  Route ID
                </label>
                <input
                  type="text"
                  name="routeId"
                  value={formData.routeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F4C752] hover:bg-[#e9bb40] text-[#181711] py-2 rounded-md font-medium"
              >
                {isEditMode ? 'Update' : 'Add'} Child
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Add Settings component
const Settings: React.FC<{
  user: User;
  notificationSettings: NotificationSetting[];
  onUpdateSettings: (settings: NotificationSetting[]) => void;
}> = ({ user, notificationSettings, onUpdateSettings }) => {
  const [settings, setSettings] = useState<NotificationSetting[]>(notificationSettings);
  const [customTime, setCustomTime] = useState<string>("");
  const [customType, setCustomType] = useState<string>("trip_start");
  const [activeTab, setActiveTab] = useState<string>("notifications");
  
  const handleToggleNotification = (id: string) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    );
    setSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
    toast.success("Notification setting updated");
  };
  
  const handleTimeChange = (id: string, minutes: number) => {
    const updatedSettings = settings.map(setting => 
      setting.id === id ? { ...setting, time: minutes } : setting
    );
    setSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
    toast.success("Notification timing updated");
  };
  
  const handleAddCustomNotification = () => {
    if (!customTime || isNaN(Number(customTime)) || Number(customTime) <= 0) {
      toast.error("Please enter a valid time in minutes");
      return;
    }
    
    const newSetting: NotificationSetting = {
      id: `n${Date.now()}`,
      type: customType,
      time: Number(customTime),
      enabled: true
    };
    
    const updatedSettings = [...settings, newSetting];
    setSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
    setCustomTime("");
    toast.success("Custom notification added");
  };
  
  const handleDeleteNotification = (id: string) => {
    const updatedSettings = settings.filter(setting => setting.id !== id);
    setSettings(updatedSettings);
    onUpdateSettings(updatedSettings);
    toast.success("Notification removed");
  };
  
  const getNotificationTypeName = (type: string): string => {
    switch (type) {
      case "trip_start": return "Trip Start";
      case "trip_end": return "Trip End";
      case "child_pickup": return "Child Pickup";
      case "bus_arrive_school": return "Bus Arriving at School";
      case "bus_leave_school": return "Bus Leaving School";
      default: return type;
    }
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4 py-10">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#181711] dark:text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome, {user?.name}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-base font-normal leading-normal">
            Manage your notification settings
          </p>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="px-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "notifications"
                ? "border-b-2 border-[#F4C752] text-[#181711] dark:text-white"
                : "text-[#8c835f] dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "account"
                ? "border-b-2 border-[#F4C752] text-[#181711] dark:text-white"
                : "text-[#8c835f] dark:text-gray-400"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
        </div>

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <h3 className="text-lg font-bold text-[#181711] dark:text-white mb-4 flex items-center">
                <Bell size={20} className="mr-2" />
                Notification Timing
              </h3>
              <p className="text-[#8c835f] dark:text-gray-400 mb-6">
                Set how many minutes before an event you want to receive notifications
              </p>

              {/* Notification Settings List */}
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Clock size={18} className="text-[#F4C752] mr-2" />
                      <div>
                        <p className="font-medium text-[#181711] dark:text-white">
                          {getNotificationTypeName(setting.type)}
                        </p>
                        <p className="text-sm text-[#8c835f] dark:text-gray-400">
                          {setting.time} minutes before
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={setting.time}
                        onChange={(e) => handleTimeChange(setting.id, Number(e.target.value))}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                      >
                        <option value={5}>5 min</option>
                        <option value={10}>10 min</option>
                        <option value={15}>15 min</option>
                        <option value={30}>30 min</option>
                        <option value={60}>1 hour</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleNotification(setting.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                            setting.enabled ? "bg-[#F4C752]" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              setting.enabled ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(setting.id)}
                          className="p-1 hover:bg-red-100 hover:text-red-500 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Time */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-md font-medium text-[#181711] dark:text-white mb-3">
                  Add Custom Notification Time
                </h4>
                <div className="flex flex-wrap gap-3">
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2"
                  >
                    <option value="trip_start">Trip Start</option>
                    <option value="trip_end">Trip End</option>
                    <option value="child_pickup">Child Pickup</option>
                    <option value="bus_arrive_school">Bus Arriving at School</option>
                    <option value="bus_leave_school">Bus Leaving School</option>
                  </select>
                  <div className="flex">
                    <input
                      type="number"
                      min="1"
                      placeholder="Minutes"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-24 px-3 py-2 border rounded-l-md dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-200 rounded-r-md">
                      min
                    </span>
                  </div>
                  <button
                    onClick={handleAddCustomNotification}
                    className="bg-[#F4C752] hover:bg-[#e9bb40] text-[#181711] px-4 py-2 rounded-md"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "account" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
            <h3 className="text-lg font-bold text-[#181711] dark:text-white mb-4">Account Settings</h3>
            <p className="text-[#8c835f] dark:text-gray-400">
              Account settings will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parent;
