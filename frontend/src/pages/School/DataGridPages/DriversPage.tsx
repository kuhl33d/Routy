import { useState, useEffect } from "react";
import DataGridTemplatePage from "../../../components/DataGridTemplatePage";
import { GridColDef } from "@mui/x-data-grid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { useSchoolStore } from "@/stores/school.store";
import { useDriverStore } from "@/stores/driver.store";
// **Zod Validation Schema**
const driverSchema = z.object({
  driverEmail: z.string().email("Invalid email address"),
});

// **Form Data Type**
type DriverFormData = z.infer<typeof driverSchema>;

const DriversPage = () => {
  // const { createDriver } = useDriverStore();
  const { drivers, getAllDrivers, assignDriverUsingEmail } = useSchoolStore();
  const { deleteDriver } = useDriverStore();
  const [open, setOpen] = useState(false);

  // **React Hook Form**
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    mode: "onChange",
  });

  // **Submit Handler**
  const onSubmit = async (data) => {
    try {
      await assignDriverUsingEmail(data);
      toast.success("Driver added successfully!");
      setOpen(false);
      reset();
      await getAllDrivers(); // Refresh drivers list after adding
    } catch (error) {
      toast.error("Failed to add driver");
      console.error(error);
    }
  };

  useEffect(() => {
    getAllDrivers();
  }, [getAllDrivers]);

  // **Columns for DataGrid**
  const columns: GridColDef[] = [
    { field: "name", headerName: "Driver Name", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
  ];
  const transformRoutes = () => {
    if (!drivers || !Array.isArray(drivers)) return [];

    return drivers.map((driver) => ({
      id: driver._id,
      name: driver.userId.name,
      email: driver.userId.email,
      status: driver.userId.active ? "Active" : "Inactive",
    }));
  };

  const transformedDrivers = transformRoutes();

  return (
    <div>
      {/* DataGrid for displaying drivers */}
      <DataGridTemplatePage
        title="Drivers"
        columns={columns}
        rows={transformedDrivers}
        handleAdd={() => setOpen(true)}
        handleExport={() => console.log("Export Drivers")}
        handleEdit={(id) => console.log(`Edit Driver with id: ${id}`)}
        handleDelete={async (id) => {
          await deleteDriver(String(id));
          getAllDrivers();
        }}
        searchPlaceholder="Search drivers..."
      />

      {/* MUI Modal for Adding Driver */}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
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
          }}
        >
          <Typography id="modal-title" variant="h6">
            Add Driver Details
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Driver Email"
              {...register("driverEmail")}
              error={!!errors.driverEmail}
              helperText={errors.driverEmail?.message}
              margin="normal"
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 2,
                width: "100%",
                backgroundColor: "#F7B32B",
                "&:hover": { backgroundColor: "#e6a027" },
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default DriversPage;
