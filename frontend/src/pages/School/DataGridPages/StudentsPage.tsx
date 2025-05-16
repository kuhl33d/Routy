import React, { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataGridTemplatePage from "@/components/DataGridTemplatePage";
import AddModal from "@/components/AddModal";
import ParentDetailsModal from "./ParentDetailsModal";
import { useSchoolStore } from "@/stores/school.store";
import EditModal from "@/components/EditModal";
import toast from "react-hot-toast";

const StudentsPage: React.FC = () => {
  const { 
    students, 
    loading, 
    error,
    getAllStudents, 
    createStudent, 
    updateStudent, 
    finalDeleteStudent 
  } = useSchoolStore();

  // Fetch students on mount
  useEffect(() => {
    getAllStudents();
  }, [getAllStudents]);

  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isParentDetailsModalOpen, setIsParentDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedStudentParents, setSelectedStudentParents] = useState<
    Array<{
      name?: string;
      email?: string;
      phoneNumber?: string[];
    }>
  >([]);

  const [studentForm, setStudentForm] = useState({
    name: "",
    parentEmail: "",
    age: "",
    grade: "",
    schoolId: "",
  });

  // Reset form when opening create modal
  const handleOpenCreateModal = () => {
    setStudentForm({
      name: "",
      parentEmail: "",
      age: "",
      grade: "",
      schoolId: "",
    });
    setIsCreateModalOpen(true);
  };

  // Set form data when opening edit modal
  const handleOpenEditModal = (id: string) => {
    const student = Array.isArray(students?.data) 
      ? students.data.find((s) => s._id === id)
      : null;
    
    if (student) {
      setSelectedStudent(student);
      setStudentForm({
        name: student.user?.name || "",
        parentEmail: student.parents?.[0]?.email || "",
        age: student.user?.age?.toString() || "",
        grade: student.user?.grade || "",
        schoolId: student.schoolId?._id || "",
      });
      setIsEditModalOpen(true);
    } else {
      toast.error("Student not found");
    }
  };

  // Handle opening Parent Details Modal
  const handleParentDetailsModalOpen = (parents) => {
    setSelectedStudentParents(parents);
    setIsParentDetailsModalOpen(true);
  };

  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle create student submission
  const handleCreateStudent = async () => {
    try {
      await createStudent({
        name: studentForm.name,
        parentEmail: studentForm.parentEmail,
        age: parseInt(studentForm.age),
        grade: studentForm.grade,
        schoolId: studentForm.schoolId,
      });
      setIsCreateModalOpen(false);
      getAllStudents(); // Refresh the list
    } catch (err) {
      console.error("Error creating student:", err);
    }
  };

  // Handle update student submission
  const handleUpdateStudent = async () => {
    if (!selectedStudent?._id) return;
    
    try {
      await updateStudent(selectedStudent._id, {
        name: studentForm.name,
        parentEmail: studentForm.parentEmail,
        age: parseInt(studentForm.age),
        grade: studentForm.grade,
        schoolId: studentForm.schoolId,
      });
      setIsEditModalOpen(false);
      getAllStudents(); // Refresh the list
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  // Transform the students data for the DataGrid
  const transformStudents = () => {
    if (!students?.data || !Array.isArray(students.data)) return [];

    return students.data.map((student) => ({
      id: student._id,
      StudentName: student.user?.name || "N/A",
      Age: student.user?.age || "N/A",
      Grade: student.user?.grade || "N/A",
      ParentName: student.parents?.[0]?.name || "N/A",
      ParentEmail: student.parents?.[0]?.email || "N/A",
      ParentContactNumber:
        student.parents?.[0]?.phoneNumber?.join(", ") || "N/A",
      RouteName: student.route?.name || "N/A",
      parents: student.parents || [],
      route: student.route || null,
    }));
  };

  const transformedStudents = transformStudents();

  // Columns for the DataGrid
  const columns: GridColDef[] = [
    { field: "StudentName", headerName: "Name", width: 200 },
    { field: "Age", headerName: "Age", width: 100 },
    { field: "Grade", headerName: "Grade", width: 150 },
    { field: "RouteName", headerName: "Route", width: 120 },
    {
      field: "parentDetails",
      headerName: "Parent",
      width: 120,
      renderCell: (params) => (
        <button
          onClick={() => handleParentDetailsModalOpen(params.row.parents)}
          className="px-2.5 bg-orange-600 text-white border-none rounded-[10px] cursor-pointer h-1/2 flex items-center justify-center"
        >
          View
        </button>
      ),
    },
  ];

  // Show loading state
  if (loading) return <div className="p-4">Loading students...</div>;
  
  // Show error state
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  
  // Show empty state
  if (!transformedStudents || transformedStudents.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">No students found</p>
        <button 
          onClick={handleOpenCreateModal}
          className="px-4 py-2 bg-[#F7B32B] text-black rounded-md hover:bg-[#F7B32B]/90"
        >
          Add a Student
        </button>
      </div>
    );
  }

  return (
    <div>
      <DataGridTemplatePage
        title="Students"
        columns={columns}
        rows={transformedStudents}
        handleAdd={handleOpenCreateModal}
        handleExport={() => console.log("Export Students")}
        handleEdit={(id) => handleOpenEditModal(String(id))}
        handleDelete={async (id) => {
          try {
            await finalDeleteStudent(String(id));
            toast.success("Student deleted successfully");
            await getAllStudents(); // Refresh the list
          } catch (err) {
            console.error("Error deleting student:", err);
            toast.error("Failed to delete student");
          }
        }}
        searchPlaceholder="Search students..."
      />

      {/* Create Student Modal */}
      <AddModal
        open={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
        handleSubmit={handleCreateStudent}
        title="Add Student"
        fields={[
          { 
            name: "name", 
            label: "Student Name", 
            value: studentForm.name 
          },
          {
            name: "parentEmail",
            label: "Parent Email",
            value: studentForm.parentEmail,
          },
          { 
            name: "age", 
            label: "Age", 
            value: studentForm.age 
          },
          { 
            name: "grade", 
            label: "Grade", 
            value: studentForm.grade 
          },
          {
            name: "schoolId",
            label: "School ID",
            value: studentForm.schoolId,
          },
        ]}
        handleChange={handleFormChange}
      />

      {/* Edit Student Modal */}
      <EditModal
        open={isEditModalOpen}
        handleClose={() => setIsEditModalOpen(false)}
        handleSubmit={handleUpdateStudent}
        title="Edit Student"
        fields={[
          { 
            name: "name", 
            label: "Student Name", 
            value: studentForm.name 
          },
          {
            name: "parentEmail",
            label: "Parent Email",
            value: studentForm.parentEmail,
          },
          { 
            name: "age", 
            label: "Age", 
            value: studentForm.age 
          },
          { 
            name: "grade", 
            label: "Grade", 
            value: studentForm.grade 
          },
          {
            name: "schoolId",
            label: "School ID",
            value: studentForm.schoolId,
          },
        ]}
        handleChange={handleFormChange}
      />

      {/* Parent Details Modal */}
      <ParentDetailsModal
        open={isParentDetailsModalOpen}
        handleClose={() => setIsParentDetailsModalOpen(false)}
        parents={selectedStudentParents}
      />
    </div>
  );
};

export default StudentsPage;
