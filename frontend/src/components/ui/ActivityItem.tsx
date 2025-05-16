import React from "react";

interface Activity {
  icon: JSX.Element;
  title: string;
  description: string;
  time: string;
}

const ActivityItem: React.FC<Activity> = ({
  icon,
  title,
  description,
  time,
}) => (
  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-[72px] py-2 justify-between">
    <div className="flex items-center gap-4">
      <div className="text-foreground dark:text-gray-200 flex items-center justify-center rounded-lg bg-[#F4EFE6] dark:bg-gray-700 shrink-0 size-12">
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-foreground dark:text-gray-200 text-base font-medium leading-normal line-clamp-1">
          {title}
        </p>
        <p className="text-[#A18249] dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
          {description}
        </p>
      </div>
    </div>
    <div className="shrink-0">
      <p className="text-[#A18249] dark:text-gray-400 text-sm font-normal leading-normal">
        {time}
      </p>
    </div>
  </div>
);

export default ActivityItem;
