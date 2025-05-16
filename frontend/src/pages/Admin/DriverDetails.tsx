// src/pages/DriverDetails.tsx
import React, { useState, useEffect, FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useDriverStore } from "@/stores/driver.store";
import { Driver } from "@/types/driver.types";

const DriverDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentDriver, getDriverById, updateDriver } = useDriverStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [formState, setFormState] = useState<Partial<Driver>>({});

  useEffect(() => {
    if (id) {
      getDriverById(id).then(() => {
        setLoading(false);
        setFormState(currentDriver || {});
      });
    }
  }, [id, getDriverById, currentDriver]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateDriver(id, formState);
      toast.success("Driver updated successfully");
      navigate("/drivers"); // or any route you prefer after update
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message || "Failed to update driver");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Driver Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Driver Name</label>
          <Input name="name" value={formState.name || ""} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input name="email" type="email" value={formState.email || ""} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">License Number</label>
          <Input name="licenseNumber" value={formState.licenseNumber || ""} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Vehicle Type</label>
          <Input name="vehicleType" value={formState.vehicleType || ""} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <Input name="phoneNumber" value={formState.phoneNumber?.[0] || ""} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full">
          Update Driver
        </Button>
      </form>
    </div>
  );
};

export default DriverDetails;
