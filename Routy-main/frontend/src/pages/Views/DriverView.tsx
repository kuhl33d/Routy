import React, { useEffect, useState } from "react";
import { useDriverStore } from "@/stores/driver.store";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/stores/user.store";

const DriverView: React.FC = () => {
  const {
    drivers,
    getAllDrivers,
    createDriver,
    updateDriver,
    startRoute,
    deleteDriver,
  } = useDriverStore();
  const { login } = useUserStore();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [driverData, setDriverData] = useState({
    name: "",
    email: "",
    phoneNumber: [""],
    licenseNumber: "",
    vehicleType: "",
    password: "123456",
  });

  useEffect(() => {
    login({ email: "1@admin.com", password: "123456" });
    getAllDrivers();
  }, [getAllDrivers, login]);

  const handleAddDriver = async () => {
    await createDriver(driverData);
    setAddModalOpen(false);
    toast.success("Driver added successfully");
  };

  const handleUpdateDriver = async () => {
    if (!selectedDriver) return;
    await updateDriver(selectedDriver._id, driverData);
    setUpdateModalOpen(false);
    toast.success("Driver updated successfully");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Drivers Management</h1>
      <Button onClick={() => setAddModalOpen(true)}>Add Driver</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>License</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow key={driver._id}>
              <TableCell>{driver.userId.name}</TableCell>
              <TableCell>{driver.userId.email}</TableCell>
              <TableCell>{driver.userId.phoneNumber.join(", ")}</TableCell>
              <TableCell>{driver.licenseNumber}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setSelectedDriver(driver);
                    setUpdateModalOpen(true);
                  }}
                >
                  Update
                </Button>
                <Button onClick={() => startRoute(driver._id)}>
                  Start Route
                </Button>
                <Button onClick={() => deleteDriver(driver._id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Driver</h2>
            <input
              placeholder="Name"
              onChange={(e) =>
                setDriverData({ ...driverData, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              onChange={(e) =>
                setDriverData({ ...driverData, email: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              onChange={(e) =>
                setDriverData({ ...driverData, phoneNumber: [e.target.value] })
              }
            />
            <input
              placeholder="License"
              onChange={(e) =>
                setDriverData({ ...driverData, licenseNumber: e.target.value })
              }
            />
            <input
              placeholder="Vehicle Type"
              onChange={(e) =>
                setDriverData({ ...driverData, vehicleType: e.target.value })
              }
            />
            <Button onClick={handleAddDriver}>Save</Button>
            <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Update Driver Modal */}
      {isUpdateModalOpen && selectedDriver && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Driver</h2>
            <input
              placeholder="Name"
              defaultValue={selectedDriver.userId.name}
              onChange={(e) =>
                setDriverData({ ...driverData, name: e.target.value })
              }
            />
            <input
              placeholder="Email"
              defaultValue={selectedDriver.userId.email}
              onChange={(e) =>
                setDriverData({ ...driverData, email: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              defaultValue={selectedDriver.userId.phoneNumber[0]}
              onChange={(e) =>
                setDriverData({ ...driverData, phoneNumber: [e.target.value] })
              }
            />
            <input
              placeholder="License"
              defaultValue={selectedDriver.licenseNumber}
              onChange={(e) =>
                setDriverData({ ...driverData, licenseNumber: e.target.value })
              }
            />
            <input
              placeholder="Vehicle Type"
              defaultValue={selectedDriver.vehicleType}
              onChange={(e) =>
                setDriverData({ ...driverData, vehicleType: e.target.value })
              }
            />
            <Button onClick={handleUpdateDriver}>Update</Button>
            <Button onClick={() => setUpdateModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverView;
