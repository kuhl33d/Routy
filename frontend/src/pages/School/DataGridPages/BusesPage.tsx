import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DataGridTemplatePage from "@/components/DataGridTemplatePage";
import { GridColDef } from "@mui/x-data-grid";
import { Modal, Box, TextField, Typography, Button } from "@mui/material";
import { useSchoolStore } from "@/stores/school.store";
import { useBusStore } from "@/stores/bus.store";

// **Zod Validation Schema**
const busSchema = z.object({
  busNumber: z.string().min(1, "Bus number is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

// **Form Data Type**
type BusFormData = z.infer<typeof busSchema>;

type TransformedBus = {
  id: string;
  BusNumber: string;
  Capacity: number;
};

const BusesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [transformedBuses, setTransformedBuses] = useState<TransformedBus[]>(
    []
  );

  const { getAllBuses, buses, currentSchool } = useSchoolStore();
  const { createBus, deleteBus } = useBusStore();

  useEffect(() => {
    getAllBuses();
  }, [getAllBuses]);

  useEffect(() => {
    if (buses && Array.isArray(buses)) {
      setTransformedBuses(
        buses.map((bus) => ({
          id: bus._id ?? "",
          BusNumber: bus.busNumber ?? "Unknown",
          Capacity: bus.capacity ?? 0,
        }))
      );
    }
  }, [buses]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusFormData>({
    resolver: zodResolver(busSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: BusFormData) => {
    await createBus({
      ...data,
      schoolId: currentSchool?._id,
      driverId: "",
      routeId: "",
      currentPassengers: 0,
      currentLocation: { latitude: 0, longitude: 0 },
    });

    console.log("Bus Details Submitted:", data);
    setOpen(false);
    reset();
    getAllBuses();
  };

  const columns: GridColDef[] = [
    { field: "BusNumber", headerName: "Bus Number", width: 150 },
    { field: "Capacity", headerName: "Capacity", width: 120 },
  ];

  return (
    <div>
      <DataGridTemplatePage
        title="Buses"
        columns={columns}
        rows={transformedBuses}
        handleAdd={() => setOpen(true)}
        handleExport={() => console.log("Export Buses")}
        handleEdit={(id) => console.log(`Edit Bus with id: ${id}`)}
        handleDelete={async (id) => {
          await deleteBus(String(id));
          getAllBuses();
        }}
        searchPlaceholder="Search buses..."
      />

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
            Add Bus Details
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Bus Number"
              {...register("busNumber")}
              error={!!errors.busNumber}
              helperText={errors.busNumber?.message}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Capacity"
              {...register("capacity", { valueAsNumber: true })}
              error={!!errors.capacity}
              helperText={errors.capacity?.message}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 2, width: "100%", backgroundColor: "#F7B32B" }}
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

export default BusesPage;
