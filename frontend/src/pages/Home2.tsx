import React from "react";
import heroImage from "../assets/images/hero-Img2.png";
import S2I1 from "../assets/images/How-KinderRide works-section/1.png";
import S2I2 from "../assets/images/How-KinderRide works-section/2.png";
import S2I3 from "../assets/images/How-KinderRide works-section/3.png";
import FeatureCard from "@/components/ui/FeatureCard";
import PricingCard from "@/components/ui/PricingCard";

// Define TypeScript interfaces for props
interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
}

interface TestimonialCardProps {
  image: string;
}

// Constants for reusable data
const FEATURES: FeatureCardProps[] = [
  {
    image: S2I1,
    title: "Real-time tracking",
    description: "See the location of your child's school bus on a live map.",
  },
  {
    image: S2I2,
    title: "Automatic notifications",
    description:
      "Get notified when the bus is near, or if there are any delays.",
  },
  {
    image: S2I3,
    title: "Parent app",
    description:
      "Download the KinderRide app to track your child's bus route and get real-time updates.",
  },
];

const PRICING_PLANS: PricingCardProps[] = [
  {
    title: "Standard School Plan",
    price: "EGP 90/bus/mo",
    features: [
      "Real-time bus tracking for parents & school admins",
      "Automatic pickup/drop-off notifications",
      "Driver & route management dashboard",
      "Trip history (last 7 days)",
      "Unlimited parent app access for students on subscribed buses",
    ],
  },
  {
    title: "Premium School Plan",
    price: "EGP 150/bus/mo",
    features: [
      "All features from the Standard Plan",
      "Extended trip history (last 30 days)",
      "Emergency alert system with direct driver contact",
      "Automatic notifications",
      "Priority customer support for schools",
      "Custom reporting & analytics for school administrators",
    ],
  },
];

const TESTIMONIAL_IMAGES: string[] = [
  "https://cdn.usegalileo.ai/sdxl10/25a4579a-0dcd-400e-8123-bb66783a7291.png",
  "https://cdn.usegalileo.ai/sdxl10/c7d06124-f84a-464b-8265-f9a266dad5c6.png",
  "https://cdn.usegalileo.ai/sdxl10/c70d67a5-e19b-4e8c-9d58-5435b406e638.png",
  "https://cdn.usegalileo.ai/sdxl10/0f3a7d24-775c-4788-9f1e-0b7910d10b1b.png",
];

const TestimonialCard: React.FC<TestimonialCardProps> = ({ image }) => (
  <div
    className="w-full bg-cover bg-center bg-no-repeat aspect-square rounded-xl"
    style={{ backgroundImage: `url(${image})` }}
  ></div>
);

// Main Home Component
const Home2: React.FC = () => {
  return (
    <>
      <div
        className="relative flex size-full min-h-screen flex-col bg-white dark:bg-gray-900 group/design-root overflow-x-hidden"
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        <div className="flex h-full grow flex-col">
          <main className="px-4 md:px-40 flex flex-1 justify-center py-5">
            <div className="flex flex-col max-w-[1200px] flex-1">
              {/* Hero Section */}
              <section
                className="bg-cover bg-center bg-no-repeat min-h-[520px] flex flex-col gap-6 items-start justify-end px-4 pb-10 rounded-xl"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url(${heroImage})`,
                }}
              >
                <div className="px-5">
                  <p className="text-white text-3xl md:text-6xl font-extrabold mb-4">
                    Give parents peace of mind with real-time school bus
                    tracking
                  </p>
                  <button className="min-w-[84px] h-12 px-4 bg-[#F7B32B] text-base font-bold rounded">
                    Get started
                  </button>
                </div>
              </section>

              {/* How KinderRide Works Section */}
              <section className="flex flex-col gap-10 py-10">
                <p className="text-[24px] md:text-[32px] font-extrabold text-black dark:text-white">
                  How KinderRide works
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {FEATURES.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                  ))}
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="flex flex-col gap-10 py-10">
                <p className="text-[24px] md:text-[32px] font-extrabold text-black dark:text-white">
                  Trusted by schools and parents
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {TESTIMONIAL_IMAGES.map((image, index) => (
                    <TestimonialCard key={index} image={image} />
                  ))}
                </div>
              </section>

              {/* Pricing Section */}
              <section className="flex flex-col gap-10 py-10">
                <p className="text-[24px] md:text-[32px] font-extrabold text-black dark:text-white">
                  How much does KinderRide cost?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2.5">
                  {PRICING_PLANS.map((plan, index) => (
                    <PricingCard key={index} {...plan} />
                  ))}
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home2;
