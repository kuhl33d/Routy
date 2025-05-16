// import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";

interface CustomDataGridProps<T> {
  columns: GridColDef[];
  rows: T[];
  handleEdit: (id: string | number) => void;
  handleDelete: (id: string | number) => void;
}

const CustomDataGrid = <T extends { id: string | number }>({
  columns,
  rows,
  handleEdit,
  handleDelete,
}: CustomDataGridProps<T>) => {
  const theme = useTheme();

  const actionColumn: GridColDef = {
    field: "actions",
    headerName: "Actions",
    width: 150,
    renderCell: (params) => (
      <div className="flex gap-2 items-center h-full">
        <button
          onClick={() => handleEdit(params.row.id)}
          className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(params.row.id)}
          className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    ),
  };

  return (
    <div className="h-[400px] w-full">
      <DataGrid
        rows={rows}
        columns={[...columns, actionColumn]}
        pagination
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#020817" : "#f0f2f4",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            borderBottom:
              theme.palette.mode === "dark"
                ? "1px solid #374151"
                : "1px solid #e5e7eb",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#1f2937" : "#f9fafb",
          },
          "& .MuiDataGrid-root": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#111827" : "#ffffff",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418",
          },
          "& .MuiCheckbox-root": {
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#020817" : "#f0f2f4",
            color: theme.palette.mode === "dark" ? "#ffffff" : "#111418",
          },
        }}
      />
    </div>
  );
};

export default CustomDataGrid;
