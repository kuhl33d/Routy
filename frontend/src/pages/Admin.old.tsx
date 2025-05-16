import React,{ useState, useEffect } from "react";
import { ChartArea, Plus, School, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SmartSidebar from "@/components/SmartSidebar";
import { FaMoneyBillWave } from "react-icons/fa";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useAdminStore } from "@/stores/admin.store";
import { toast } from "react-hot-toast";
import { TotalReport,SystemState,User } from "@/types/admin.types";

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7B32B]"></div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const {
    totalReport,
    systemState,
    users,
    loading,
    getTotalReport,
    getSystemState,
    getAllUsers,
    updateUser,
    // safeDeleteUser,
  } = useAdminStore();

  // Schools Tab Component
  // function SchoolsTab() {
  //   const [searchTerm, setSearchTerm] = useState("");
  //   const [page, setPage] = useState(1);
  //   const [limit, setLimit] = useState(10);

  //   useEffect(() => {
  //     getAllUsers({ role: "school", page, limit });
  //   }, [page, limit]);

  //   const handleApprove = async (userId: string) => {
  //     try {
  //       await updateUser({
  //         userId,
  //         updateData: { status: "active" as const },
  //       });
  //       toast.success("School status updated successfully");
  //     } catch (error) {
  //       toast.error("Failed to update school status");
  //     }
  //   };

  //   const filteredSchools = users.filter((school) =>
  //     school.name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  //   return (
  //     <div>
  //       <div className="flex justify-between items-center mb-6">
  //         <h2 className="text-2xl font-bold">Schools</h2>
  //         <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
  //           <Plus className="mr-2 h-4 w-4" />
  //           Add a school
  //         </Button>
  //       </div>
  //       <div className="space-y-4">
  //         <Input
  //           placeholder="Search schools"
  //           className="max-w-md bg-background"
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //         />
  //         {loading ? (
  //           <LoadingSpinner />
  //         ) : (
  //           <Table>
  //             <TableHeader>
  //               <TableRow className="hover:bg-gray-50">
  //                 <TableHead>Name</TableHead>
  //                 <TableHead>City</TableHead>
  //                 <TableHead>State</TableHead>
  //                 <TableHead>Country</TableHead>
  //                 <TableHead>Status</TableHead>
  //                 <TableHead>Action</TableHead>
  //               </TableRow>
  //             </TableHeader>
  //             <TableBody>
  //               {filteredSchools.map((school) => (
  //                 <TableRow key={school._id} className="hover:bg-gray-50">
  //                   <TableCell>{school.name}</TableCell>
  //                   <TableCell>{school.city}</TableCell>
  //                   <TableCell>{school.state}</TableCell>
  //                   <TableCell>{school.country}</TableCell>
  //                   <TableCell>
  //                     <Badge
  //                       className={
  //                         school.status === "active"
  //                           ? "bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
  //                           : ""
  //                       }
  //                     >
  //                       {school.status}
  //                     </Badge>
  //                   </TableCell>
  //                   <TableCell>
  //                     <Button
  //                       variant="ghost"
  //                       size="sm"
  //                       onClick={() => handleApprove(school._id)}
  //                     >
  //                       Approve/Reject
  //                     </Button>
  //                   </TableCell>
  //                 </TableRow>
  //               ))}
  //             </TableBody>
  //           </Table>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }
  
  function SchoolsTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const { users: schools, loading, getAllSchools, updateSchool } = useAdminStore();

     const fetchSchools = async () => {
      try {
        const response = await getAllSchools({ page, limit });
        
        if (response) {
          setTotalPages(response.totalPages || 1);
          setTotalItems(response.total || 0);
          setError(null);
        }
      } catch (error: any) {
        if (error.message === 'Unauthorized') {
          window.location.href = '/login';
          return;
        }
        setError(error.message || "Failed to fetch schools");
        toast.error(error.message || "Failed to fetch schools");
      }
    };

    useEffect(() => {
      fetchSchools();
    }, [page, limit]);
  
    const handleApprove = async (schoolId: string) => {
      try {
        await updateSchool({
          schoolId,
          updateData: { status: "active" as const },
        });
        fetchSchools(); // Refresh the list after update
        toast.success("School status updated successfully");
      } catch (error: any) {
        if (error.message === 'Unauthorized') {
          window.location.href = '/login';
          return;
        }
        toast.error("Failed to update school status");
      }
    };

    const filteredSchools = schools.filter((school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    const handlePageChange = (newPage: number) => {
      setPage(newPage);
    };
  
    const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
    };
  
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(startIndex + limit - 1, totalItems);

    if (error) {
      return (
        <div className="p-4 text-red-500">
          {error}
          <Button
            onClick={fetchSchools}
            className="ml-4"
          >
            Retry
          </Button>
        </div>
      );
    }
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Schools</h2>
          <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add a school
          </Button>
        </div>
  
        {/* Search and Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search schools"
              className="bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border rounded p-1 text-sm bg-background"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>
        </div>
  
        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No schools found
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchools.map((school) => (
                  <TableRow key={school._id} className="hover:bg-gray-50">
                    <TableCell>{school.name}</TableCell>
                    <TableCell>{school.city}</TableCell>
                    <TableCell>{school.state}</TableCell>
                    <TableCell>{school.country}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          school.status === "active"
                            ? "bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
                            : "bg-gray-200 text-gray-700"
                        }
                      >
                        {school.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(school._id)}
                      >
                        {school.status === "active" ? "Suspend" : "Approve"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
  
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex} to {endIndex} of {totalItems} entries
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={page === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (pageNum) =>
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= page - 1 && pageNum <= page + 1)
                      )
                      .map((pageNum, index, array) => (
                        <React.Fragment key={pageNum}>
                          {index > 0 && array[index - 1] !== pageNum - 1 && (
                            <span className="px-2">...</span>
                          )}
                          <Button
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={
                              page === pageNum
                                ? "bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
                                : ""
                            }
                          >
                            {pageNum}
                          </Button>
                        </React.Fragment>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={page === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Pricing Tab Component
  function PricingTab() {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Pricing</h2>
          <div className="space-x-4">
            <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
              <Plus className="mr-2 h-4 w-4" />
              Create plan
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import from CSV
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Search plans"
            className="max-w-md bg-background"
          />
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-50">
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Renewal date</TableHead>
                <TableHead>Subscribers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "Starter",
                  price: "$0.00",
                  renewal: "12/15/21",
                  subscribers: "1",
                },
                {
                  name: "Basic",
                  price: "$49.00",
                  renewal: "12/15/21",
                  subscribers: "2",
                },
                {
                  name: "Pro",
                  price: "$99.00",
                  renewal: "12/15/21",
                  subscribers: "3",
                },
                {
                  name: "Enterprise",
                  price: "$399.00",
                  renewal: "12/15/21",
                  subscribers: "5",
                },
              ].map((plan) => (
                <TableRow key={plan.name} className="hover:bg-gray-50">
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.price}</TableCell>
                  <TableCell>{plan.renewal}</TableCell>
                  <TableCell>
                    <Button variant="link" className="text-[#F7B32B]">
                      View ({plan.subscribers})
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Admins Tab Component
  function AdminsTab() {
    const [error, setError] = useState<string | null>(null);
    const [admins, setAdmins] = useState<User[]>([]);
    
    const fetchAdmins = async () => {
      try {
        const response = await getAllUsers({ role: "admin" });
        if (response?.data) {
          setAdmins(response.data);
          setError(null);
        }
      } catch (error: any) {
        if (error.message === 'Unauthorized') {
          window.location.href = '/login';
          return;
        }
        setError("Failed to fetch admins");
        toast.error("Failed to fetch admins");
      }
    };
  
    useEffect(() => {
      fetchAdmins();
    }, []);

    const handleSuspend = async (userId: string) => {
      try {
        await updateUser({
          userId,
          updateData: { status: "suspended" as const },
        });
        fetchAdmins();
        toast.success("Admin suspended successfully");
      } catch (error: any) {
        if (error.message === 'Unauthorized') {
          window.location.href = '/login';
          return;
        }
        toast.error("Failed to suspend admin");
      }
    };

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admins</h2>
          <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add admin
          </Button>
        </div>
        <div className="space-y-4">
          <Input
            placeholder="Search by email"
            className="max-w-md bg-background"
          />
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-gray-50">
                  <TableHead>Email</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((admin) => (
                  <TableRow key={admin._id} className="hover:bg-gray-50">
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.lastLogin || "Never"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleSuspend(admin._id)}
                      >
                        Suspend
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    );
  }

  // Insights Tab Component
  function useDashboardData() {
    const { getTotalReport, getSystemState } = useAdminStore();
    const [data, setData] = useState<{
      stats: TotalReport['stats'] | null;
      overview: SystemState | null;
    }>({
      stats: null,
      overview: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    // Use useRef to track if the component is mounted
    const isMounted = useRef(true);
  
    // Use useCallback to memoize the fetch function
    const fetchDashboardData = useCallback(async () => {
      if (!isMounted.current) return;
      
      setIsLoading(true);
      setError(null);
  
      try {
        const [statsResponse, overviewResponse] = await Promise.all([
          getTotalReport(),
          getSystemState()
        ]);
  
        if (!isMounted.current) return;
  
        setData({
          stats: statsResponse.stats,
          overview: overviewResponse
        });
      } catch (err: any) {
        if (!isMounted.current) return;
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    }, [getTotalReport, getSystemState]);
  
    useEffect(() => {
      // Set up cleanup function
      return () => {
        isMounted.current = false;
      };
    }, []);
  
    useEffect(() => {
      fetchDashboardData();
    }, [fetchDashboardData]);
  
    return { data, isLoading, error, refetch: fetchDashboardData };
  }
  function InsightsTab() {
    const { data, isLoading, error, refetch } = useDashboardData();
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={refetch}
            className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
          >
            Retry
          </Button>
        </div>
      );
    }
  
    const { stats, overview } = data;
  
    return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Here's your summary for{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Total Parents", value: stats?.totalParents },
            { title: "Total Drivers", value: stats?.totalDrivers },
            { title: "Total Schools", value: stats?.totalSchools },
            { title: "Total Buses", value: stats?.totalBuses },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <CardDescription className="text-2xl font-bold">
                  {stat.value || 0}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
  
        {/* Overview Section */}
        {overview && (
          <>
            {/* Active Routes & Buses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Routes</CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    {overview.activeRoutes?.length || 0}
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Buses</CardTitle>
                  <CardDescription className="text-2xl font-bold">
                    {overview.activeBuses?.length || 0}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
  
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {overview.recentAlerts?.length > 0 ? (
                    overview.recentAlerts.map((alert: any, index: number) => (
                      <div
                        key={alert._id || index}
                        className="p-3 bg-background rounded-lg border"
                      >
                        <p>{alert.message}</p>
                        {alert.createdAt && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(alert.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">
                      No recent alerts
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
  }
  
  // Sidebar items
  const sidebarItems = [
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
      isActive: activeItem === "Dashboard",
    },
    {
      icon: <School />,
      label: "Schools",
      isActive: activeItem === "Schools",
    },
    {
      icon: <FaMoneyBillWave />,
      label: "Pricing",
      isActive: activeItem === "Pricing",
    },
    {
      icon: <AdminPanelSettingsIcon />,
      label: "Admins",
      isActive: activeItem === "Admins",
    },
    {
      icon: <ChartArea />,
      label: "Insights",
      isActive: activeItem === "Insights",
    },
  ];

  
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <div className="w-64">
        <SmartSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          image="https://th.bing.com/th/id/R.634e09920fd52502ecf8f57b22d71af9?rik=VfxeQcZ9k%2fbzWw&pid=ImgRaw&r=0"
          title="Admin Dashboard"
          items={sidebarItems}
        />
      </div>
      <div className="flex-1 p-8">
        {activeItem === "Dashboard" && <InsightsTab />}
        {activeItem === "Schools" && <SchoolsTab />}
        {activeItem === "Pricing" && <PricingTab />}
        {activeItem === "Admins" && <AdminsTab />}
        {activeItem === "Insights" && <InsightsTab />}
      </div>
    </div>
  );
}