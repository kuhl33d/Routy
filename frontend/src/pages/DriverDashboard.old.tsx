import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Map from "@/components/map";
import { useDriverStore } from "@/stores/driver.store";
import { toast } from "react-hot-toast";
import { Route, Student } from "@/types/driver.types";
import { useUserStore } from "@/stores/user.store";

// Loading Spinner Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7B32B]"></div>
    </div>
  );
}

// Dummy notifications
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
    title: "Finn's parents sent a new message",
    message:
      "Hi, we need to change Finn's pick up location to the corner of Main and Second. Can you do this?",
    time: "2 hours ago",
    avatar: "/placeholder.svg",
  },
];

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState("route");
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [assignedStudents, setAssignedStudents] = useState<Student[]>([]);
  const [notifications] = useState<Notification[]>(initialNotifications); // No WebSocket, just use dummy data
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  const {
    currentDriver,
    loading,
    getCurrentRoute,
    startRoute,
    endRoute,
    updateLocation,
    getAssignedStudents,
    updateStudentStatus,
    markStopCompleted,
    getDriverById,
  } = useDriverStore();
  // Mock driver ID (replace with auth context)
  const driverId = "67c49ff1e218eeac8781873d";
  // getDriverById(driverId);

  useEffect(() => {
    loadInitialData();
    getDriverById(user._id, "user");
  }, [driverId]);

  useEffect(() => {
    if (currentRoute?.status === "in_progress") {
      const intervalId = startLocationTracking();
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
  }, [currentRoute]);

  const loadInitialData = async () => {
    try {
      setError(null);
      const routeData = await getCurrentRoute(driverId);
      setCurrentRoute(routeData);

      const studentsData = await getAssignedStudents(driverId);
      setAssignedStudents(studentsData);
    } catch (error: any) {
      console.error(error);
      setError("Failed to load driver data. Please try again.");
      toast.error("Failed to load driver data");
    }
  };

  const startLocationTracking = () => {
    if ("geolocation" in navigator) {
      return setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              await updateLocation(driverId, {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            } catch (error) {
              console.error("Failed to update location:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      }, 30000); // Update every 30 seconds
    }
  };

  const handleStartRoute = async () => {
    try {
      await startRoute(driverId);
      await loadInitialData();
      toast.success("Route started successfully");
    } catch (error) {
      toast.error("Failed to start route");
    }
  };

  const handleEndRoute = async () => {
    try {
      await endRoute(driverId);
      await loadInitialData();
      toast.success("Route completed successfully");
    } catch (error) {
      toast.error("Failed to end route");
    }
  };

  const handlePickStudent = async (studentId: string) => {
    try {
      await updateStudentStatus(driverId, studentId, "picked_up");
      setAssignedStudents((prev) =>
        prev.map((student) =>
          student._id === studentId
            ? { ...student, status: "picked_up" }
            : student
        )
      );
      toast.success("Student picked up successfully");
    } catch (error) {
      toast.error("Failed to update student status");
    }
  };

  const handleMarkStopCompleted = async (stopId: string) => {
    try {
      await markStopCompleted(driverId, stopId);
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
    } catch (error) {
      toast.error("Failed to mark stop as completed");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={loadInitialData} className="mt-4">
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
                <Map driverId={driverId} />
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
                    {Array.isArray(assignedStudents) &&
                      assignedStudents?.map((student) => (
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
                    {currentRoute?.stops?.map((stop) => (
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
                {currentRoute?.stops?.map((stop, index) => (
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
                {Array.isArray(assignedStudents) &&
                  assignedStudents?.map((student) => (
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
