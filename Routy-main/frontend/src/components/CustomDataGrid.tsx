import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles"; // Import useTheme for dark mode support

interface CustomDataGridProps {
  columns: GridColDef[];
  rows: { id: number; name: string; age: number; email: string }[];
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

const CustomDataGrid: React.FC<CustomDataGridProps> = ({
  columns,
  rows,
  handleEdit,
  handleDelete,
}) => {
  const theme = useTheme(); // Access the Material-UI theme for dark mode

  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(params.id as number)}
          className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(params.id as number)}
          className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    ),
  };

  const columnsWithActions = [...columns, actionColumn];

  return (
    <div className="h-[400px] w-full">
      <DataGrid
        rows={rows}
        columns={columnsWithActions}
        pagination
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick={true}
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#020817" : "#f0f2f4", // Dark mode: #020817, Light mode: #f0f2f4
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418", // Dark mode: white, Light mode: dark gray
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            borderBottom:
              theme.palette.mode === "dark"
                ? "1px solid #374151"
                : "1px solid #e5e7eb", // Dark mode: dark border, Light mode: light border
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#1f2937" : "#f9fafb", // Dark mode: dark hover, Light mode: light hover
          },
          "& .MuiDataGrid-root": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#111827" : "#ffffff", // Dark mode: dark background, Light mode: white background
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418", // Dark mode: white text, Light mode: dark text
          },
          "& .MuiCheckbox-root": {
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418", // Dark mode: white checkbox, Light mode: dark checkbox
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#020817" : "#f0f2f4", // Dark mode: dark footer, Light mode: light footer
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418", // Dark mode: white text, Light mode: dark text
          },
        }}
      />
    </div>
  );
};

export default CustomDataGrid;
