import React from "react";

interface Notification {
  title: string;
  message: string;
  time: string;
}

// Reusable NotificationCard Component
const NotificationCard: React.FC<Omit<Notification, "icon">> = ({
  title,
  message,
  time,
}) => (
  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-[72px] py-2 justify-between rounded-lg shadow-sm">
    <div className="flex items-center gap-4">
      <div className="text-[#181711] dark:text-gray-200 flex items-center justify-center rounded-lg bg-[#f5f4f0] dark:bg-gray-700 shrink-0 size-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z"></path>
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-[#181711] dark:text-white text-base font-medium leading-normal line-clamp-1">
          {title}
        </p>
        <p className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
          {message}
        </p>
      </div>
    </div>
    <div className="shrink-0">
      <p className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal">
        {time}
      </p>
    </div>
  </div>
);

export default NotificationCard;
