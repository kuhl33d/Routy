import React, { useState, useEffect } from "react";
import { GridColDef } from "@mui/x-data-grid";
import DataGridTemplatePage from "@/components/DataGridTemplatePage";
import AddModal from "@/components/AddModal";
import ParentDetailsModal from "./ParentDetailsModal";
import { useSchoolStore } from "@/stores/school.store";

const StudentsPage: React.FC = () => {
  const { students, getAllStudents, finalDeleteStudent } = useSchoolStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        await getAllStudents();
      } catch (err) {
        setError("Failed to fetch students");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [getAllStudents]);

  // State for modals
  const [open, setOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    parentEmail: "",
    age: "",
    grade: "",
    schoolId: "",
  });
  const [parentDetailsModalOpen, setParentDetailsModalOpen] = useState(false);
  const [selectedStudentParents, setSelectedStudentParents] = useState<
    Array<{
      name?: string;
      email?: string;
      phoneNumber?: string[];
    }>
  >([]);

  // Handle opening Parent Details Modal
  const handleParentDetailsModalOpen = (parents) => {
    setSelectedStudentParents(parents);
    setParentDetailsModalOpen(true);
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

  if (loading) return <div>Loading students...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!transformedStudents.length) return <div>No students found</div>;

  return (
    <div>
      <DataGridTemplatePage
        title="Students"
        columns={columns}
        rows={transformedStudents}
        handleAdd={() => setOpen(true)}
        handleExport={() => console.log("Export Students")}
        handleEdit={(id) => console.log(`Edit Student with id: ${id}`)}
        handleDelete={async (id) => {
          await finalDeleteStudent(String(id));
          getAllStudents();
          console.log(`Student ${id} deleted successfully`);
        }}
        searchPlaceholder="Search students..."
      />

      <AddModal
        open={open}
        handleClose={() => setOpen(false)}
        handleSubmit={() => {
          console.log("Student Details Submitted:", studentDetails);
          setOpen(false);
        }}
        title="Add Student Details"
        fields={[
          { name: "name", label: "Student Name", value: studentDetails.name },
          {
            name: "parentEmail",
            label: "Parent Email",
            value: studentDetails.parentEmail,
          },
          { name: "age", label: "Age", value: studentDetails.age },
          { name: "grade", label: "Grade", value: studentDetails.grade },
          {
            name: "schoolId",
            label: "School ID",
            value: studentDetails.schoolId,
          },
        ]}
        handleChange={(e) => {
          const { name, value } = e.target;
          setStudentDetails((prev) => ({ ...prev, [name]: value }));
        }}
      />

      <ParentDetailsModal
        open={parentDetailsModalOpen}
        handleClose={() => setParentDetailsModalOpen(false)}
        parents={selectedStudentParents}
      />
    </div>
  );
};

export default StudentsPage;
