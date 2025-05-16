import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DataGridTemplatePage from "@/components/DataGridTemplatePage";
import { GridColDef } from "@mui/x-data-grid";
import { Modal, Box, TextField, Typography, Button } from "@mui/material";
import { useRouteStore } from "@/stores/route.store";
import { useSchoolStore } from "@/stores/school.store";

const routeSchema = z.object({
  name: z.string().min(3, "Route name must have at least 3 characters"),
});

type RouteFormData = z.infer<typeof routeSchema>;

const RoutesPage = () => {
  const { createRoute, deleteRoute } = useRouteStore();
  const { currentSchool, getAllRoutes, routes } = useSchoolStore();
  const [open, setOpen] = useState(false);
  const [transformedRoutes, setTransformedRoutes] = useState<
    { id: string; route: string; bus: string; stops: number; status: string }[]
  >([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RouteFormData>({
    resolver: zodResolver(routeSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: RouteFormData) => {
    await createRoute({ ...data, schoolId: currentSchool?._id });
    setOpen(false);
    reset();
    getAllRoutes();
  };

  useEffect(() => {
    getAllRoutes();
  }, [getAllRoutes]);

  useEffect(() => {
    if (routes && Array.isArray(routes)) {
      setTransformedRoutes(
        routes.map((route) => ({
          id: route._id ?? "",
          route: route.name ?? "Unnamed Route",
          bus: route.buses?.length ? route.buses[0].busNumber : "No buses",
          stops: route.stops?.length ?? 0,
          status: "Active",
        }))
      );
    }
  }, [routes]);

  const columns: GridColDef[] = [
    { field: "route", headerName: "Route", width: 120 },
    { field: "bus", headerName: "Bus", width: 100 },
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

  return (
    <div>
      <DataGridTemplatePage
        title="Routes"
        columns={columns}
        rows={transformedRoutes}
        handleAdd={() => setOpen(true)}
        handleExport={() => console.log("Export Routes")}
        handleEdit={(id) => console.log(`Edit Route with id: ${id}`)}
        handleDelete={async (id) => {
          await deleteRoute(String(id));
          getAllRoutes();
        }}
        searchPlaceholder="Search routes..."
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
            Add Route Details
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Route Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
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

export default RoutesPage;
