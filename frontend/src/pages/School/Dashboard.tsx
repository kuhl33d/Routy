import { useState, useEffect } from "react";
import { todaysOverviewCards, activities } from "./data";
import ActivityItem from "@/components/ui/ActivityItem";
import RoutePerformanceChart from "./RoutePerformanceChart";
import SummaryCard from "@/components/ui/SummaryCard";
import { useSchoolStore } from "@/stores/school.store";

const Dashboard: React.FC = () => {
  const { getSchoolStatsById } = useSchoolStore();
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
          getSchoolStatsById(String(UserId)).then((response: any) => {
            if (response) {
              // console.log(response);
              setNumbers({
                students: response.data.totalStudents || 0,
                drivers: response.data.totalDrivers || 0,
                routes: response.data.totalRoutes || 0,
                buses: response.data.totalBuses || 0,
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
  }, [getSchoolStatsById]);

  return (
    <div className="bg-background text-foreground">
      {/* Dashboard Summary Section */}
      <section className="flex flex-wrap justify-between gap-3 p-4">
        <p className="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72 dark:text-foreground">
          Dashboard Summary
        </p>
      </section>

      {/* Summary Cards Section */}
      <section className="flex flex-wrap gap-4 p-4">
        <SummaryCard
          key={0}
          title="Total Students Enrolled"
          value={numbers.students}
        />
        <SummaryCard key={1} title="Total Routes" value={numbers.routes} />
        <SummaryCard key={2} title="Total Buses" value={numbers.buses} />
        <SummaryCard key={3} title="Total Drivers" value={numbers.drivers} />
      </section>

      {/* Today's Overview Section */}
      <section>
        <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 dark:text-foreground">
          Today's Overview
        </h2>
        <div className="flex flex-wrap gap-4 p-4">
          {todaysOverviewCards.map((card, index) => (
            <SummaryCard key={index} title={card.title} value={card.value} />
          ))}
        </div>
      </section>

      {/* Route Performance Section */}
      <section>
        <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 dark:text-foreground">
          Route Performance
        </h2>
        <div className="pb-3">
          <div className="flex border-b border-[#E9DFCE] px-4 gap-8 dark:border-gray-700">
            {["Route 1", "Route 2", "Route 3"].map((route, index) => (
              <a
                key={index}
                className={`flex flex-col items-center justify-center border-b-[3px] ${
                  index === 2
                    ? "border-b-[#F4C752] text-foreground"
                    : "border-b-transparent text-[#A18249] dark:text-gray-400"
                } pb-[13px] pt-4`}
                href="#"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  {route}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Route Performance Chart Section */}
      <section className="flex flex-wrap gap-4 px-4 py-6">
        <RoutePerformanceChart />
      </section>

      {/* Recent Activities Section */}
      <section>
        <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 dark:text-foreground">
          Recent Activities
        </h2>
        {activities.map((activity, index) => (
          <ActivityItem key={index} {...activity} />
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
