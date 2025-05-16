import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DataGridTemplatePage from "@/components/DataGridTemplatePage";
import { GridColDef } from "@mui/x-data-grid";
import { Modal, Box, TextField, Typography, Button } from "@mui/material";
import { useSchoolStore } from "@/stores/school.store";
import { toast } from "react-hot-toast";

// Schema for route form validation
const routeSchema = z.object({
  name: z.string().min(3, "Route name must have at least 3 characters"),
  description: z.string().optional(),
  startLocation: z.string().optional(),
  endLocation: z.string().optional(),
});

// Form data type
type RouteFormData = z.infer<typeof routeSchema>;

// Transformed route type for the grid
type TransformedRoute = {
  id: string;
  route: string;
  description?: string;
  bus: string;
  stops: number;
  status: string;
};

const RoutesPage = () => {
  // State management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const [transformedRoutes, setTransformedRoutes] = useState<TransformedRoute[]>([]);
  
  // Get store methods
  const { 
    currentSchool, 
    getAllRoutes, 
    routes, 
    loading, 
    error,
    createRoute,
    updateRoute,
    deleteRoute,
    getAllBuses,
    buses
  } = useSchoolStore();
  
  // Form for creating a route
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors, isSubmitting: isCreateSubmitting },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    mode: "onChange",
  });
  
  // Form for editing a route
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setValue,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    mode: "onChange",
  });

  // Fetch routes and buses on component mount
  useEffect(() => {
    const fetchData = async () => {
      await getAllRoutes();
      await getAllBuses();
    };
    fetchData();
  }, [getAllRoutes, getAllBuses]);

  // Transform routes data for the grid whenever routes or buses change
  useEffect(() => {
    if (routes && Array.isArray(routes)) {
      setTransformedRoutes(
        routes.map((route) => {
          // Get associated bus
          const routeBuses = Array.isArray(buses) 
            ? buses.filter(bus => bus.routeId === route._id)
            : [];
          
          const busDisplay = routeBuses.length 
            ? routeBuses.map(b => b.busNumber).join(", ")
            : "No buses";
          
          return {
            id: route._id ?? "",
            route: route.name ?? "Unnamed Route",
            description: route.description ?? "",
            bus: busDisplay,
            stops: route.stops?.length ?? 0,
            status: route.status ?? "Active",
          };
        })
      );
    }
  }, [routes, buses]);

  // Handle create route submission
  const onCreateSubmit = async (data: RouteFormData) => {
    try {
      await createRoute({ 
        ...data, 
        schoolId: currentSchool?._id,
        status: "Active",
        stops: []
      });
      toast.success("Route created successfully");
      setIsCreateModalOpen(false);
      resetCreateForm();
      await getAllRoutes();
    } catch (error) {
      console.error("Error creating route:", error);
      toast.error("Failed to create route");
    }
  };

  // Handle edit route submission
  const onEditSubmit = async (data: RouteFormData) => {
    if (!selectedRoute?.id) return;
    
    try {
      await updateRoute(selectedRoute.id, {
        ...data,
        schoolId: currentSchool?._id,
      });
      toast.success("Route updated successfully");
      setIsEditModalOpen(false);
      resetEditForm();
      await getAllRoutes();
    } catch (error) {
      console.error("Error updating route:", error);
      toast.error("Failed to update route");
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = (id: string) => {
    const route = transformedRoutes.find(r => r.id === id);
    if (route) {
      setSelectedRoute(route);
      
      // Find the original route data to get all fields
      const originalRoute = Array.isArray(routes) 
        ? routes.find(r => r._id === id)
        : null;
      
      if (originalRoute) {
        setValue("name", originalRoute.name || "");
        setValue("description", originalRoute.description || "");
        setValue("startLocation", originalRoute.startLocation || "");
        setValue("endLocation", originalRoute.endLocation || "");
      }
      
      setIsEditModalOpen(true);
    } else {
      toast.error("Route not found");
    }
  };

  // Grid columns configuration
  const columns: GridColDef[] = [
    { field: "route", headerName: "Route Name", width: 180 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "bus", headerName: "Assigned Buses", width: 150 },
    { field: "stops", headerName: "Stops", width: 100 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            params.value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
  ];

  // Loading state
  if (loading) return <div className="p-4">Loading routes...</div>;
  
  // Error state
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <DataGridTemplatePage
        title="Routes"
        columns={columns}
        rows={transformedRoutes}
        handleAdd={() => setIsCreateModalOpen(true)}
        handleExport={() => console.log("Export Routes")}
        handleEdit={(id) => handleOpenEditModal(String(id))}
        handleDelete={async (id) => {
          try {
            await deleteRoute(String(id));
            toast.success("Route deleted successfully");
            await getAllRoutes();
          } catch (error) {
            console.error("Error deleting route:", error);
            toast.error("Failed to delete route");
          }
        }}
        searchPlaceholder="Search routes..."
      />

      {/* Create Route Modal */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        aria-labelledby="create-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="create-modal-title" variant="h6" mb={2}>
            Add New Route
          </Typography>
          <form onSubmit={handleCreateSubmit(onCreateSubmit)}>
            <TextField
              fullWidth
              label="Route Name"
              {...registerCreate("name")}
              error={!!createErrors.name}
              helperText={createErrors.name?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              {...registerCreate("description")}
              error={!!createErrors.description}
              helperText={createErrors.description?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Location"
              {...registerCreate("startLocation")}
              error={!!createErrors.startLocation}
              helperText={createErrors.startLocation?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="End Location"
              {...registerCreate("endLocation")}
              error={!!createErrors.endLocation}
              helperText={createErrors.endLocation?.message}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                width: "100%",
                backgroundColor: "#F7B32B",
                color: "black",
                "&:hover": { backgroundColor: "#e6a027" },
              }}
              disabled={isCreateSubmitting}
            >
              {isCreateSubmitting ? "Creating..." : "Create Route"}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Edit Route Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        aria-labelledby="edit-modal-title"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography id="edit-modal-title" variant="h6" mb={2}>
            Edit Route: {selectedRoute?.route}
          </Typography>
          <form onSubmit={handleEditSubmit(onEditSubmit)}>
            <TextField
              fullWidth
              label="Route Name"
              {...registerEdit("name")}
              error={!!editErrors.name}
              helperText={editErrors.name?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              {...registerEdit("description")}
              error={!!editErrors.description}
              helperText={editErrors.description?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Start Location"
              {...registerEdit("startLocation")}
              error={!!editErrors.startLocation}
              helperText={editErrors.startLocation?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="End Location"
              {...registerEdit("endLocation")}
              error={!!editErrors.endLocation}
              helperText={editErrors.endLocation?.message}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                width: "100%",
                backgroundColor: "#F7B32B",
                color: "black",
                "&:hover": { backgroundColor: "#e6a027" },
              }}
              disabled={isEditSubmitting}
            >
              {isEditSubmitting ? "Updating..." : "Update Route"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default RoutesPage;
