import { useState } from "react";
import {
  ChartArea,
  School as Sch,
  Users,
  Truck,
  GraduationCap,
} from "lucide-react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import SmartSidebar from "@/components/SmartSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import InsightsTab from "./InsightsTab";
import SchoolsTab from "./SchoolsTab";
import AdminsTab from "./AdminsTab";

import ParentsTab from "./ParentsTab";
import DriversTab from "./DriversTab";
import StudentsTab from "./StudentsTab";

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const sidebarItems = [
    {
      icon: <ChartArea />,
      label: "Dashboard",
      isActive: activeItem === "Dashboard",
    },
    {
      icon: <Sch />,
      label: "Schools",
      isActive: activeItem === "Schools",
    },
    {
      icon: <Users />,
      label: "Parents",
      isActive: activeItem === "Parents",
    },
    {
      icon: <Truck />,
      label: "Drivers",
      isActive: activeItem === "Drivers",
    },
    {
      icon: <GraduationCap />,
      label: "Students",
      isActive: activeItem === "Students",
    },
    {
      icon: <AdminPanelSettingsIcon />,
      label: "Admins",
      isActive: activeItem === "Admins",
    },
  ];

  const renderActiveTab = () => {
    switch (activeItem) {
      case "Dashboard":
        return (
          <ErrorBoundary fallback={<div>Error loading dashboard</div>}>
            <InsightsTab />
          </ErrorBoundary>
        );
      case "Schools":
        return (
          <ErrorBoundary fallback={<div>Error loading schools</div>}>
            <SchoolsTab />
          </ErrorBoundary>
        );
      case "Parents":
        return (
          <ErrorBoundary fallback={<div>Error loading parents</div>}>
            <ParentsTab />
          </ErrorBoundary>
        );
      case "Drivers":
        return (
          <ErrorBoundary fallback={<div>Error loading drivers</div>}>
            <DriversTab />
          </ErrorBoundary>
        );
      case "Students":
        return (
          <ErrorBoundary fallback={<div>Error loading students</div>}>
            <StudentsTab />
          </ErrorBoundary>
        );
      case "Admins":
        return (
          <ErrorBoundary fallback={<div>Error loading admins</div>}>
            <AdminsTab />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <div className="w-64">
        <SmartSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          image="https://th.bing.com/th/id/R.634e09920fd52502ecf8f57b22d71af9?rik=VfxeQcZ9k%2fbzWw&pid=ImgRaw&r=0"
          title="Admin Dashboard"
          items={sidebarItems}
        />
      </div>
      <div className="flex-1 p-8">
        <ErrorBoundary>{renderActiveTab()}</ErrorBoundary>
      </div>
    </div>
  );
}
