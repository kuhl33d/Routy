import React, { useState, useEffect, useRef, useMemo } from "react";
import { Plus, Upload, Edit2, Trash2, Search } from "lucide-react";
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

import { useAdminStore } from "@/stores/admin.store";
import { toast } from "react-hot-toast";
import { SubscriptionPlan } from "@/types/admin.types";
import LoadingSpinner from "@/components/LoadingSpinner";

function PricingTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    plans,
    plansLoading,
    plansError,
    getAllPlans,
    createPlan,
    updatePlan,
    importPlans,
  } = useAdminStore();

  // Initial load
  useEffect(() => {
    getAllPlans().catch((error) => {
      toast.error(`Failed to load plans ${error.message || ""}`);
    });
  }, [getAllPlans]);

  // Create plan handler
  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const planData = {
        name: formData.get("name") as string,
        price: Number(formData.get("price")),
        renewalPeriod: Number(formData.get("renewalPeriod")),
        description: formData.get("description") as string,
        features: (formData.get("features") as string)
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),
      };

      await createPlan(planData);
      setIsCreateModalOpen(false);
      toast.success("Plan created successfully");
      getAllPlans(); // Refresh the list
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(error.message || "Failed to create plan");
    }
  };

  // Edit plan handler
  const handleEditPlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedPlan) return;

    const formData = new FormData(e.currentTarget);

    try {
      const updates = {
        name: formData.get("name") as string,
        price: Number(formData.get("price")),
        renewalPeriod: Number(formData.get("renewalPeriod")),
        description: formData.get("description") as string,
        features: (formData.get("features") as string)
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),
      };

      await updatePlan(selectedPlan._id, updates);
      setIsEditModalOpen(false);
      setSelectedPlan(null);
      toast.success("Plan updated successfully");
      getAllPlans(); // Refresh the list
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(error.message || "Failed to update plan");
    }
  };

  // Import handler
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await importPlans(file);
      toast.success("Plans imported successfully");
      getAllPlans(); // Refresh the list
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(error.message || "Failed to import plans");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Filtered plans
  const filteredPlans = useMemo(() => {
    return plans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [plans, searchTerm]);

  // Plan Form Component
  const PlanForm = ({
    onSubmit,
    initialData = null,
  }: {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    initialData?: SubscriptionPlan | null;
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
        <label className="text-sm font-medium">
          Features (comma-separated)
        </label>
        <Input
          name="features"
          defaultValue={initialData?.features?.join(", ")}
          placeholder="Enter features"
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Plan" : "Create Plan"}
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
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
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
                        toast.error("Delete functionality not implemented");
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
          <PlanForm onSubmit={handleEditPlan} initialData={selectedPlan} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PricingTab;
