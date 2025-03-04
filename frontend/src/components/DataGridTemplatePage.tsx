import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import CustomDataGrid from "@/components/CustomDataGrid";
import { GridColDef } from "@mui/x-data-grid";

interface DataGridTemplatePageProps<T> {
  title: string;
  columns: GridColDef[];
  rows: T[];
  handleAdd: () => void;
  handleExport: () => void;
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  searchPlaceholder: string;
}

const DataGridTemplatePage = <T extends { id: number }>({
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
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

      {/* Search Bar with Icon */}
      <div className="relative mb-5">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400 dark:text-gray-500" />{" "}
          {/* Search Icon */}
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
          handleDelete={handleDelete}
        />
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="px-5 py-2 bg-[#F7B32B] text-white dark:text-gray-900 font-medium rounded-md hover:bg-orange-600 transition-colors"
      >
        Export
      </button>
    </div>
  );
};

export default DataGridTemplatePage;
