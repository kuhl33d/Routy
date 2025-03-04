import React from "react";

interface SummaryCardProps {
  title: string;
  value: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => (
  <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#F4C752] dark:border-gray-700 bg-background dark:bg-gray-800">
    <p className="text-base font-medium leading-normal text-foreground dark:text-gray-200">
      {title}
    </p>
    <p className="text-2xl font-bold leading-tight tracking-light text-foreground dark:text-white">
      {value}
    </p>
  </div>
);

export default SummaryCard;
