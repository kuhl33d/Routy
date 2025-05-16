import React from "react";

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  features,
}) => (
  <div className="flex flex-col gap-4 rounded-xl border border-solid border-[#2F3B46] dark:border-gray-600 bg-white dark:bg-gray-800 p-6">
    <h3 className="text-base font-bold text-black dark:text-white">{title}</h3>
    <p className="text-4xl font-black text-black dark:text-white">
      {price.split("/")[0]}
      <span className="text-base font-bold dark:text-gray-300">
        /{price.split("/")[1]}
      </span>
    </p>
    <ul className="text-[13px] font-normal leading-normal text-black dark:text-gray-300">
      {features.map((feature, index) => (
        <li key={index} className="flex gap-3">
          <span className="text-black dark:text-gray-300">✔</span> {feature}
        </li>
      ))}
    </ul>
  </div>
);

export default PricingCard;
