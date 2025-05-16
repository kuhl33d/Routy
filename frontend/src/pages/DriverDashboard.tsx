import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "@/components/map";
import { useDriverStore } from "@/stores/driver.store";
import { toast } from "react-hot-toast";
import { Route, Student } from "@/types/driver.types";

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
  const [assignedStudents, setAssignedStudents] =
    useState<Student[]>(initialStudents);
  const [notifications] = useState<Notification[]>(initialNotifications);
  const [error, setError] = useState<string | null>(null);

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
    toast.success("Route started successfully (dummy data)");
  };

  const handleEndRoute = () => {
    setCurrentRoute((prev) =>
      prev
        ? { ...prev, status: "completed", endTime: new Date().toISOString() }
        : prev
    );
    toast.success("Route completed successfully (dummy data)");
  };

  const handlePickStudent = (studentId: string) => {
    setAssignedStudents((prev) =>
      prev.map((student) =>
        student._id === studentId
          ? { ...student, status: "picked_up" }
          : student
      )
    );
    toast.success("Student picked up successfully (dummy data)");
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
    toast.success("Stop marked as completed (dummy data)");
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

  return (
    <div className="min-h-screen flex flex-col">
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
                </TabsContent>
                <TabsContent value="stops">
                  <div className="space-y-4">
                    {currentRoute?.stops.map((stop) => (
                      <div
                        key={stop._id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{stop.address.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(stop.scheduledTime).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Status: {stop.status}
                          </p>
                        </div>
                        {stop.status !== "completed" && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkStopCompleted(stop._id)}
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="notifications">
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
