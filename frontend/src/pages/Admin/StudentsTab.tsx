import { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Search, Eye } from "lucide-react";
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
import { Student } from "@/types/admin.types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StudentsTab() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Get store actions and state
  const { students, loading, error, getAllStudents, updateStudent } = useAdminStore();

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      await getAllStudents();
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(error.message || "Failed to fetch students");
    }
  };

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!Array.isArray(students)) {
      console.warn("Students is not an array:", students);
      return [];
    }
    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.grade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.schoolId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Status update handler
  const handleStatusUpdate = async (
    studentId: string,
    newStatus: "active" | "inactive" | "suspended"
  ) => {
    try {
      await updateStudent({
        studentId,
        updateData: { status: newStatus },
      });
      toast.success(
        `Student ${newStatus === "active" ? "activated" : "suspended"} successfully`
      );
      fetchStudents();
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(error.message || `Failed to update student status`);
    }
  };

  // Create student handler
  const handleCreateStudent = async (formData: FormData) => {
    try {
      const studentData: Partial<Student> = {
        name: formData.get("name") as string,
        grade: formData.get("grade") as string,
        schoolId: formData.get("schoolId") as string,
        parentId: formData.get("parentId") as string,
        status: "inactive" as const,
      };

      await updateStudent({
        studentId: "", // New student, no ID yet
        updateData: studentData,
      });
      setIsCreateModalOpen(false);
      toast.success("Student created successfully");
      fetchStudents();
    } catch (error: unknown) {
      if (error instanceof Error)
        toast.error(error.message || "Failed to create student");
    }
  };

  // Student Form Component
  const StudentForm = ({
    onSubmit,
    initialData,
  }: {
    onSubmit: (formData: FormData) => Promise<void>;
    initialData?: Student | null;
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
          <label className="text-sm font-medium">Student Name</label>
          <Input
            name="name"
            defaultValue={initialData?.name}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Grade</label>
          <Input
            name="grade"
            defaultValue={initialData?.grade}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">School</label>
          <Input
            name="schoolId"
            defaultValue={initialData?.schoolId}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Parent</label>
          <Input
            name="parentId"
            defaultValue={initialData?.parentId}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          {initialData ? "Update Student" : "Create Student"}
        </Button>
      </form>
    );
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: string }) => (
    <Badge
      className={
        status === "active"
          ? "bg-green-100 text-green-800"
          : status === "suspended"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800"
      }
    >
      {status}
    </Badge>
  );

  // Student Details Dialog
  const StudentDetailsDialog = ({ student }: { student: Student }) => {
    return (
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{student.name || "Student Details"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Basic Information</h3>
              <p>Name: {student.name}</p>
              <p>Grade: {student.grade}</p>
            </div>
            <div>
              <h3 className="font-medium">School</h3>
              <p>{student.schoolId?.name || "Not assigned"}</p>
            </div>
            <div>
              <h3 className="font-medium">Parent</h3>
              <p>{student.parentId?.name || "Not assigned"}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <StatusBadge status={student.status || "inactive"} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
        <Button
          onClick={fetchStudents}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Add button and search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Students</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search students..."
            className="max-w-xs bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90 flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <StudentForm onSubmit={handleCreateStudent} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <LoadingSpinner />
      ) : /* Empty state */
      students.length === 0 ? (
        <div className="text-center py-16">
          <p className="mb-4 text-lg text-muted-foreground">
            No students found. Click below to add your first student.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#F7B32B] text-black hover:bg-[#F7B32B]/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      ) : (
        /* Table of students */
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.schoolId?.name}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status || "inactive"} />
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsDetailsOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStudent(student);
                      setIsEditOpen(true);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500"
                    onClick={() =>
                      handleStatusUpdate(
                        student._id,
                        student.status === "active" ? "suspended" : "active"
                      )
                    }
                  >
                    {student.status === "active" ? "Suspend" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Details Dialog */}
      {selectedStudent && (
        <StudentDetailsDialog student={selectedStudent} />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <StudentForm
            onSubmit={async (formData) => {
              try {
                await updateStudent({
                  studentId: selectedStudent?._id || "",
                  updateData: {
                    name: formData.get("name") as string,
                    grade: formData.get("grade") as string,
                    schoolId: formData.get("schoolId") as string,
                    parentId: formData.get("parentId") as string,
                  },
                });
                setIsEditOpen(false);
                toast.success("Student updated successfully");
                fetchStudents();
              } catch (error: unknown) {
                if (error instanceof Error)
                  toast.error(error.message || "Failed to update student");
              }
            }}
            initialData={selectedStudent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}