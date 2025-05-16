import React from "react";

interface Ride {
  id: string;
  busId: string;
  routeId: string;
  studentIds: string[];
  startTime: Date;
  endTime: Date;
  status: string;
  notifications: {
    notification: string;
    time: Date;
    user: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal"
// Reusable RideCard Component
const RideCard: React.FC<{
  ride: Ride;
  onButtonClick: () => void;
  cardKey: number;
  goingToSchoolEnded: boolean;
}> = ({ ride, onButtonClick, cardKey, goingToSchoolEnded }) => (
  <div className="p-4">
    <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)] dark:shadow-[0_0_4px_rgba(255,255,255,0.1)]">
      <div className="flex flex-[2_2_0px] flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[#181711] dark:text-white text-base font-bold leading-tight">
            {cardKey === 0 ? "Going to School" : "Returning from School"}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal">
            {cardKey === 0
              ? ride.status
              : goingToSchoolEnded
              ? "Trip Started"
              : "Waiting for the active trip to End"}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal">
            {ride.start} - {ride.end}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal">
            Bus: {ride.busId?.busNumber || "N/A"} | Route:{" "}
            {ride.routeId?.name || "N/A"}
          </p>
          <p className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal">
            Driver: {ride.driverId?.userId?.name || "N/A"}
          </p>
        </div>
        <button
          onClick={onButtonClick}
          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 px-4 flex-row-reverse bg-[#F4C752] dark:bg-[#F4C752] text-[#181711] dark:text-gray-900 pr-2 gap-1 text-sm font-medium leading-normal w-fit"
        >
          <div className="text-[#181711] dark:text-gray-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18px"
              height="18px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
            </svg>
          </div>
          <span className="truncate">{ride.button}</span>
        </button>
      </div>
      <div
        className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex-1"
        style={{ backgroundImage: `url(${ride.img})` }}
      ></div>
    </div>
  </div>
);

export default RideCard;
