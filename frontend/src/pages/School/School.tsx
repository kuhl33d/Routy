import React, { useState } from "react";
import SmartSidebar from "@/components/SmartSidebar";
import SchoolLogo from "@/assets/images/schoolLogo.jpg";
import Dashboard from "./Dashboard";
import { sidebarItems } from "./data";
import DriversPage from "./DataGridPages/DriversPage";
import RoutesPage from "./DataGridPages/RoutesPage";
import StudentsPage from "./DataGridPages/StudentsPage";
import BusesPage from "./DataGridPages/BusesPage";
const School: React.FC = () => {
  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4">
        <SmartSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          image={SchoolLogo}
          title="Modern Narmer Language School"
          items={sidebarItems}
        />
      </div>
      <div className="flex flex-col w-full md:w-3/4 max-w-[960px] flex-1">
        {activeItem === "Dashboard" && <Dashboard />}
        {activeItem === "Routes" && <RoutesPage />}
        {activeItem === "Drivers" && <DriversPage />}
        {activeItem === "Buses" && <BusesPage />}
        {activeItem === "Students" && <StudentsPage />}
      </div>
    </div>
  );
};

export default School;
