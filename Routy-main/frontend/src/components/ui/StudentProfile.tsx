import React from "react";

const StudentProfile: React.FC = () => (
  <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 min-h-[72px] py-2 rounded-lg shadow-sm">
    <div
      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
      style={{
        backgroundImage:
          "url('https://cdn.usegalileo.ai/sdxl10/43d37d84-e8c1-485c-a249-5909bc0c181e.png')",
      }}
    ></div>
    <div className="flex flex-col justify-center">
      <p className="text-[#181711] dark:text-white text-base font-medium leading-normal line-clamp-1">
        Fawzia
      </p>
      <p className="text-[#8c835f] dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">
        Kindergarten • 5 years old
      </p>
    </div>
  </div>
);

export default StudentProfile;
