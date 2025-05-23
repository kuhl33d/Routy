import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RideCard from "./RideCard";
import { sidebarItems } from "./data";
import SmartSidebar from "@/components/SmartSidebar";
import { useParentStore } from "@/stores/parent.store";
import { useUserStore } from "@/stores/user.store";
import { useTripStore } from "@/stores/trip.store";

const Parent: React.FC = () => {
  const [activeItem, setActiveItem] = useState("Today Trips");
  const {
    getParentById,
    currentParent,
    loading: parentLoading,
  } = useParentStore();
  const { user, loading: userLoading } = useUserStore();
  console.log(user);
  const { getAllTrips, trips, loading: tripLoading } = useTripStore();

  useEffect(() => {
    if (user) {
      // Fetch the parent data using the parent's _id
      getParentById(user._id);
      // Fetch the trips data
      getAllTrips();
    }
  }, [user, getParentById, getAllTrips]);

  if (parentLoading || userLoading || tripLoading) {
    return <div>Loading...</div>;
  }
  console.log(currentParent);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <SmartSidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          image=""
          title="Parent Dashboard"
          items={sidebarItems}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full md:w-3/4 max-w-[960px] flex-1">
        {activeItem === "Today Trips" && <Trip trips={trips} />}
        {activeItem === "History" && <History trips={trips} />}
        {activeItem === "Children" && (
          <Children children={currentParent ? currentParent.children : []} />
        )}
      </div>
    </div>
  );
};

const Trip = ({ trips }) => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleTrackClick = () => {
    navigate("/tracking");
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4 py-10">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#181711] dark:text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome, {user?.name}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-base font-normal leading-normal">
            Track your child's routes and ensure their safety
          </p>
        </div>
      </div>

      {/* Rides List */}
      <div className="space-y-4 py-4">
        {trips.map((trip, index) => (
          <RideCard key={index} ride={trip} onButtonClick={handleTrackClick} />
        ))}
      </div>
    </div>
  );
};

const History = ({ trips }) => {
  const [activeItem, setActiveItem] = useState("All");
  const { user } = useUserStore();
  const handleTrackClick = () => {};

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4 py-10">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#181711] dark:text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome, {user?.name}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-base font-normal leading-normal">
            Review your child's past trips and stay informed about their travel
            history
          </p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 p-3 overflow-x-auto">
        {["All", "Today", "Yesterday", "Last 7 Days", "Last 30 Days"].map(
          (label) => (
            <button
              key={label}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-xl pl-4 pr-4 ${
                activeItem === label
                  ? "bg-[#F4C752] dark:bg-[#F4C752] text-[#181711] dark:text-gray-900"
                  : "bg-[#f5f4f0] dark:bg-gray-700 text-[#181711] dark:text-white"
              }`}
              onClick={() => setActiveItem(label)}
            >
              <p className="text-sm font-medium leading-normal">{label}</p>
            </button>
          )
        )}
      </div>

      {/* Rides List */}
      <div className="space-y-4 py-4">
        {trips.map((trip, index) => (
          <RideCard key={index} ride={trip} onButtonClick={handleTrackClick} />
        ))}
      </div>
    </div>
  );
};

const Children = ({ children }) => {
  const { user } = useUserStore();

  return (
    <div>
      {/* Welcome Section */}
      <div className="flex flex-wrap justify-between gap-3 p-4 py-10">
        <div className="flex min-w-72 flex-col gap-3">
          <p className="text-[#181711] dark:text-white text-2xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Welcome, {user?.name}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-base font-normal leading-normal">
            Manage your children's information
          </p>
        </div>
      </div>

      {/* Children List */}
      <div className="space-y-4 py-4">
        {children.map((child, index) => (
          <div key={index} className="p-4 bg-white rounded shadow">
            <p className="text-lg font-bold">{child.userId.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Parent;
