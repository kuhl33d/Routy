import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "@/components/map";
import { useDriverStore } from "@/stores/driver.store";
import { toast } from "react-hot-toast";
import { Route, Student } from "@/types/driver.types";
import { PlusCircle, Pencil, Trash2, X, CheckCircle, XCircle } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7B32B]"></div>
    </div>
  );
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  avatar?: string;
}

interface Address {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface Stop {
  _id: string;
  address: Address;
  order: number;
  scheduledTime: string;
  status: "pending" | "completed" | "cancelled";
}

interface RouteStop extends Stop {
  isDeleting?: boolean;
  isEditing?: boolean;
}

interface StudentWithActions extends Student {
  isDeleting?: boolean;
  isEditing?: boolean;
}

interface NotificationWithActions extends Notification {
  isDeleting?: boolean;
}

interface ModalState {
  isOpen: boolean;
  type: "add" | "edit" | "delete" | null;
  itemType: "stop" | "student" | "notification" | null;
  currentItem: any | null;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "Adel's parents sent a new message",
    message:
      "Hi, we need to change Adel's pick up location to the corner of Main and Second. Can you do this?",
    time: "2 hours ago",
    avatar: "/placeholder.svg",
  },
];

const initialRoute: Route = {
  _id: "dummy-route-id",
  busId: "dummy-bus-id",
  driverId: "dummy-driver-id",
  startLocation: {
    name: "School",
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
  },
  endLocation: {
    name: "Home Base",
    coordinates: { latitude: 37.785, longitude: -122.42 },
  },
  stops: [
    {
      _id: "stop1",
      address: {
        name: "Stop 1",
        coordinates: { latitude: 37.7833, longitude: -122.4167 },
      },
      order: 1,
      scheduledTime: new Date().toISOString(),
      status: "pending",
    },
    {
      _id: "stop2",
      address: {
        name: "Stop 2",
        coordinates: { latitude: 37.784, longitude: -122.418 },
      },
      order: 2,
      scheduledTime: new Date().toISOString(),
      status: "pending",
    },
  ],
  status: "pending",
  startTime: undefined,
  endTime: undefined,
  distance: 5,
  duration: 30,
};

const initialStudents: Student[] = [
  {
    _id: "student1",
    name: "Adel Mohamed",
    avatar: "/placeholder.svg",
    status: "pending",
    busId: "dummy-bus-id",
    parentId: [{ name: "John's Parent", phoneNumber: "123-456-7890" }],
    pickupLocation: {
      name: "John's Pickup",
      coordinates: { latitude: 37.7833, longitude: -122.4167 },
    },
  },
  {
    _id: "student2",
    name: "Salma Ahmed",
    avatar: "/placeholder.svg",
    status: "pending",
    busId: "dummy-bus-id",
    parentId: [{ name: "Jane's Parent", phoneNumber: "987-654-3210" }],
    pickupLocation: {
      name: "Jane's Pickup",
      coordinates: { latitude: 37.784, longitude: -122.418 },
    },
  },
];

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState("route");
  const [currentRoute, setCurrentRoute] = useState<Route | null>(initialRoute);
  const [assignedStudents, setAssignedStudents] = useState<StudentWithActions[]>(
    initialStudents.map(student => ({ ...student, isDeleting: false, isEditing: false }))
  );
  const [notifications, setNotifications] = useState<NotificationWithActions[]>(
    initialNotifications.map(notification => ({ ...notification, isDeleting: false }))
  );
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    itemType: null,
    currentItem: null,
  });

  // New state for add/edit forms
  const [newStop, setNewStop] = useState<Partial<Stop>>({
    address: { name: "", coordinates: { latitude: 0, longitude: 0 } },
    order: 0,
    scheduledTime: new Date().toISOString(),
    status: "pending",
  });
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: "",
    avatar: "/placeholder.svg",
    status: "pending",
    busId: "dummy-bus-id",
    parentId: [{ name: "", phoneNumber: "" }],
    pickupLocation: { name: "", coordinates: { latitude: 0, longitude: 0 } },
  });
  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: "",
    message: "",
    time: new Date().toLocaleString(),
    avatar: "/placeholder.svg",
  });

  const { loading } = useDriverStore();

  const driverId = "67c49ff1e21e8eac8781873b";


  useEffect(() => {
    if (currentRoute?.status === "in_progress") {
      const intervalId = startLocationTracking();
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [currentRoute]);

  const startLocationTracking = () => {
    if (!("geolocation" in navigator)) return;
    return setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "Location updated:",
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }, 30000);
  };

  const handleStartRoute = () => {
    setCurrentRoute((prev) =>
      prev
        ? {
            ...prev,
            status: "in_progress",
            startTime: new Date().toISOString(),
          }
        : prev
    );
    toast.success("Route started successfully");
  };

  const handleEndRoute = () => {
    setCurrentRoute((prev) =>
      prev
        ? { ...prev, status: "completed", endTime: new Date().toISOString() }
        : prev
    );
    toast.success("Route completed successfully");
  };

  const handlePickStudent = (studentId: string) => {
    setAssignedStudents((prev) =>
      prev.map((student) =>
        student._id === studentId
          ? { ...student, status: "picked_up" }
          : student
      )
    );
    toast.success("Student picked up successfully");
  };

  const handleUnpickStudent = (studentId: string) => {
    setAssignedStudents((prev) =>
      prev.map((student) =>
        student._id === studentId
          ? { ...student, status: "pending" }
          : student
      )
    );
    toast.success("Student status reset to pending");
  };

  const handleAddStudent = () => {
    // Open modal for adding student
    setModal({
      isOpen: true,
      type: "add",
      itemType: "student",
      currentItem: null,
    });
    setNewStudent({
      name: "",
      avatar: "/placeholder.svg",
      status: "pending",
      busId: currentRoute?.busId || "",
      parentId: [{ name: "", phoneNumber: "" }],
      pickupLocation: { name: "", coordinates: { latitude: 0, longitude: 0 } },
    });
  };

  const handleEditStudent = (student: StudentWithActions) => {
    // Open modal for editing student
    setModal({
      isOpen: true,
      type: "edit",
      itemType: "student",
      currentItem: student,
    });
    setNewStudent({
      name: student.name,
      avatar: student.avatar,
      status: student.status,
      busId: student.busId,
      parentId: student.parentId,
      pickupLocation: student.pickupLocation,
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    setAssignedStudents((prev) => 
      prev.map(student => 
        student._id === studentId ? { ...student, isDeleting: true } : student
      )
    );
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setAssignedStudents((prev) => prev.filter(student => student._id !== studentId));
      toast.success("Student removed from route");
    }, 500);
  };

  const handleSaveStudent = () => {
    if (!newStudent.name || !newStudent.pickupLocation?.name) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (modal.type === "add") {
      // Add new student
      const newStudentWithId: StudentWithActions = {
        _id: `student-${Date.now()}`,
        name: newStudent.name!,
        avatar: newStudent.avatar || "/placeholder.svg",
        status: "pending",
        busId: currentRoute?.busId || "",
        parentId: newStudent.parentId || [],
        pickupLocation: newStudent.pickupLocation!,
        isDeleting: false,
        isEditing: false,
      };
      
      setAssignedStudents((prev) => [...prev, newStudentWithId]);
      toast.success("Student added successfully");
    } else if (modal.type === "edit" && modal.currentItem) {
      // Update existing student
      setAssignedStudents((prev) =>
        prev.map((student) =>
          student._id === modal.currentItem._id
            ? { 
                ...student, 
                name: newStudent.name!, 
                pickupLocation: newStudent.pickupLocation!,
                parentId: newStudent.parentId
              }
            : student
        )
      );
      toast.success("Student updated successfully");
    }
    
    // Close modal
    handleCloseModal();
  };

  const handleMarkStopCompleted = (stopId: string) => {
    setCurrentRoute((prev) =>
      prev
        ? {
            ...prev,
            stops: prev.stops.map((stop) =>
              stop._id === stopId ? { ...stop, status: "completed" } : stop
            ),
          }
        : null
    );
    toast.success("Stop marked as completed");
  };

  const handleMarkStopPending = (stopId: string) => {
    setCurrentRoute((prev) =>
      prev
        ? {
            ...prev,
            stops: prev.stops.map((stop) =>
              stop._id === stopId ? { ...stop, status: "pending" } : stop
            ),
          }
        : null
    );
    toast.success("Stop reset to pending");
  };

  const handleAddStop = () => {
    // Open modal for adding stop
    setModal({
      isOpen: true,
      type: "add",
      itemType: "stop",
      currentItem: null,
    });
    
    // Set default values for new stop
    const newOrderNumber = currentRoute?.stops.length ? currentRoute.stops.length + 1 : 1;
    setNewStop({
      address: { name: "", coordinates: { latitude: 0, longitude: 0 } },
      order: newOrderNumber,
      scheduledTime: new Date().toISOString(),
      status: "pending",
    });
  };

  const handleEditStop = (stop: Stop) => {
    // Open modal for editing stop
    setModal({
      isOpen: true,
      type: "edit",
      itemType: "stop",
      currentItem: stop,
    });
    setNewStop({
      address: stop.address,
      order: stop.order,
      scheduledTime: stop.scheduledTime,
      status: stop.status,
    });
  };

  const handleDeleteStop = (stopId: string) => {
    if (!currentRoute) return;

    // Mark stop as being deleted
    setCurrentRoute(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        stops: prev.stops.map(stop => 
          stop._id === stopId 
            ? { ...stop, status: "cancelled" } 
            : stop
        )
      };
    });
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setCurrentRoute(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stops: prev.stops.filter(stop => stop._id !== stopId)
        };
      });
      toast.success("Stop removed from route");
    }, 500);
  };

  const handleSaveStop = () => {
    if (!newStop.address?.name) {
      toast.error("Please enter a stop name");
      return;
    }
    
    if (modal.type === "add") {
      // Add new stop
      const newStopWithId: Stop = {
        _id: `stop-${Date.now()}`,
        address: newStop.address!,
        order: newStop.order || 1,
        scheduledTime: newStop.scheduledTime || new Date().toISOString(),
        status: "pending",
      };
      
      setCurrentRoute(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stops: [...prev.stops, newStopWithId].sort((a, b) => a.order - b.order)
        };
      });
      
      toast.success("Stop added successfully");
    } else if (modal.type === "edit" && modal.currentItem) {
      // Update existing stop
      setCurrentRoute(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          stops: prev.stops.map(stop => 
            stop._id === modal.currentItem._id
              ? { 
                  ...stop, 
                  address: newStop.address!,
                  order: newStop.order || stop.order,
                  scheduledTime: newStop.scheduledTime || stop.scheduledTime,
                }
              : stop
          ).sort((a, b) => a.order - b.order)
        };
      });
      
      toast.success("Stop updated successfully");
    }
    
    // Close modal
    handleCloseModal();
  };

  const handleAddNotification = () => {
    // Open modal for adding notification
    setModal({
      isOpen: true,
      type: "add",
      itemType: "notification",
      currentItem: null,
    });
    setNewNotification({
      title: "",
      message: "",
      time: "Just now",
      avatar: "/placeholder.svg",
    });
  };

  const handleDeleteNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isDeleting: true } 
          : notification
      )
    );
    
    // In a real app, you'd call an API here
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
      toast.success("Notification deleted");
    }, 500);
  };

  const handleSaveNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (modal.type === "add") {
      // Add new notification
      const newNotificationWithId: NotificationWithActions = {
        id: Date.now(),
        title: newNotification.title!,
        message: newNotification.message!,
        time: newNotification.time || "Just now",
        avatar: newNotification.avatar,
        isDeleting: false
      };
      
      setNotifications(prev => [newNotificationWithId, ...prev]);
      toast.success("Notification added");
    }
    
    // Close modal
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setModal({
      isOpen: false,
      type: null,
      itemType: null,
      currentItem: null,
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (modal.itemType === "student") {
      if (name.startsWith("parentId")) {
        const [, field, index] = name.split(".");
        setNewStudent(prev => {
          const updatedParentId = [...(prev.parentId || [])];
          if (!updatedParentId[Number(index)]) {
            updatedParentId[Number(index)] = { name: "", phoneNumber: "" };
          }
          updatedParentId[Number(index)][field as 'name' | 'phoneNumber'] = value;
          return { ...prev, parentId: updatedParentId };
        });
      } else if (name.startsWith("pickupLocation")) {
        const field = name.split(".")[1];
        setNewStudent(prev => ({
          ...prev,
          pickupLocation: {
            ...prev.pickupLocation!,
            [field]: field === "coordinates" ? { latitude: 0, longitude: 0 } : value
          }
        }));
      } else {
        setNewStudent(prev => ({ ...prev, [name]: value }));
      }
    } else if (modal.itemType === "stop") {
      if (name.startsWith("address")) {
        const field = name.split(".")[1];
        setNewStop(prev => ({
          ...prev,
          address: {
            ...prev.address!,
            [field]: field === "coordinates" ? { latitude: 0, longitude: 0 } : value
          }
        }));
      } else {
        setNewStop(prev => ({ ...prev, [name]: value }));
      }
    } else if (modal.itemType === "notification") {
      setNewNotification(prev => ({ ...prev, [name]: value }));
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => setError(null)} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  // Render modals based on type
  const renderModal = () => {
    if (!modal.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {modal.type === "add" ? "Add" : modal.type === "edit" ? "Edit" : "Delete"}{" "}
              {modal.itemType === "student" ? "Student" : modal.itemType === "stop" ? "Stop" : "Notification"}
            </h2>
            <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          {modal.type === "delete" ? (
            <div>
              <p className="mb-4">Are you sure you want to delete this {modal.itemType}?</p>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (modal.itemType === "student" && modal.currentItem) {
                      handleDeleteStudent(modal.currentItem._id);
                    } else if (modal.itemType === "stop" && modal.currentItem) {
                      handleDeleteStop(modal.currentItem._id);
                    } else if (modal.itemType === "notification" && modal.currentItem) {
                      handleDeleteNotification(modal.currentItem.id);
                    }
                    handleCloseModal();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {modal.itemType === "student" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newStudent.name}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      placeholder="Student Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pickup Location</label>
                    <input
                      type="text"
                      name="pickupLocation.name"
                      value={newStudent.pickupLocation?.name || ""}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      placeholder="Pickup Location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parent Name</label>
                    <input
                      type="text"
                      name="parentId.name.0"
                      value={newStudent.parentId?.[0]?.name || ""}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      placeholder="Parent Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Parent Phone</label>
                    <input
                      type="text"
                      name="parentId.phoneNumber.0"
                      value={newStudent.parentId?.[0]?.phoneNumber || ""}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
              )}

              {modal.itemType === "stop" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Stop Name</label>
                    <input
                      type="text"
                      name="address.name"
                      value={newStop.address?.name || ""}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      placeholder="Stop Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Order</label>
                    <input
                      type="number"
                      name="order"
                      value={newStop.order || 0}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      placeholder="Stop Order"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Scheduled Time</label>
                    <input
                      type="time"
                      name="scheduledTime"
                      value={newStop.scheduledTime ? new Date(newStop.scheduledTime).toTimeString().substring(0, 5) : ""}
                      onChange={(e) => {
                        const date = new Date();
                        const [hours, minutes] = e.target.value.split(':');
                        date.setHours(parseInt(hours), parseInt(minutes));
                        setNewStop(prev => ({...prev, scheduledTime: date.toISOString()}));
                      }}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
              )}

              {modal.itemType === "notification" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={newNotification.title || ""}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      placeholder="Notification Title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                      name="message"
                      value={newNotification.message || ""}
                      onChange={handleFormChange}
                      className="w-full p-2 border rounded"
                      rows={3}
                      placeholder="Notification Message"
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (modal.itemType === "student") {
                      handleSaveStudent();
                    } else if (modal.itemType === "stop") {
                      handleSaveStop();
                    } else if (modal.itemType === "notification") {
                      handleSaveNotification();
                    }
                  }}
                >
                  {modal.type === "add" ? "Add" : "Save"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Render modal */}
      {renderModal()}
      
      <div className="flex-1 container mx-auto py-6 gap-6 grid grid-cols-1 lg:grid-cols-3">
        {/* Main Content - Map and Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Current Route</CardTitle>
                {currentRoute?.status !== "in_progress" ? (
                  <Button
                    onClick={handleStartRoute}
                    className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
                  >
                    Start Route
                  </Button>
                ) : (
                  <Button onClick={handleEndRoute} variant="destructive">
                    End Route
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <Map driverId={driverId} currentRoute={currentRoute} />
              </div>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-4"
              >
                <TabsList>
                  <TabsTrigger value="route">Route</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="stops">Stops</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                <TabsContent value="route" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Start Time
                      </p>
                      <p className="font-medium">
                        {currentRoute?.startTime
                          ? new Date(
                              currentRoute.startTime
                            ).toLocaleTimeString()
                          : "Not started"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Time</p>
                      <p className="font-medium">
                        {currentRoute?.endTime
                          ? new Date(currentRoute.endTime).toLocaleTimeString()
                          : "In progress"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Distance
                      </p>
                      <p className="font-medium">
                        {currentRoute?.distance || 0} KM
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Duration
                      </p>
                      <p className="font-medium">
                        {currentRoute?.duration || 0} minutes
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="students">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Assigned Students</h3>
                    <Button onClick={handleAddStudent} size="sm" className="flex items-center">
                      <PlusCircle size={16} className="mr-1" /> Add Student
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {assignedStudents.map((student) => (
                      <div
                        key={student._id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          student.isDeleting ? "opacity-50 bg-red-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img
                              src={student.avatar || "/placeholder.svg"}
                              alt={student.name}
                              width={32}
                              height={32}
                            />
                          </div>
                          <div>
                            <span className="font-medium block">{student.name}</span>
                            <span className="text-xs text-muted-foreground">
                              Pickup: {student.pickupLocation.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {student.status === "picked_up" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-amber-600 hover:text-amber-700"
                              onClick={() => handleUnpickStudent(student._id)}
                            >
                              <XCircle size={16} className="mr-1" /> Unpick
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-500 text-white hover:bg-green-600"
                              onClick={() => handlePickStudent(student._id)}
                            >
                              <CheckCircle size={16} className="mr-1" /> Pick
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteStudent(student._id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="stops">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Route Stops</h3>
                    <Button onClick={handleAddStop} size="sm" className="flex items-center">
                      <PlusCircle size={16} className="mr-1" /> Add Stop
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {currentRoute?.stops.map((stop) => (
                      <div
                        key={stop._id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          stop.status === "cancelled" ? "opacity-50 bg-red-50" : 
                          stop.status === "completed" ? "bg-green-50" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center">
                            <span className="font-semibold mr-2">{stop.order}.</span>
                            <p className="font-medium">{stop.address.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(stop.scheduledTime).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-muted-foreground capitalize">
                            Status: {stop.status}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {stop.status === "completed" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkStopPending(stop._id)}
                            >
                              Reset
                            </Button>
                          ) : stop.status === "pending" ? (
                            <Button
                              size="sm"
                              onClick={() => handleMarkStopCompleted(stop._id)}
                            >
                              Complete
                            </Button>
                          ) : null}
                          {stop.status !== "cancelled" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEditStop(stop)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteStop(stop._id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="notifications">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <Button onClick={handleAddNotification} size="sm" className="flex items-center">
                      <PlusCircle size={16} className="mr-1" /> Add Notification
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`flex gap-3 p-3 rounded-lg border ${
                        notification.isDeleting ? "opacity-50 bg-red-50" : ""
                      }`}>
                        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                          <img
                            src={notification.avatar || "/placeholder.svg"}
                            alt=""
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-medium">
                              {notification.title}
                            </p>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stop Progress Tracker */}
          <Card>
            <CardHeader>
              <CardTitle>Stop Progress Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {currentRoute?.stops.map((stop, index) => (
                  <div
                    key={stop._id}
                    className="flex items-start mb-4 last:mb-0"
                  >
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          stop.status === "completed"
                            ? "bg-[#F7B32B]"
                            : stop.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-gray-300"
                        }`}
                      />
                      {index !== currentRoute.stops.length - 1 && (
                        <div className="absolute top-3 w-px h-full bg-gray-200 left-1.5" />
                      )}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">{stop.address.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(stop.scheduledTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignedStudents.map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.name}
                          width={32}
                          height={32}
                        />
                      </div>
                      <span className="font-medium">{student.name}</span>
                    </div>
                    {student.status === "picked_up" ? (
                      <span className="text-sm text-muted-foreground">
                        Picked up
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-green-500 text-white hover:bg-green-600"
                        onClick={() => handlePickStudent(student._id)}
                      >
                        Pick
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={notification.avatar || "/placeholder.svg"}
                        alt=""
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
