import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChartArea, Plus, Upload, School, Edit2, Trash2, Search } from "lucide-react";
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
import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import SmartSidebar from "@/components/SmartSidebar";
import { FaMoneyBillWave } from "react-icons/fa";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useAdminStore } from "@/stores/admin.store";
import { toast } from "react-hot-toast";
import { TotalReport, SystemState } from "@/types/admin.types";

// Components
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7B32B]"></div>
    </div>
  );
}

// Custom Hook for Dashboard Data
// function useDashboardData() {
//   const { getTotalReport, getSystemState } = useAdminStore();
//   const [data, setData] = useState<{
//     stats: TotalReport['stats'] | null;
//     overview: SystemState | null;
//   }>({
//     stats: null,
//     overview: null,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const isMounted = useRef(true);

//   const fetchDashboardData = useCallback(async () => {
//     if (!isMounted.current) return;
    
//     setIsLoading(true);
//     setError(null);

//     try {
//       const [statsResponse, overviewResponse] = await Promise.all([
//         getTotalReport(),
//         getSystemState()
//       ]);

//       if (!isMounted.current) return;

//       setData({
//         stats: statsResponse.stats,
//         overview: overviewResponse
//       });
//     } catch (err: any) {
//       if (!isMounted.current) return;
//       console.error('Dashboard fetch error:', err);
//       setError('Failed to load dashboard data');
//     } finally {
//       if (isMounted.current) {
//         setIsLoading(false);
//       }
//     }
//   }, [getTotalReport, getSystemState]);

//   useEffect(() => {
//     fetchDashboardData();
//     return () => {
//       isMounted.current = false;
//     };
//   }, [fetchDashboardData]);

//   return { data, isLoading, error, refetch: fetchDashboardData };
// }

// Tab Components

function InsightsTab() {
    const [stats, setStats] = useState<TotalReport['stats'] | null>(null);
    const [overview, setOverview] = useState<SystemState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getTotalReport, getSystemState } = useAdminStore();
  
    useEffect(() => {
      async function fetchData() {
        try {
          setIsLoading(true);
          console.log("Fetching dashboard data...");
  
          // Fetch stats
          const statsResponse = await getTotalReport();
          console.log("Stats response:", statsResponse);
          if (statsResponse?.success) {
            setStats(statsResponse.stats);
          }
  
          // Fetch overview
          const overviewResponse = await getSystemState();
          console.log("Overview response:", overviewResponse);
          setOverview(overviewResponse);
  
          setError(null);
        } catch (err: any) {
          console.error("Error fetching dashboard data:", err);
          setError(err.message || "Failed to load dashboard data");
        } finally {
          setIsLoading(false);
        }
      }
  
      fetchData();
    }, [getTotalReport, getSystemState]);
  
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
            onClick={() => window.location.reload()}
            className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
          >
            Retry
          </Button>
        </div>
      );
    }
  
    return (
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Parents
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                {stats?.totalParents || 0}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Drivers
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                {stats?.totalDrivers || 0}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Schools
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                {stats?.totalSchools || 0}
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total Buses
              </CardTitle>
              <CardDescription className="text-2xl font-bold">
                {stats?.totalBuses || 0}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
  
        {/* Overview Cards */}
        {overview && (
          <>
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
                {overview.recentAlerts?.length > 0 ? (
                  <div className="space-y-2">
                    {overview.recentAlerts.map((alert) => (
                      <div
                        key={alert._id}
                        className="p-3 bg-background rounded-lg border"
                      >
                        <p>{alert.message}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No recent alerts
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    );
}

function SchoolsTab() {
    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [error, setError] = useState<string | null>(null);
  
    // Get store actions and state
    const { 
      schools, 
      loading, 
      getAllSchools, 
      updateSchool 
    } = useAdminStore();
  
    // Fetch schools function
    const fetchSchools = useCallback(async () => {
      try {
        console.log('Fetching schools:', { page, limit });
        const response = await getAllSchools({ page, limit });
        
        console.log('Schools response:', response);
        
        if (response) {
          setTotalPages(response.totalPages || 1);
          setTotalItems(response.total || 0);
          setError(null);
        }
      } catch (error: any) {
        console.error('Error fetching schools:', error);
        setError(error.message || "Failed to fetch schools");
        toast.error(error.message || "Failed to fetch schools");
      }
    }, [page, limit, getAllSchools]);
  
    // Initial fetch and pagination updates
    useEffect(() => {
      fetchSchools();
    }, [fetchSchools]);
  
    // Debug logs
    useEffect(() => {
      console.log('Current state:', {
        schools,
        loading,
        error,
        page,
        limit,
        totalPages,
        totalItems
      });
    }, [schools, loading, error, page, limit, totalPages, totalItems]);
  
    // Handlers
    const handleApprove = async (schoolId: string) => {
      try {
        await updateSchool({
          schoolId,
          updateData: { status: "active" as const },
        });
        await fetchSchools(); // Refresh the list after update
        toast.success("School status updated successfully");
      } catch (error: any) {
        console.error('Error updating school:', error);
        toast.error("Failed to update school status");
      }
    };
  
    const handlePageChange = (newPage: number) => {
      setPage(newPage);
    };
  
    const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
    };
  
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   setSearchTerm(event.target.value);
      setPage(1); // Reset to first page when searching
    };
  
    // Filtered schools
    const filteredSchools = useMemo(() => {
      return schools.filter((school) =>
        school._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [schools, searchTerm]);
  
    // Pagination calculations
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(startIndex + limit - 1, totalItems);
  
    // Error state
    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchSchools}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        {/* Debug Panel (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-gray-100 rounded-md text-sm">
            <h3 className="font-bold mb-2">Debug Info:</h3>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify({
                schoolsCount: schools.length,
                // filteredCount: filteredSchools.length,
                page,
                limit,
                totalPages,
                totalItems,
                loading,
                error
              }, null, 2)}
            </pre>
          </div>
        )}
  
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Schools</h2>
          <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
            <Plus className="mr-2 h-4 w-4" />
            Add a school
          </Button>
        </div>
  
        {/* Search and Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search schools..."
            //   value={searchTerm}
              onChange={handleSearch}
              className="bg-background"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="border rounded p-1 text-sm bg-background"
            >
              {[10, 20, 50, 100].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <span className="text-sm text-gray-500">entries</span>
          </div>
        </div>
  
        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredSchools.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No schools found
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableRow key={school._id}>
                    <TableCell className="font-medium">{school.name}</TableCell>
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
          </div>
        )}
  
        {/* Pagination */}
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
    );
}

function PricingTab() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { 
      plans, 
      plansLoading, 
      plansError, 
      getAllPlans, 
      createPlan, 
      importPlans 
    } = useAdminStore();
  
    useEffect(() => {
      getAllPlans().catch(error => {
        toast.error(error.message);
      });
    }, [getAllPlans]);
  
    const handleCreatePlan = async (formData: FormData) => {
      try {
        const planData = {
          name: formData.get('name') as string,
          price: Number(formData.get('price')),
          renewalPeriod: Number(formData.get('renewalPeriod')),
          description: formData.get('description') as string,
        };
        
        await createPlan(planData);
        setIsCreateModalOpen(false);
        toast.success('Plan created successfully');
      } catch (error: any) {
        toast.error(error.message);
      }
    };
  
    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      try {
        await importPlans(file);
        toast.success('Plans imported successfully');
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
  
    const filteredPlans = plans.filter(plan =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    if (plansLoading) {
      return <div className="flex justify-center items-center h-64">Loading...</div>;
    }
  
    if (plansError) {
      return (
        <div className="text-red-500 p-4">
          Error: {plansError}
          <Button onClick={() => getAllPlans()} className="ml-4">
            Retry
          </Button>
        </div>
      );
    }
  
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Pricing</h2>
          <div className="space-x-4">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Create plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Plan</DialogTitle>
                </DialogHeader>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleCreatePlan(new FormData(e.currentTarget));
                }}>
                  <div className="space-y-4">
                    <Input name="name" placeholder="Plan name" required />
                    <Input 
                      name="price" 
                      type="number" 
                      placeholder="Price" 
                      min="0" 
                      step="0.01" 
                      required 
                    />
                    <Input 
                      name="renewalPeriod" 
                      type="number" 
                      placeholder="Renewal period (days)" 
                      min="1" 
                      required 
                    />
                    <Input 
                      name="description" 
                      placeholder="Description" 
                    />
                    <Button type="submit">Create Plan</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".csv"
              className="hidden"
            />
            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import from CSV
            </Button>
          </div>
        </div>
  
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search plans"
              className="max-w-md bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
  
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Renewal Period</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>${plan.price.toFixed(2)}</TableCell>
                  <TableCell>{plan.renewalPeriod} days</TableCell>
                  <TableCell>
                    <Button variant="link" className="text-[#F7B32B]">
                      View ({plan.subscriberCount})
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Handle edit */}}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => {/* Handle delete */}}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
}

// Main Component
export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  
  const sidebarItems = [
    {
      icon: <ChartArea />,
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
        {/* {activeItem === "Admins" && <AdminsTab />} */}
      </div>
    </div>
  );
}