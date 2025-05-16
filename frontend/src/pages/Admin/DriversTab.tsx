// src/components/DriversTab.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Edit2 } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDriverStore } from "@/stores/driver.store";
import { Driver, CreateDriverDTO } from "@/types/driver.types";

const DriversTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const { drivers, loading, getAllDrivers, updateDriver, createDriver } =
    useDriverStore();

  // Fetch drivers on mount
  const fetchDrivers = useCallback(async () => {
    try {
      await getAllDrivers(); 
    } catch (err: unknown) {
      if (err instanceof Error) toast.error("Failed to fetch drivers");
    }
  }, [getAllDrivers]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Suspend a driver
  const handleSuspend = async (driverId: string) => {
    try {
      // mark the driver inactive
      await updateDriver(driverId, { isActive: false });
      toast.success("Driver suspended successfully");
      await fetchDrivers();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error("Failed to suspend driver");
    }
  };
  console.log("drivers", drivers)

  // Create a new driver
  const handleCreateDriver = async (formData: FormData) => {
    try {
      const phoneNumberValue = formData.get("phoneNumber") as string | null;
      const dto: CreateDriverDTO = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phoneNumber: phoneNumberValue ? [phoneNumberValue] : undefined,
        licenseNumber: formData.get("licenseNumber") as string,
        vehicleType: formData.get("vehicleType") as string,
      };
      await createDriver(dto);
      setIsCreateModalOpen(false);
      toast.success("Driver created successfully");
      await fetchDrivers();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message || "Failed to create driver");
    }
  };

  // Edit a driver
  const handleEditDriver = async (formData: FormData) => {
    try {
      if (!selectedDriver?._id) return;

      const phoneNumberValue = formData.get("phoneNumber") as string | null;
      const dto: Partial<CreateDriverDTO> = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phoneNumber: phoneNumberValue ? [phoneNumberValue] : undefined,
        licenseNumber: formData.get("licenseNumber") as string,
        vehicleType: formData.get("vehicleType") as string,
      };

      // Only include password if it's provided and non-empty
      const password = formData.get("password") as string;
      if (password && password.trim() !== "") {
        dto.password = password;
      }

      await updateDriver(selectedDriver._id, dto);
      setIsEditModalOpen(false);
      toast.success("Driver updated successfully");
      await fetchDrivers();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message || "Failed to update driver");
    }
  };

  // Open edit modal and set selected driver
  const handleOpenEditModal = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditModalOpen(true);
  };

  // Filter in-memory by email
  const filteredDrivers = useMemo(
    () =>
      drivers.filter((d) =>
        d?.email?.toLowerCase().includes(searchTerm?.toLowerCase())
      ),
    [drivers, searchTerm]
  );

  // The form inside the Add Driver dialog
  const DriverForm: React.FC<{ onSubmit: (fd: FormData) => Promise<void> }> = ({
    onSubmit,
  }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Driver Name</label>
        <Input name="name" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input name="password" type="password" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number (Optional)</label>
        <Input name="phoneNumber" type="tel" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">License Number</label>
        <Input name="licenseNumber" required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehicle Type</label>
        <Input name="vehicleType" required />
      </div>
      <Button type="submit" className="w-full">
        Create Driver
      </Button>
    </form>
  );

  // The form inside the Edit Driver dialog
  const DriverEditForm: React.FC<{ 
    onSubmit: (fd: FormData) => Promise<void>;
    driver: Driver;
  }> = ({
    onSubmit,
    driver
  }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <label className="text-sm font-medium">Driver Name</label>
        <Input name="name" defaultValue={driver.userId?.name || ""} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input name="email" type="email" defaultValue={driver.userId?.email || ""} required />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password (leave empty to keep current)</label>
        <Input name="password" type="password" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <Input 
          name="phoneNumber" 
          type="tel" 
          defaultValue={driver.userId?.phoneNumber?.[0] || ""}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">License Number</label>
        <Input 
          name="licenseNumber" 
          defaultValue={driver.licenseNumber || ""} 
          required 
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Vehicle Type</label>
        <Input 
          name="vehicleType" 
          defaultValue={driver.vehicleType || ""} 
          required 
        />
      </div>
      <Button type="submit" className="w-full">
        Update Driver
      </Button>
    </form>
  );

  return (
    <div>
      {/* Header with Add button and search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Drivers</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by email"
            className="max-w-xs bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog
            open={isCreateModalOpen}
            onOpenChange={setIsCreateModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90 flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>
              <DriverForm onSubmit={handleCreateDriver} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner />
      ) : 

      /* Empty state */
      drivers.length === 0 ? (
        <div className="text-center py-16">
          <p className="mb-4 text-lg text-muted-foreground">
            No drivers found. Click below to add your first driver.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Driver
          </Button>
        </div>
      ) : (

      /* Table of drivers */
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
          {drivers.map((driver) => (
            <TableRow key={driver._id}>
              <TableCell>{driver.userId?.email}</TableCell>
              <TableCell>{driver.userId?.name}</TableCell>
              <TableCell>
                {driver.userId?.lastLogin
                  ? new Date(driver.userId?.lastLogin).toLocaleDateString()
                  : "Never"}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                     driver.userId?.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {driver.userId?.active ? "active" : "not active"}
                </Badge>
              </TableCell>
              <TableCell className="space-x-2">
                {/* Edit */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenEditModal(driver)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                {/* Suspend */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleSuspend(driver._id)}
                  disabled={driver.status === "suspended"}
                >
                  Suspend
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}

      {/* Edit Driver Modal */}
      {selectedDriver && (
        <Dialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Driver</DialogTitle>
            </DialogHeader>
            <DriverEditForm 
              onSubmit={handleEditDriver} 
              driver={selectedDriver} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DriversTab;
