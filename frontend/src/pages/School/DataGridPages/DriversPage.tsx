import { useState, useEffect } from "react";
import DataGridTemplatePage from "../../../components/DataGridTemplatePage";
import { GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useSchoolStore } from "@/stores/school.store";

// **Zod Validation Schema**
const driverSchema = z.object({
  driverEmail: z.string().email("Invalid email address"),
});

// Form schema for creating/editing a driver
const driverFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  licenseNumber: z.string().min(5, "License number must be at least 5 characters"),
  vehicleType: z.string().optional(),
});

// **Form Data Type**
type DriverFormData = z.infer<typeof driverSchema>;
type DriverFullFormData = z.infer<typeof driverFormSchema>;

const DriversPage = () => {
  // Get store methods and state
  const { 
    drivers, 
    loading, 
    error, 
    getAllDrivers, 
    createDriver, 
    updateDriver, 
    deleteDriver, 
    assignDriverUsingEmail 
  } = useSchoolStore();
  
  // Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);

  // **React Hook Form for assigning driver**
  const {
    register,
    handleSubmit,
    reset: resetAssignForm,
    formState: { errors: assignErrors, isSubmitting: isAssignSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    mode: "onChange",
  });

  // React Hook Form for creating/editing driver
  const {
    register: registerDriverForm,
    handleSubmit: handleDriverFormSubmit,
    reset: resetDriverForm,
    setValue,
    formState: { errors: driverFormErrors, isSubmitting: isDriverFormSubmitting },
  } = useForm<DriverFullFormData>({
    resolver: zodResolver(driverFormSchema),
    mode: "onChange",
  });

  // Load drivers on component mount
  useEffect(() => {
    getAllDrivers();
  }, [getAllDrivers]);

  // **Submit Handler for assigning driver**
  const onAssignSubmit = async (data: DriverFormData) => {
    try {
      await assignDriverUsingEmail(data);
      toast.success("Driver assigned successfully!");
      setIsAssignModalOpen(false);
      resetAssignForm();
      await getAllDrivers(); // Refresh drivers list after adding
    } catch (error) {
      toast.error("Failed to assign driver");
      console.error(error);
    }
  };

  // Submit handler for creating a new driver
  const onCreateSubmit = async (data: DriverFullFormData) => {
    try {
      await createDriver({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber ? [data.phoneNumber] : undefined,
        licenseNumber: data.licenseNumber,
        vehicleType: data.vehicleType,
      });
      toast.success("Driver created successfully!");
      setIsCreateModalOpen(false);
      resetDriverForm();
      await getAllDrivers(); // Refresh drivers list
    } catch (error) {
      toast.error("Failed to create driver");
      console.error(error);
    }
  };

  // Submit handler for editing a driver
  const onEditSubmit = async (data: DriverFullFormData) => {
    if (!selectedDriver?._id) return;
    
    try {
      await updateDriver(selectedDriver._id, {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber ? [data.phoneNumber] : undefined,
        licenseNumber: data.licenseNumber,
        vehicleType: data.vehicleType,
      });
      toast.success("Driver updated successfully!");
      setIsEditModalOpen(false);
      resetDriverForm();
      await getAllDrivers(); // Refresh drivers list
    } catch (error) {
      toast.error("Failed to update driver");
      console.error(error);
    }
  };

  // Handle opening the edit modal
  const handleOpenEditModal = (id: string) => {
    const driver = Array.isArray(drivers) 
      ? drivers.find((d) => d._id === id)
      : null;
    
    if (driver) {
      setSelectedDriver(driver);
      
      // Set form values
      setValue("name", driver.userId?.name || "");
      setValue("email", driver.userId?.email || "");
      setValue("phoneNumber", driver.userId?.phoneNumber?.[0] || "");
      setValue("licenseNumber", driver.licenseNumber || "");
      setValue("vehicleType", driver.vehicleType || "");
      
      setIsEditModalOpen(true);
    } else {
      toast.error("Driver not found");
    }
  };

  // Handle opening the create modal
  const handleOpenCreateModal = () => {
    resetDriverForm();
    setIsCreateModalOpen(true);
  };

  // **Columns for DataGrid**
  const columns: GridColDef[] = [
    { field: "name", headerName: "Driver Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    { field: "licenseNumber", headerName: "License Number", width: 150 },
    { field: "vehicleType", headerName: "Vehicle Type", width: 150 },
    { field: "status", headerName: "Status", width: 100 },
  ];

  // Transform data for the DataGrid
  const transformDrivers = () => {
    if (!drivers || !Array.isArray(drivers)) return [];

    return drivers.map((driver) => ({
      id: driver._id,
      name: driver.userId?.name || "N/A",
      email: driver.userId?.email || "N/A",
      phoneNumber: driver.userId?.phoneNumber?.[0] || "N/A",
      licenseNumber: driver.licenseNumber || "N/A",
      vehicleType: driver.vehicleType || "N/A",
      status: driver.status || "inactive",
    }));
  };

  const transformedDrivers = transformDrivers();

  // Show loading state
  if (loading) return <div className="p-4">Loading drivers...</div>;
  
  // Show error state
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      {/* DataGrid for displaying drivers */}
      <DataGridTemplatePage
        title="Drivers"
        columns={columns}
        rows={transformedDrivers}
        handleAdd={() => {
          const buttons = [
            {
              label: "Create New Driver",
              onClick: handleOpenCreateModal,
            },
            {
              label: "Assign Existing Driver",
              onClick: () => setIsAssignModalOpen(true),
            },
          ];
          // Show both options to the user
          return (
            <div className="flex flex-col gap-2">
              {buttons.map((button, index) => (
                <Button 
                  key={index}
                  variant="contained"
                  onClick={button.onClick}
                  sx={{
                    backgroundColor: "#F7B32B",
                    color: "black",
                    "&:hover": { backgroundColor: "#e6a027" },
                  }}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          );
        }}
        handleExport={() => console.log("Export Drivers")}
        handleEdit={(id) => handleOpenEditModal(String(id))}
        handleDelete={async (id) => {
          try {
            await deleteDriver(String(id));
            toast.success("Driver deleted successfully");
            await getAllDrivers();
          } catch (error) {
            toast.error("Failed to delete driver");
            console.error(error);
          }
        }}
        searchPlaceholder="Search drivers..."
      />

      {/* Modal for Assigning Existing Driver */}
      <Modal
        open={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        aria-labelledby="assign-modal-title"
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
          <Typography id="assign-modal-title" variant="h6" mb={2}>
            Assign Existing Driver
          </Typography>

          <form onSubmit={handleSubmit(onAssignSubmit)}>
            <TextField
              fullWidth
              label="Driver Email"
              {...register("driverEmail")}
              error={!!assignErrors.driverEmail}
              helperText={assignErrors.driverEmail?.message}
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
              disabled={isAssignSubmitting}
            >
              {isAssignSubmitting ? "Submitting..." : "Assign Driver"}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Modal for Creating New Driver */}
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
            Create New Driver
          </Typography>

          <form onSubmit={handleDriverFormSubmit(onCreateSubmit)}>
            <TextField
              fullWidth
              label="Name"
              {...registerDriverForm("name")}
              error={!!driverFormErrors.name}
              helperText={driverFormErrors.name?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              {...registerDriverForm("email")}
              error={!!driverFormErrors.email}
              helperText={driverFormErrors.email?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              {...registerDriverForm("phoneNumber")}
              error={!!driverFormErrors.phoneNumber}
              helperText={driverFormErrors.phoneNumber?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="License Number"
              {...registerDriverForm("licenseNumber")}
              error={!!driverFormErrors.licenseNumber}
              helperText={driverFormErrors.licenseNumber?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Vehicle Type"
              {...registerDriverForm("vehicleType")}
              error={!!driverFormErrors.vehicleType}
              helperText={driverFormErrors.vehicleType?.message}
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
              disabled={isDriverFormSubmitting}
            >
              {isDriverFormSubmitting ? "Creating..." : "Create Driver"}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Modal for Editing Driver */}
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
            Edit Driver
          </Typography>

          <form onSubmit={handleDriverFormSubmit(onEditSubmit)}>
            <TextField
              fullWidth
              label="Name"
              {...registerDriverForm("name")}
              error={!!driverFormErrors.name}
              helperText={driverFormErrors.name?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              {...registerDriverForm("email")}
              error={!!driverFormErrors.email}
              helperText={driverFormErrors.email?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone Number"
              {...registerDriverForm("phoneNumber")}
              error={!!driverFormErrors.phoneNumber}
              helperText={driverFormErrors.phoneNumber?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="License Number"
              {...registerDriverForm("licenseNumber")}
              error={!!driverFormErrors.licenseNumber}
              helperText={driverFormErrors.licenseNumber?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Vehicle Type"
              {...registerDriverForm("vehicleType")}
              error={!!driverFormErrors.vehicleType}
              helperText={driverFormErrors.vehicleType?.message}
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
              disabled={isDriverFormSubmitting}
            >
              {isDriverFormSubmitting ? "Updating..." : "Update Driver"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default DriversPage;
