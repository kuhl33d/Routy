import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus } from "lucide-react";
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
import { User } from "@/types/admin.types";
// import { useAuth } from "@/components/AuthProvider";
import LoadingSpinner from "@/components/LoadingSpinner";

function AdminsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    users,
    loading,
    getAllUsers,
    updateUser,
    createAdmin, // Add the new action
  } = useAdminStore();

  const fetchAdmins = useCallback(async () => {
    try {
      await getAllUsers({ role: "admin" });
    } catch (error: unknown) {
      if (error instanceof Error) toast.error("Failed to fetch admins");
    }
  }, [getAllUsers]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleSuspend = async (userId: string) => {
    try {
      await updateUser({
        userId,
        updateData: { status: "suspended" },
      });
      await fetchAdmins();
      toast.success("Admin suspended successfully");
    } catch (error: unknown) {
      if (error instanceof Error) toast.error("Failed to suspend admin");
    }
  };

  const handleCreateAdmin = async (formData: FormData) => {
    try {
      const phoneNumberValue = formData.get("phoneNumber") as string | null;
      const adminData: Partial<User> & { password: string } = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phoneNumber: phoneNumberValue ? [phoneNumberValue] : undefined, // Wrap in array
      };
      await createAdmin(adminData);
      setIsCreateModalOpen(false);
      await fetchAdmins();
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(error.message || "Failed to create admin");
    }
  };

  const filteredAdmins = useMemo(() => {
    return users.filter((user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // Admin Form Component
  const AdminForm = ({
    onSubmit,
  }: {
    onSubmit: (formData: FormData) => Promise<void>;
  }) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(new FormData(e.currentTarget));
        }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium">Admin Name</label>
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
        <Button type="submit" className="w-full">
          Create Admin
        </Button>
      </form>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admins</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <AdminForm onSubmit={handleCreateAdmin} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        <Input
          placeholder="Search by email"
          className="max-w-md bg-background"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
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
              {filteredAdmins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>
                    {admin.lastLogin
                      ? new Date(admin.lastLogin).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        admin.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {admin.status || "active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleSuspend(admin._id)}
                      disabled={admin.status === "suspended"}
                    >
                      Suspend
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default AdminsTab;
