import React, { useState } from "react";
import DataGridTemplatePage from "../../components/DataGridTemplatePage";
import { Buses, Drivers, Routes, Students } from "./data";
import { GridColDef } from "@mui/x-data-grid";
import AddModal from "../../components/AddModal";
// Buses Page
const BusesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [busDetails, setBusDetails] = useState({
    busNumber: "",
    capacity: "",
    driverName: "",
    route: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Bus Details Submitted:", busDetails);
    handleClose();
  };

  const fields = [
    { name: "busNumber", label: "Bus Number", value: busDetails.busNumber },
    { name: "capacity", label: "Capacity", value: busDetails.capacity },
    { name: "driverName", label: "Driver Name", value: busDetails.driverName },
    { name: "route", label: "Route", value: busDetails.route },
  ];

  const columns: GridColDef[] = [
    { field: "BusNumber", headerName: "Bus Number", width: 150 },
    { field: "Capacity", headerName: "Capacity", width: 120 },
    { field: "CurrentOccupancy", headerName: "Current", width: 120 },
    { field: "DriverName", headerName: "Driver", width: 200 },
    { field: "AssignedRoute", headerName: "Route", width: 150 },
  ];

  return (
    <div>
      <DataGridTemplatePage
        title="Buses"
        columns={columns}
        rows={Buses}
        handleAdd={handleOpen}
        handleExport={() => console.log("Export Buses")}
        handleEdit={(id) => console.log(`Edit Bus with id: ${id}`)}
        handleDelete={(id) => console.log(`Delete Bus with id: ${id}`)}
        searchPlaceholder="Search buses..."
      />
      <AddModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Add Bus Details"
        fields={fields}
        handleChange={handleChange}
      />
    </div>
  );
};

// Drivers Page
const DriversPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [driverDetails, setDriverDetails] = useState({
    driverName: "",
    licenseNumber: "",
    phoneNumber: "",
    assignedBus: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriverDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Driver Details Submitted:", driverDetails);
    handleClose();
  };

  const fields = [
    {
      name: "driverName",
      label: "Driver Name",
      value: driverDetails.driverName,
    },
    {
      name: "licenseNumber",
      label: "License Number",
      value: driverDetails.licenseNumber,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      value: driverDetails.phoneNumber,
    },
    {
      name: "assignedBus",
      label: "Assigned Bus",
      value: driverDetails.assignedBus,
    },
  ];

  const columns: GridColDef[] = [
    { field: "DriverName", headerName: "Driver Name", width: 200 },
    { field: "LicenseNumber", headerName: "License Number", width: 200 },
    { field: "PhoneNumber", headerName: "Phone Number", width: 200 },
    { field: "AssignedBus", headerName: "Assigned Bus", width: 150 },
  ];

  return (
    <div>
      <DataGridTemplatePage
        title="Drivers"
        columns={columns}
        rows={Drivers}
        handleAdd={handleOpen}
        handleExport={() => console.log("Export Drivers")}
        handleEdit={(id) => console.log(`Edit Driver with id: ${id}`)}
        handleDelete={(id) => console.log(`Delete Driver with id: ${id}`)}
        searchPlaceholder="Search drivers..."
      />
      <AddModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Add Driver Details"
        fields={fields}
        handleChange={handleChange}
      />
    </div>
  );
};

// Routes Page
const RoutesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [routeDetails, setRouteDetails] = useState({
    route: "",
    description: "",
    bus: "",
    stops: "",
    type: "",
    status: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRouteDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Route Details Submitted:", routeDetails);
    handleClose();
  };

  const fields = [
    { name: "route", label: "Route", value: routeDetails.route },
    {
      name: "description",
      label: "Description",
      value: routeDetails.description,
    },
    { name: "bus", label: "Bus", value: routeDetails.bus },
    { name: "stops", label: "Stops", value: routeDetails.stops },
    { name: "type", label: "Type", value: routeDetails.type },
    { name: "status", label: "Status", value: routeDetails.status },
  ];

  const columns: GridColDef[] = [
    { field: "route", headerName: "Route", width: 120 },
    { field: "description", headerName: "Description", width: 200 },
    { field: "bus", headerName: "Bus", width: 100 },
    { field: "stops", headerName: "Stops", width: 100 },
    {
      field: "type",
      headerName: "Type",
      width: 120,
      renderCell: (params) => (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
          {params.value}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            params.value === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {params.value}
        </span>
      ),
    },
  ];

  return (
    <div>
      <DataGridTemplatePage
        title="Routes"
        columns={columns}
        rows={Routes}
        handleAdd={handleOpen}
        handleExport={() => console.log("Export Routes")}
        handleEdit={(id) => console.log(`Edit Route with id: ${id}`)}
        handleDelete={(id) => console.log(`Delete Route with id: ${id}`)}
        searchPlaceholder="Search routes..."
      />
      <AddModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Add Route Details"
        fields={fields}
        handleChange={handleChange}
      />
    </div>
  );
};

// Students Page
const StudentsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    studentName: "",
    email: "",
    parentContactNumber: "",
    studentIDNumber: "",
    assignedBusNumber: "",
    busRoute: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStudentDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Student Details Submitted:", studentDetails);
    handleClose();
  };

  const fields = [
    {
      name: "studentName",
      label: "Student Name",
      value: studentDetails.studentName,
    },
    { name: "email", label: "Parent Email", value: studentDetails.email },
    {
      name: "parentContactNumber",
      label: "Parent Contact",
      value: studentDetails.parentContactNumber,
    },
    {
      name: "studentIDNumber",
      label: "Student ID",
      value: studentDetails.studentIDNumber,
    },
    {
      name: "assignedBusNumber",
      label: "Assigned Bus",
      value: studentDetails.assignedBusNumber,
    },
    { name: "busRoute", label: "Bus Route", value: studentDetails.busRoute },
  ];

  const columns: GridColDef[] = [
    { field: "StudentName", headerName: "Student Name", width: 200 },
    { field: "Email", headerName: "Parent Email", width: 250 },
    { field: "ParentContactNumber", headerName: "Parent Contact", width: 180 },
    { field: "StudentIDNumber", headerName: "Student ID", width: 180 },
    { field: "AssignedBusNumber", headerName: "Assigned Bus", width: 150 },
    { field: "BusRoute", headerName: "Bus Route", width: 150 },
  ];

  return (
    <div>
      <DataGridTemplatePage
        title="Students"
        columns={columns}
        rows={Students}
        handleAdd={handleOpen}
        handleExport={() => console.log("Export Students")}
        handleEdit={(id) => console.log(`Edit Student with id: ${id}`)}
        handleDelete={(id) => console.log(`Delete Student with id: ${id}`)}
        searchPlaceholder="Search students..."
      />
      <AddModal
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        title="Add Student Details"
        fields={fields}
        handleChange={handleChange}
      />
    </div>
  );
};

// Export all pages
export { BusesPage, DriversPage, RoutesPage, StudentsPage };
