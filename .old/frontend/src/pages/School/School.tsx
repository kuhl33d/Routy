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
  const { getSchoolById } = useSchoolStore();

  const [students, setStudents] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [numbers, setNumbers] = useState({
    students: 0,
    drivers: 0,
    routes: 0,
    buses: 0,
  });
  useEffect(() => {
    const userStorage = sessionStorage.getItem("user-storage");

    if (userStorage) {
      try {
        const parsedStorage = JSON.parse(userStorage);
        const UserId = parsedStorage?.state?.user?._id;

        if (UserId) {
          getSchoolById(String(UserId)).then((response: any) => {
            if (response) {
              setStudents(response.students || []);
              setDrivers(response.drivers || []);
              setRoutes(response.routes || []);
              setBuses(response.buses || []);
              setNumbers({
                students: response.students?.length || 0,
                drivers: response.drivers?.length || 0,
                routes: response.routes?.length || 0,
                buses: response.buses?.length || 0,
              });
            }
          });
        } else {
          console.error("School ID not found in user storage");
        }
      } catch (error) {
        console.error("Error parsing user storage:", error);
      }
    } else {
      console.log("No user storage found");
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
        {activeItem === "Dashboard" && <Dashboard nums={numbers} />}
        {activeItem === "Routes" && <RoutesPage routes={routes} />}
        {activeItem === "Drivers" && <DriversPage drivers={drivers} />}
        {activeItem === "Buses" && <BusesPage buses={buses} />}
        {activeItem === "Students" && <StudentsPage students={students} />}
      </div>
    </div>
  );
};

export default School;
