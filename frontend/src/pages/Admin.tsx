import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ChartArea, Plus, Upload, School as Sch , Edit2, Trash2, Search, Eye } from "lucide-react";
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
import { 
  TotalReport, 
  SystemState, 
  SubscriptionPlan,
  School
} from "@/types/admin.types";
import { useAuth } from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
// Components
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F7B32B]"></div>
    </div>
  );
}


// Tab Components
function InsightsTab() {
  const [stats, setStats] = useState<TotalReport['stats'] | null>(null);
  const [overview, setOverview] = useState<SystemState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getTotalReport, getSystemState } = useAdminStore();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
      if (!isAuthenticated) {
          return;
      }

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
  }, [getTotalReport, getSystemState, isAuthenticated]);
  
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Get store actions and state
  const { 
      schools, 
      loading, 
      error,
      getAllSchools, 
      updateSchool,
  } = useAdminStore();

  // Default values helper
  const getDefaultSchoolValues = (school: Partial<School>) => ({
      status: school.status || 'inactive',
      city: school.city || 'Not specified',
      state: school.state || 'Not specified',
      country: school.country || 'Not specified'
  });

  // Fetch schools on mount and when pagination changes
  useEffect(() => {
      fetchSchools();
  }, [page, limit]);

  const fetchSchools = async () => {
    try {
        await getAllSchools();
    } catch (error: any) {
        toast.error(error.message || 'Failed to fetch schools');
    }
};

  // Filter schools based on search term
  const filteredSchools = useMemo(() => {
    if (!Array.isArray(schools)) {
        console.warn('Schools is not an array:', schools);
        return [];
    }
    return schools.filter(school => 
        school.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (school.city || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [schools, searchTerm]);

  // Status update handler
  const handleStatusUpdate = async (schoolId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
      try {
          await updateSchool({
              schoolId,
              updateData: { status: newStatus }
          });
          toast.success(`School ${newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
          fetchSchools();
      } catch (error: any) {
          toast.error(error.message || `Failed to update school status`);
      }
  };

  // Create school handler
  const handleCreateSchool = async (formData: FormData) => {
    try {
        const schoolData: Partial<School> = {
            userId: {
                _id: '', // This will be generated by the backend
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                addresses: [] // Initialize empty addresses array
            },
            city: formData.get('city') as string,
            state: formData.get('state') as string,
            country: formData.get('country') as string,
            status: 'inactive' as const
        };

        await updateSchool({ 
            schoolId: '', // New school, no ID yet
            updateData: schoolData 
        });
        setIsCreateModalOpen(false);
        toast.success('School created successfully');
        fetchSchools();
    } catch (error: any) {
        toast.error(error.message || 'Failed to create school');
    }
};

  // School Form Component
  const SchoolForm = ({ 
      onSubmit, 
      initialData 
  }: { 
      onSubmit: (formData: FormData) => Promise<void>;
      initialData?: School | null;
  }) => {
      return (
          <form onSubmit={(e) => {
              e.preventDefault();
              onSubmit(new FormData(e.currentTarget));
          }} 
          className="space-y-4"
          >
              <div className="space-y-2">
                  <label className="text-sm font-medium">School Name</label>
                  <Input 
                      name="name" 
                      defaultValue={initialData?.userId?.name}
                      required 
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Email</label>
                  <Input 
                      name="email" 
                      type="email"
                      defaultValue={initialData?.userId?.email}
                      required 
                  />
              </div>
              {/* <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input 
                      name="phoneNumber" 
                      type="tel"
                      defaultValue={initialData?.userId?.phoneNumber?.[0]}
                  />
              </div> */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input 
                          name="city"
                          defaultValue={initialData?.city}
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Input 
                          name="state"
                          defaultValue={initialData?.state}
                      />
                  </div>
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Input 
                      name="country"
                      defaultValue={initialData?.country}
                  />
              </div>
              <Button type="submit" className="w-full">
                  {initialData ? 'Update School' : 'Create School'}
              </Button>
          </form>
      );
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => (
      <Badge
          className={
              status === "active"
                  ? "bg-green-100 text-green-800"
                  : status === "suspended"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
          }
      >
          {status}
      </Badge>
  );

  // School Details Dialog
  const SchoolDetailsDialog = ({ school }: { school: School }) => {
      const defaults = getDefaultSchoolValues(school);
      
      return (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>{school.userId?.name || 'School Details'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                      <div>
                          <h3 className="font-medium">Location</h3>
                          <p>{school.city || defaults.city}</p>
                          <p>{school.state || defaults.state}</p>
                          <p>{school.country || defaults.country}</p>
                      </div>
                      <div>
                          <h3 className="font-medium">Contact</h3>
                          <p>Email: {school.userId?.email}</p>
                          {/* <p>Phone: {school.userId?.phoneNumber?.[0] || 'Not provided'}</p> */}
                      </div>
                      <div>
                          <h3 className="font-medium">Status</h3>
                          <StatusBadge status={school.status || defaults.status} />
                      </div>
                      <div>
                          <h3 className="font-medium">Buses</h3>
                          <p>{school.buses?.length || 0} buses registered</p>
                      </div>
                  </div>
              </DialogContent>
          </Dialog>
      );
  };

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
          {/* Header */}
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Schools</h2>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                      <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
                          <Plus className="mr-2 h-4 w-4" />
                          Add School
                      </Button>
                  </DialogTrigger>
                  <DialogContent>
                      <DialogHeader>
                          <DialogTitle>Add New School</DialogTitle>
                      </DialogHeader>
                      <SchoolForm onSubmit={handleCreateSchool} />
                  </DialogContent>
              </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-md">
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                          placeholder="Search schools..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-background"
                      />
                  </div>
              </div>
              <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <select
                      value={limit}
                      onChange={(e) => {
                          setLimit(Number(e.target.value));
                          setPage(1);
                      }}
                      className="border rounded p-1 text-sm bg-background"
                  >
                      {[10, 20, 50, 100].map((value) => (
                          <option key={value} value={value}>{value}</option>
                      ))}
                  </select>
                  <span className="text-sm text-gray-500">entries</span>
              </div>
          </div>

          {/* Schools Table */}
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
                              <TableHead>School Name</TableHead>
                              <TableHead>Admin Email</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Buses</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredSchools.map((school) => {
                              const defaults = getDefaultSchoolValues(school);
                              
                              return (
                                  <TableRow key={school._id}>
                                      <TableCell className="font-medium">
                                          {school.userId?.name || 'Unnamed School'}
                                      </TableCell>
                                      <TableCell>
                                          {school.userId?.email || 'No email provided'}
                                      </TableCell>
                                      <TableCell>
                                          <div className="flex flex-col">
                                              <span>{school.city || defaults.city}</span>
                                              <span className="text-sm text-gray-500">
                                                  {school.state || defaults.state}
                                              </span>
                                          </div>
                                      </TableCell>
                                      <TableCell>
                                          <Badge variant="outline">
                                              {school.buses?.length || 0} buses
                                          </Badge>
                                      </TableCell>
                                      <TableCell>
                                          <StatusBadge status={school.status || defaults.status} />
                                      </TableCell>
                                      <TableCell>
                                          <div className="flex space-x-2">
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                      setSelectedSchool(school);
                                                      setIsDetailsOpen(true);
                                                  }}
                                              >
                                                  <Eye className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => {
                                                      setSelectedSchool(school);
                                                      setIsEditOpen(true);
                                                  }}
                                              >
                                                  <Edit2 className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  onClick={() => handleStatusUpdate(
                                                      school._id,
                                                      school.status === 'active' ? 'suspended' : 'active'
                                                  )}
                                              >
                                                  {school.status === 'active' ? 'Suspend' : 'Activate'}
                                              </Button>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                              );
                          })}
                      </TableBody>
                  </Table>
              </div>
          )}

          {/* Pagination */}
          {filteredSchools.length > 0 && (
              <div className="flex items-center justify-between py-4">
                  <div className="text-sm text-gray-500">
                      Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, filteredSchools.length)} of {filteredSchools.length} entries
                  </div>
                  <div className="flex items-center space-x-2">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                      >
                          First
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                      >
                          Previous
                      </Button>
                      <span className="text-sm text-gray-500">
                          Page {page} of {Math.ceil(filteredSchools.length / limit)}
                      </span>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(p => p + 1)}
                          disabled={page >= Math.ceil(filteredSchools.length / limit)}
                      >
                          Next
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(Math.ceil(filteredSchools.length / limit))}
                          disabled={page >= Math.ceil(filteredSchools.length / limit)}
                      >
                          Last
                      </Button>
                  </div>
              </div>
          )}

          {/* Modals */}
          {selectedSchool && (
              <>
                  <SchoolDetailsDialog school={selectedSchool} />
                  
                  <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Edit School</DialogTitle>
                          </DialogHeader>
                          <SchoolForm 
                              initialData={selectedSchool}
                              onSubmit={async (formData) => {
                                try {
                                    await updateSchool({
                                        schoolId: selectedSchool._id,
                                        updateData: {
                                            userId: {
                                                _id: selectedSchool.userId._id, // Keep the existing _id
                                                name: formData.get('name') as string,
                                                email: formData.get('email') as string,
                                                addresses: selectedSchool.userId.addresses // Keep existing addresses
                                            },
                                            city: formData.get('city') as string,
                                            state: formData.get('state') as string,
                                            country: formData.get('country') as string
                                        }
                                    });
                                    setIsEditOpen(false);
                                    toast.success('School updated successfully');
                                    fetchSchools();
                                } catch (error: any) {
                                    toast.error(error.message || 'Failed to update school');
                                }
                            }}
                          />
                      </DialogContent>
                  </Dialog>
              </>
          )}
      </div>
  );
}

function PricingTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
      plans, 
      plansLoading, 
      plansError, 
      getAllPlans, 
      createPlan, 
      updatePlan,
      importPlans 
  } = useAdminStore();

  // Initial load
  useEffect(() => {
      getAllPlans().catch(error => {
          toast.error(`Failed to load plans ${error.message || ""}`);
      });
  }, [getAllPlans]);

  // Create plan handler
  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      
      try {
          const planData = {
              name: formData.get('name') as string,
              price: Number(formData.get('price')),
              renewalPeriod: Number(formData.get('renewalPeriod')),
              description: formData.get('description') as string,
              features: (formData.get('features') as string)
                  .split(',')
                  .map(feature => feature.trim())
                  .filter(Boolean)
          };

          await createPlan(planData);
          setIsCreateModalOpen(false);
          toast.success('Plan created successfully');
          getAllPlans(); // Refresh the list
      } catch (error: any) {
          toast.error(error.message || 'Failed to create plan');
      }
  };

  // Edit plan handler
  const handleEditPlan = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!selectedPlan) return;

      const formData = new FormData(e.currentTarget);
      
      try {
          const updates = {
              name: formData.get('name') as string,
              price: Number(formData.get('price')),
              renewalPeriod: Number(formData.get('renewalPeriod')),
              description: formData.get('description') as string,
              features: (formData.get('features') as string)
                  .split(',')
                  .map(feature => feature.trim())
                  .filter(Boolean)
          };

          await updatePlan(selectedPlan._id, updates);
          setIsEditModalOpen(false);
          setSelectedPlan(null);
          toast.success('Plan updated successfully');
          getAllPlans(); // Refresh the list
      } catch (error: any) {
          toast.error(error.message || 'Failed to update plan');
      }
  };

  // Import handler
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
          await importPlans(file);
          toast.success('Plans imported successfully');
          getAllPlans(); // Refresh the list
      } catch (error: any) {
          toast.error(error.message || 'Failed to import plans');
      } finally {
          if (fileInputRef.current) {
              fileInputRef.current.value = '';
          }
      }
  };

  // Filtered plans
  const filteredPlans = useMemo(() => {
      return plans.filter(plan =>
          plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [plans, searchTerm]);

  // Plan Form Component
  const PlanForm = ({ onSubmit, initialData = null }: { 
      onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
      initialData?: SubscriptionPlan | null 
  }) => (
      <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
              <label className="text-sm font-medium">Plan Name</label>
              <Input 
                  name="name" 
                  defaultValue={initialData?.name}
                  placeholder="Enter plan name" 
                  required 
              />
          </div>

          <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input 
                  name="price" 
                  type="number" 
                  defaultValue={initialData?.price}
                  placeholder="Enter price" 
                  min="0" 
                  step="0.01" 
                  required 
              />
          </div>

          <div className="space-y-2">
              <label className="text-sm font-medium">Renewal Period (days)</label>
              <Input 
                  name="renewalPeriod" 
                  type="number" 
                  defaultValue={initialData?.renewalPeriod}
                  placeholder="Enter renewal period" 
                  min="1" 
                  required 
              />
          </div>

          <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                  name="description" 
                  defaultValue={initialData?.description}
                  placeholder="Enter description" 
              />
          </div>

          <div className="space-y-2">
              <label className="text-sm font-medium">Features (comma-separated)</label>
              <Input 
                  name="features" 
                  defaultValue={initialData?.features?.join(', ')}
                  placeholder="Enter features" 
              />
          </div>

          <Button type="submit" className="w-full">
              {initialData ? 'Update Plan' : 'Create Plan'}
          </Button>
      </form>
  );

  if (plansLoading) {
      return <LoadingSpinner />;
  }

  if (plansError) {
      return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{plansError}</p>
              <Button
                  onClick={() => getAllPlans()}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                  Retry
              </Button>
          </div>
      );
  }

  return (
      <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Subscription Plans</h2>
              <div className="space-x-4">
                  <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                      <DialogTrigger asChild>
                          <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
                              <Plus className="mr-2 h-4 w-4" />
                              Create Plan
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Create New Plan</DialogTitle>
                          </DialogHeader>
                          <PlanForm onSubmit={handleCreatePlan} />
                      </DialogContent>
                  </Dialog>

                  <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImport}
                      accept=".csv,.xlsx"
                      className="hidden"
                  />
                  <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                  >
                      <Upload className="mr-2 h-4 w-4" />
                      Import Plans
                  </Button>
              </div>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                  placeholder="Search plans..."
                  className="max-w-md bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          {/* Plans Table */}
          <div className="rounded-md border">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Plan Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Period</TableHead>
                          <TableHead>Subscribers</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {filteredPlans.map((plan) => (
                          <TableRow key={plan._id}>
                              <TableCell className="font-medium">
                                  {plan.name}
                                  {plan.description && (
                                      <p className="text-sm text-gray-500">{plan.description}</p>
                                  )}
                              </TableCell>
                              <TableCell>${plan.price.toFixed(2)}</TableCell>
                              <TableCell>{plan.renewalPeriod} days</TableCell>
                              <TableCell>
                                  <Badge variant="outline">
                                      {plan.subscriberCount} subscribers
                                  </Badge>
                              </TableCell>
                              <TableCell>
                                  <Badge className="bg-green-100 text-green-800">
                                      Active
                                  </Badge>
                              </TableCell>
                              <TableCell>
                                  <div className="flex space-x-2">
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                              setSelectedPlan(plan);
                                              setIsEditModalOpen(true);
                                          }}
                                      >
                                          <Edit2 className="h-4 w-4" />
                                      </Button>
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500"
                                          onClick={() => {
                                              // Handle delete
                                              toast.error('Delete functionality not implemented');
                                          }}
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

          {/* Edit Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogContent>
                  <DialogHeader>
                      <DialogTitle>Edit Plan</DialogTitle>
                  </DialogHeader>
                  <PlanForm 
                      onSubmit={handleEditPlan} 
                      initialData={selectedPlan} 
                  />
              </DialogContent>
          </Dialog>
      </div>
  );
}

function AdminsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const { 
      users, 
      loading, 
      getAllUsers, 
      updateUser 
  } = useAdminStore();

  const fetchAdmins = useCallback(async () => {
      try {
          await getAllUsers({ role: "admin" });
      } catch (error: any) {
          toast.error("Failed to fetch admins");
      }
  }, [getAllUsers]);

  useEffect(() => {
      fetchAdmins();
  }, [fetchAdmins]);

  const handleSuspend = async (userId: string) => {
      try {
          await updateUser({
              userId,
              updateData: { status: "suspended" }
          });
          await fetchAdmins(); // Refresh the list
          toast.success("Admin suspended successfully");
      } catch (error: any) {
          toast.error("Failed to suspend admin");
      }
  };

  const filteredAdmins = useMemo(() => {
      return users.filter(user => 
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [users, searchTerm]);

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              {loading ? (
                  <LoadingSpinner />
              ) : (
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Email</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Last Login</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredAdmins.map((admin) => (
                              <TableRow key={admin._id}>
                                  <TableCell>{admin.email}</TableCell>
                                  <TableCell>{admin.name}</TableCell>
                                  <TableCell>
                                      {admin.lastLogin 
                                          ? new Date(admin.lastLogin).toLocaleDateString()
                                          : "Never"
                                      }
                                  </TableCell>
                                  <TableCell>
                                      <Badge
                                          className={
                                              admin.status === "active"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-red-100 text-red-800"
                                          }
                                      >
                                          {admin.status || "active"}
                                      </Badge>
                                  </TableCell>
                                  <TableCell>
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-red-500"
                                          onClick={() => handleSuspend(admin._id)}
                                          disabled={admin.status === "suspended"}
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

// Main Component
export default function AdminDashboard() {
  const { isAuthenticated } = useAuth();
  const [activeItem, setActiveItem] = useState("Dashboard");

  useEffect(() => {
      if (!isAuthenticated) {
          console.log("Redirecting to login...");
          window.location.href = '/login';
      }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
      return null;
  }

  const sidebarItems = [
      {
          icon: <ChartArea />,
          label: "Dashboard",
          isActive: activeItem === "Dashboard",
      },
      {
          icon: <Sch />,
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

  const renderActiveTab = () => {
      switch (activeItem) {
          case "Dashboard":
              return (
                  <ErrorBoundary fallback={<div>Error loading dashboard</div>}>
                      <InsightsTab />
                  </ErrorBoundary>
              );
          case "Schools":
              return (
                  <ErrorBoundary fallback={<div>Error loading schools</div>}>
                      <SchoolsTab />
                  </ErrorBoundary>
              );
          case "Pricing":
              return (
                  <ErrorBoundary fallback={<div>Error loading pricing</div>}>
                      <PricingTab />
                  </ErrorBoundary>
              );
          case "Admins":
              return (
                  <ErrorBoundary fallback={<div>Error loading admins</div>}>
                      <AdminsTab />
                  </ErrorBoundary>
              );
          default:
              return null;
      }
  };

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
              <ErrorBoundary>
                  {renderActiveTab()}
              </ErrorBoundary>
          </div>
      </div>
  );
}