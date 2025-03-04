import React from "react";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
}) => (
  <div className="flex flex-col gap-3 pb-3">
    <div
      className="w-full bg-cover bg-center bg-no-repeat aspect-video rounded-xl"
      style={{ backgroundImage: `url(${image})` }}
    ></div>
    <div className="description">
      <p className="text-base font-medium text-black dark:text-white">
        {title}
      </p>
      <span className="text-[#6E7E8A] dark:text-gray-400 text-[13px]">
        {description}
      </span>
    </div>
  </div>
);

export default FeatureCard;
