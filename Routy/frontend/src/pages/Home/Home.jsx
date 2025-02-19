import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import heroImage from "../../assets/hero-Img2.png";
import S2I1 from "../../assets/How-KinderRide works-section/1.png";
import S2I2 from "../../assets/How-KinderRide works-section/2.png";
import S2I3 from "../../assets/How-KinderRide works-section/3.png";
import Header from "../../components/Header";
const Home = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <Header />
      <div
        className={`relative flex size-full min-h-screen flex-col bg-white dark:bg-[#141414] group/design-root overflow-x-hidden`}
        style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
      >
        <div className="layout-container flex h-full grow flex-col">
          <main className="px-4 md:px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
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
                  <button className="min-w-[84px] h-12 px-4 bg-[#F4C752] text-base font-bold rounded">
                    Get started
                  </button>
                </div>
              </section>

              {/* How KinderRide works Section */}
              <section className="flex flex-col gap-10 py-10">
                <p className="text-[24px] md:text-[32px] font-extrabold text-black dark:text-white">
                  How KinderRide works
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Card 1 */}
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      className="w-full bg-cover bg-center bg-no-repeat aspect-video rounded-xl"
                      style={{
                        backgroundImage: `url(${S2I1})`,
                      }}
                    ></div>
                    <div className="description">
                      <p className="text-base font-medium text-black dark:text-white">
                        Real-time tracking
                      </p>
                      <span className="text-[#6E7E8A] text-[13px] dark:text-[#A0AEC0]">
                        See the location of your child's school bus on a live
                        map.
                      </span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      className="w-full bg-cover bg-center bg-no-repeat aspect-video rounded-xl"
                      style={{
                        backgroundImage: `url(${S2I2})`,
                      }}
                    ></div>
                    <div className="description">
                      <p className="text-base font-medium text-black dark:text-white">
                        Automatic notifications
                      </p>
                      <span className="text-[#6E7E8A] text-[13px] dark:text-[#A0AEC0]">
                        Get notified when the bus is near, or if there are any
                        delays.
                      </span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="flex flex-col gap-3 pb-3">
                    <div
                      className="w-full bg-cover bg-center bg-no-repeat aspect-video rounded-xl"
                      style={{
                        backgroundImage: `url(${S2I3})`,
                      }}
                    ></div>
                    <div className="description">
                      <p className="text-base font-medium text-black dark:text-white">
                        Parent app
                      </p>
                      <span className="text-[#6E7E8A] text-[13px] dark:text-[#A0AEC0]">
                        Download the KinderRide app to track your child's bus
                        route and get real-time updates.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Testimonials Section */}
              <section className="flex flex-col gap-10 py-10">
                <p className="text-[24px] md:text-[32px] font-extrabold text-black dark:text-white">
                  Trusted by schools and parents
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <div
                      key={num}
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                      style={{
                        backgroundImage: `url("https://cdn.usegalileo.ai/sdxl10/${
                          num === 1
                            ? "25a4579a-0dcd-400e-8123-bb66783a7291"
                            : num === 2
                            ? "c7d06124-f84a-464b-8265-f9a266dad5c6"
                            : num === 3
                            ? "c70d67a5-e19b-4e8c-9d58-5435b406e638"
                            : "0f3a7d24-775c-4788-9f1e-0b7910d10b1b"
                        }.png")`,
                      }}
                    ></div>
                  ))}
                </div>
              </section>

              {/* Pricing Section */}
              <section className="flex flex-col gap-10 py-10">
                <p className="text-[24px] md:text-[32px] font-extrabold text-black dark:text-white">
                  How much does KinderRide cost?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2.5">
                  <div className="flex flex-col gap-4 rounded-xl border border-solid border-[#2F3B46] bg-white dark:bg-[#1B2127] p-6">
                    <h3 className="text-base font-bold text-black dark:text-white">
                      Standard School Plan
                    </h3>
                    <p className="text-4xl font-black text-black dark:text-white">
                      EGP 90<span className="text-base font-bold">/bus/mo</span>
                    </p>
                    <ul className="text-[13px] font-normal leading-normal text-black dark:text-white">
                      {[
                        "Real-time bus tracking for parents & school admins",
                        "Automatic pickup/drop-off notifications",
                        "Driver & route management dashboard",
                        "Trip history (last 7 days)",
                        "Unlimited parent app access for students on subscribed buses",
                      ].map((feature, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-black dark:text-white">✔</span>{" "}
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-4 rounded-xl border border-solid border-[#2F3B46] bg-white dark:bg-[#1B2127] p-6">
                    <h3 className="text-base font-bold text-black dark:text-white">
                      Premium School Plan
                    </h3>
                    <p className="text-4xl font-black text-black dark:text-white">
                      EGP 150
                      <span className="text-base font-bold">/bus/mo</span>
                    </p>
                    <ul className="text-[13px] font-normal leading-normal text-black dark:text-white">
                      {[
                        "All features from the Standard Plan",
                        "Extended trip history (last 30 days)",
                        "Emergency alert system with direct driver contact",
                        "Automatic notifications",
                        "Priority customer support for schools",
                        "Custom reporting & analytics for school administrators",
                      ].map((feature, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-black dark:text-white">✔</span>{" "}
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Home;
