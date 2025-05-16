import React, { useState } from "react";

interface SidebarItem {
  icon: JSX.Element;
  label: string;
  isActive?: boolean;
}

const SidebarItem: React.FC<SidebarItem & { onClick: () => void }> = ({
  icon,
  label,
  isActive = false,
  onClick,
}) => (
  <div onClick={onClick} className="no-underline cursor-pointer">
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-full ${
        isActive
          ? "bg-[#F4C752] dark:bg-[#F4C752]"
          : "hover:bg-[#F4C752] dark:hover:bg-[#F4C752]"
      } transition-colors duration-200`}
    >
      <div className="text-foreground dark:text-gray-200">{icon}</div>
      <p className="text-foreground dark:text-gray-200 text-sm font-medium leading-normal">
        {label}
      </p>
    </div>
  </div>
);

const SmartSidebar: React.FC<{
  activeItem: string;
  setActiveItem: (item: string) => void;
  image: string;
  title: string;
  items: SidebarItem[];
}> = ({ activeItem, setActiveItem, image, title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (label: string) => {
    setActiveItem(label);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#F4EFE6] dark:bg-gray-700 rounded-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          fill="currentColor"
          viewBox="0 0 256 256"
          className={isOpen ? "hidden" : "block"}
        >
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-16 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40`}
      >
        {/* Sidebar Header */}
        <div className="flex gap-3 items-center p-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage: `url(${image})`,
            }}
          ></div>
          <h1 className="text-foreground dark:text-gray-200 text-base font-medium leading-normal">
            {title}
          </h1>
        </div>

        {/* Sidebar Items */}
        <div className="flex flex-col gap-2 p-4">
          {items.map((item, index) => (
            <SidebarItem
              key={index}
              {...item}
              isActive={activeItem === item.label}
              onClick={() => handleItemClick(item.label)}
            />
          ))}
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default SmartSidebar;
