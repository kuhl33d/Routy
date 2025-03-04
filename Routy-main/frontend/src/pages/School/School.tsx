import React, { useEffect, useState } from "react";
import SmartSidebar from "@/components/SmartSidebar";
import SchoolLogo from "@/assets/images/schoolLogo.jpg";
import Dashboard from "./Dashboard";
import { sidebarItems } from "./data";
import {
  BusesPage,
  RoutesPage,
  DriversPage,
  StudentsPage,
} from "./GridPagesCollection";
import { useSchoolStore } from "@/stores/school.store";
const School: React.FC = () => {
  const { fetchStudentsinSchool } = useSchoolStore();
  const userStorage = sessionStorage.getItem("user-storage");

  useEffect(() => {
    if (userStorage) {
      const user = JSON.parse(userStorage)?.state?.user;
      if (user?.role === "admin" || user?.role === "school") {
        fetchStudentsinSchool();
      } else {
        console.warn("User does not have permission to fetch students.");
      }
    }
  }, []);

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
