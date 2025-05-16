import React, { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import CustomDataGrid from "@/components/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";

interface DataGridTemplatePageProps<T> {
  title: string;
  columns: GridColDef[];
  rows: T[];
  handleAdd: () => void;
  handleExport: () => void;
  handleEdit: (id: string | number) => void;
  handleDelete: (id: string | number) => void;
  searchPlaceholder: string;
}

const DataGridTemplatePage = <T extends { id: string | number }>({
  title,
  columns,
  rows,
  handleAdd,
  handleExport,
  handleEdit,
  handleDelete,
  searchPlaceholder,
}: DataGridTemplatePageProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const confirmDelete = (id: string | number) => {
    setDeleteId(id);
    setOpenDeleteModal(true);
  };

  const executeDelete = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
    }
    setOpenDeleteModal(false);
  };

  return (
    <div className="p-5 font-lexend bg-white dark:bg-gray-800 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
          {title}
        </h1>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-[#F7B32B] text-black dark:text-gray-900 font-medium rounded-md hover:bg-yellow-500 transition-colors"
        >
          Add {title}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pl-10 p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7B32B] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
        />
      </div>

      {/* DataGrid Section */}
      <div className="mb-5">
        <CustomDataGrid
          columns={columns}
          rows={rows}
          handleEdit={handleEdit}
          handleDelete={confirmDelete}
        />
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="px-5 py-2 bg-[#F7B32B] text-white dark:text-gray-900 font-medium rounded-md hover:bg-orange-600 transition-colors"
      >
        Export
      </button>

      {/* Delete Confirmation Modal */}
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to delete this item?
          </Typography>
          <Box mt={2} display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="error" onClick={executeDelete}>
              Delete
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpenDeleteModal(false)}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default DataGridTemplatePage;
