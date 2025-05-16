import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DataGridTemplatePage from "@/components/DataGridTemplatePage";
import { GridColDef } from "@mui/x-data-grid";
import { Modal, Box, TextField, Typography, Button } from "@mui/material";
import { useSchoolStore } from "@/stores/school.store";
import { toast } from "react-hot-toast";

// **Zod Validation Schema**
const busSchema = z.object({
  busNumber: z.string().min(1, "Bus number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  routeId: z.string().optional(),
  driverId: z.string().optional(),
});

// **Form Data Type**
type BusFormData = z.infer<typeof busSchema>;

type TransformedBus = {
  id: string;
  BusNumber: string;
  Capacity: number;
  DriverName?: string;
  RouteName?: string;
  Status?: string;
  Passengers?: number;
};

const BusesPage: React.FC = () => {
  // State management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [transformedBuses, setTransformedBuses] = useState<TransformedBus[]>([]);

  // Get store operations
  const { 
    getAllBuses, 
    buses, 
    loading, 
    error,
    currentSchool, 
    createBus, 
    updateBus, 
    deleteBus,
    getAllDrivers,
    getAllRoutes,
    drivers,
    routes
  } = useSchoolStore();

  // Fetch buses, drivers and routes on component mount
  useEffect(() => {
    const fetchData = async () => {
      await getAllBuses();
      await getAllDrivers();
      await getAllRoutes();
    };
    fetchData();
  }, [getAllBuses, getAllDrivers, getAllRoutes]);

  // Transform buses data for the grid whenever buses, drivers, or routes change
  useEffect(() => {
    if (buses && Array.isArray(buses)) {
      setTransformedBuses(
        buses.map((bus) => {
          // Find associated driver
          const driver = Array.isArray(drivers) 
            ? drivers.find(d => d._id === bus.driverId) 
            : undefined;
          
          // Find associated route
          const route = Array.isArray(routes) 
            ? routes.find(r => r._id === bus.routeId) 
            : undefined;
          
          return {
            id: bus._id ?? "",
            BusNumber: bus.busNumber ?? "Unknown",
            Capacity: bus.capacity ?? 0,
            DriverName: driver?.userId?.name ?? "Not Assigned",
            RouteName: route?.name ?? "Not Assigned",
            Status: bus.status ?? "Inactive",
            Passengers: bus.currentPassengers ?? 0
          };
        })
      );
    }
  }, [buses, drivers, routes]);

  // Form for creating a new bus
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreateForm,
    formState: { errors: createErrors, isSubmitting: isCreateSubmitting },
  } = useForm<BusFormData>({
    resolver: zodResolver(busSchema),
    mode: "onChange",
  });

  // Form for editing a bus
  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    setValue,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<BusFormData>({
    resolver: zodResolver(busSchema),
    mode: "onChange",
  });

  // Handle create bus submission
  const onCreateSubmit = async (data: BusFormData) => {
    try {
      await createBus({
        ...data,
        schoolId: currentSchool?._id,
        currentPassengers: 0,
        currentLocation: { latitude: 0, longitude: 0 },
        status: "Active",
      });

      toast.success("Bus created successfully");
      setIsCreateModalOpen(false);
      resetCreateForm();
      await getAllBuses();
    } catch (error) {
      console.error("Error creating bus:", error);
      toast.error("Failed to create bus");
    }
  };

  // Handle edit bus submission
  const onEditSubmit = async (data: BusFormData) => {
    if (!selectedBus?.id) return;
    
    try {
      await updateBus(selectedBus.id, {
        ...data,
        schoolId: currentSchool?._id,
      });

      toast.success("Bus updated successfully");
      setIsEditModalOpen(false);
      resetEditForm();
      await getAllBuses();
    } catch (error) {
      console.error("Error updating bus:", error);
      toast.error("Failed to update bus");
    }
  };

  // Handle opening edit modal
  const handleOpenEditModal = (id: string) => {
    const bus = transformedBuses.find(b => b.id === id);
    if (bus) {
      setSelectedBus(bus);
      
      // Find the original bus data to get all fields
      const originalBus = Array.isArray(buses) 
        ? buses.find(b => b._id === id)
        : null;
      
      if (originalBus) {
        setValue("busNumber", originalBus.busNumber || "");
        setValue("capacity", originalBus.capacity || 0);
        setValue("driverId", originalBus.driverId || "");
        setValue("routeId", originalBus.routeId || "");
      }
      
      setIsEditModalOpen(true);
    } else {
      toast.error("Bus not found");
    }
  };

  // Grid columns configuration
  const columns: GridColDef[] = [
    { field: "BusNumber", headerName: "Bus Number", width: 150 },
    { field: "Capacity", headerName: "Capacity", width: 120 },
    { field: "DriverName", headerName: "Driver", width: 180 },
    { field: "RouteName", headerName: "Route", width: 180 },
    { field: "Status", headerName: "Status", width: 120 },
    { field: "Passengers", headerName: "Passengers", width: 120 },
  ];

  // Loading state
  if (loading) return <div className="p-4">Loading buses...</div>;
  
  // Error state
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <DataGridTemplatePage
        title="Buses"
        columns={columns}
        rows={transformedBuses}
        handleAdd={() => setIsCreateModalOpen(true)}
        handleExport={() => console.log("Export Buses")}
        handleEdit={(id) => handleOpenEditModal(String(id))}
        handleDelete={async (id) => {
          try {
            await deleteBus(String(id));
            toast.success("Bus deleted successfully");
            await getAllBuses();
          } catch (error) {
            console.error("Error deleting bus:", error);
            toast.error("Failed to delete bus");
          }
        }}
        searchPlaceholder="Search buses..."
      />

      {/* Create Bus Modal */}
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
            Add New Bus
          </Typography>
          <form onSubmit={handleCreateSubmit(onCreateSubmit)}>
            <TextField
              fullWidth
              label="Bus Number"
              {...registerCreate("busNumber")}
              error={!!createErrors.busNumber}
              helperText={createErrors.busNumber?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Capacity"
              {...registerCreate("capacity", { valueAsNumber: true })}
              error={!!createErrors.capacity}
              helperText={createErrors.capacity?.message}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Driver"
              {...registerCreate("driverId")}
              error={!!createErrors.driverId}
              helperText={createErrors.driverId?.message}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Not Assigned</option>
              {Array.isArray(drivers) && drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.userId?.name || "Unknown Driver"}
                </option>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Route"
              {...registerCreate("routeId")}
              error={!!createErrors.routeId}
              helperText={createErrors.routeId?.message}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Not Assigned</option>
              {Array.isArray(routes) && routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.name || "Unknown Route"}
                </option>
              ))}
            </TextField>
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
              {isCreateSubmitting ? "Creating..." : "Create Bus"}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Edit Bus Modal */}
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
            Edit Bus: {selectedBus?.BusNumber}
          </Typography>
          <form onSubmit={handleEditSubmit(onEditSubmit)}>
            <TextField
              fullWidth
              label="Bus Number"
              {...registerEdit("busNumber")}
              error={!!editErrors.busNumber}
              helperText={editErrors.busNumber?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Capacity"
              {...registerEdit("capacity", { valueAsNumber: true })}
              error={!!editErrors.capacity}
              helperText={editErrors.capacity?.message}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Driver"
              {...registerEdit("driverId")}
              error={!!editErrors.driverId}
              helperText={editErrors.driverId?.message}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Not Assigned</option>
              {Array.isArray(drivers) && drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.userId?.name || "Unknown Driver"}
                </option>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Route"
              {...registerEdit("routeId")}
              error={!!editErrors.routeId}
              helperText={editErrors.routeId?.message}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Not Assigned</option>
              {Array.isArray(routes) && routes.map((route) => (
                <option key={route._id} value={route._id}>
                  {route.name || "Unknown Route"}
                </option>
              ))}
            </TextField>
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
              {isEditSubmitting ? "Updating..." : "Update Bus"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default BusesPage;
