import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import StudentProfile from "@/components/ui/StudentProfile";
import NotificationCard from "@/components/ui/NotificationCard";

// Fix for missing marker icons in TypeScript
declare module "leaflet" {
  interface IconDefault {
    _getIconUrl?: string;
  }
}

const iconRetinaUrl = new URL(
  "leaflet/dist/images/marker-icon-2x.png",
  import.meta.url
).href;
const iconUrl = new URL("leaflet/dist/images/marker-icon.png", import.meta.url)
  .href;
const shadowUrl = new URL(
  "leaflet/dist/images/marker-shadow.png",
  import.meta.url
).href;

// Delete the _getIconUrl property from the prototype
delete (L.Icon.Default.prototype as L.IconDefault)._getIconUrl;

// Merge options to set the correct icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Define TypeScript interfaces
interface Notification {
  icon: string;
  title: string;
  message: string;
  time: string;
}

// Reusable LiveTracking Component
const LiveTracking: React.FC = () => {
  const [location] = useState({ lat: 29.9567, lng: 30.9554 });

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex flex-1 flex-col py-3">
        <div className="flex min-h-[320px] flex-1 flex-col justify-between px-4 pb-4 pt-5 rounded">
          <MapContainer
            center={location}
            zoom={13}
            style={{ height: "50vh", width: "100%", borderRadius: "15px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={location}>
              <Popup>Current Location</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

// Main Tracking Component
const Tracking: React.FC = () => {
  const notifications: Notification[] = [
    {
      icon: "check",
      title: "Arriving",
      message: "Your child's bus is 5 minutes away from the school",
      time: "3:10 PM",
    },
  ];

  return (
    <div className="px-4 md:px-40 flex flex-1 justify-center py-5 bg-white dark:bg-gray-900">
      <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
        {/* Header */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-[#181711] dark:text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
            Good afternoon, Mohsen. Your child is on their way to home.
          </p>
        </div>

        {/* Live Tracking Section */}
        <h3 className="text-[#181711] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Live Tracking
        </h3>
        <LiveTracking />

        {/* Student Profile Section */}
        <h3 className="text-[#181711] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Student Profile
        </h3>
        <StudentProfile />

        {/* Notifications & Alerts Section */}
        <h3 className="text-[#181711] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
          Notifications &amp; Alerts
        </h3>
        {notifications.map((notification, index) => (
          <NotificationCard key={index} {...notification} />
        ))}

        {/* Emergency Contact Button */}
        <div className="flex px-4 py-3 justify-center">
          <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#fbdd56] dark:bg-[#fbdd56] text-[#181711] dark:text-gray-900 text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Emergency Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
