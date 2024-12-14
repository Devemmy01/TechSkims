import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import Services from "./Services";
import Projects from "./Projects";
import About from "./About";
import Contact from "./Contact";

import img from "../assets/guy.png";
import bg from "../assets/bgsec.png";
import lock from "../assets/lock.png";
import Section from "../components/Section";

const Home = () => {
  return (
    <>
      <Hero />
      <section className="bg-[#F7FBFF] p-5 md:p-20">
        <div className="flex flex-col md:flex-row justify-between h-full gap-6 md:gap-3 z-[9999]">
          <div className="text-left flex-1 mt-6">
            <p className="text-base font-[600] pb-2">Innovate</p>
            <h1 className="text-[32px] lg:text-[48px] font-bold mb-6 leading-tight">
              Transform Your Business with Our Comprehensive Technology
              Solutions
            </h1>
            <p className="text-base md:text-[17px] mb-8 max-w-xl transform transition-all duration-700 delay-1000">
              Redefining Business Success with Tailored and Comprehensive
              Technology Solutions.
            </p>
            <div className="flex gap-4 transform transition-all duration-700 delay-1200">
              <Link
                to="/contact"
                className="text-black border border-gray-600 text-sm px-4 md:px-8 h-12 py-3 rounded-full transition duration-300 flex items-center whitespace-nowrap group"
              >
                Get started
              </Link>
              <Link
                to="/services"
                className="border border-gray-600 text-sm px-4 md:px-8 h-12 rounded-full flex items-center whitespace-nowrap transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-[645px] mt-5 md:mt-0">
            <div>
              <svg
                width="48"
                height="50"
                className="mb-2"
                viewBox="0 0 48 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_439_1792)">
                  <path
                    d="M34 40C34 36.6863 29.5228 34 24 34C18.4772 34 14 36.6863 14 40M42 34.0007C42 31.5404 39.5318 29.4259 36 28.5M6 34.0007C6 31.5404 8.46819 29.4259 12 28.5M36 20.4722C37.2275 19.3736 38 17.777 38 16C38 12.6863 35.3137 10 32 10C30.4633 10 29.0615 10.5777 28 11.5278M12 20.4722C10.7725 19.3736 10 17.777 10 16C10 12.6863 12.6863 10 16 10C17.5367 10 18.9385 10.5777 20 11.5278M24 28C20.6863 28 18 25.3137 18 22C18 18.6863 20.6863 16 24 16C27.3137 16 30 18.6863 30 22C30 25.3137 27.3137 28 24 28Z"
                    stroke="#00A8E8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <filter
                    id="filter0_d_439_1792"
                    x="-4"
                    y="0"
                    width="56"
                    height="56"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset dy="4" />
                    <feGaussianBlur stdDeviation="2" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow_439_1792"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_439_1792"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>

              <h1 className="text-[24px] lg:text-[36px] font-bold mb-6 leading-tight">
                Field Service Management Tailored for You
              </h1>
              <p className="text-base md:text-[17px] mb-8 max-w-xl transform transition-all duration-700 delay-1000">
                Streamline your operations with our expert solutions.
              </p>
            </div>

            <div>
              <svg
                width="49"
                height="48"
                className="mb-2"
                viewBox="0 0 49 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30.5 40H18.5M8.5 27.6004V16.4004C8.5 14.1602 8.5 13.0392 8.93597 12.1836C9.31947 11.4309 9.93095 10.8195 10.6836 10.436C11.5392 10 12.6602 10 14.9004 10H34.1004C36.3406 10 37.4591 10 38.3148 10.436C39.0674 10.8195 39.681 11.4309 40.0645 12.1836C40.5 13.0384 40.5 14.158 40.5 16.3938V27.6062C40.5 29.842 40.5 30.96 40.0645 31.8148C39.681 32.5674 39.0674 33.181 38.3148 33.5645C37.46 34 36.342 34 34.1062 34H14.8938C12.658 34 11.5384 34 10.6836 33.5645C9.93095 33.181 9.31947 32.5674 8.93597 31.8148C8.5 30.9591 8.5 29.8406 8.5 27.6004Z"
                  stroke="#00A8E8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h1 className="text-[24px] lg:text-[36px] font-bold mb-6 leading-tight">
                Reliable IT Installations for Seamless Performance
              </h1>
              <p className="text-base md:text-[17px] mb-8 max-w-xl transform transition-all duration-700 delay-1000">
                We provide top-notch installations to boost productivity.
              </p>
            </div>

            <div>
              <svg
                width="48"
                height="48"
                className="pb-2"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6855 29.1797C17.6172 28.1806 18.7437 27.383 19.9956 26.8361C21.2474 26.2892 22.5991 26.0049 23.9652 26.0001C25.3313 25.9954 26.6837 26.2707 27.9393 26.8089C29.195 27.347 30.3274 28.1366 31.2661 29.1292M12.2988 23.0879C13.7895 21.4893 15.5919 20.2131 17.5949 19.338C19.5979 18.463 21.7585 18.0078 23.9443 18.0001C26.13 17.9925 28.2931 18.433 30.3022 19.2941C32.3112 20.1551 34.1235 21.4188 35.6253 23.007M6.44727 17.6327C8.6833 15.2348 11.3869 13.3206 14.3914 12.008C17.3958 10.6954 20.6358 10.0116 23.9145 10.0001C27.1931 9.9887 30.4417 10.6494 33.4552 11.941C36.4687 13.2326 39.1862 15.1292 41.4389 17.5114M24 38.0001C22.8954 38.0001 22 37.1047 22 36.0001C22 34.8956 22.8954 34.0001 24 34.0001C25.1046 34.0001 26 34.8956 26 36.0001C26 37.1047 25.1046 38.0001 24 38.0001Z"
                  stroke="#00A8E8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h1 className="text-[24px] lg:text-[36px] font-bold mb-6 leading-tight">
                Network and Equipment Refresh for Modern Needs
              </h1>
              <p className="text-base md:text-[17px] mb-8 max-w-xl transform transition-all duration-700 delay-1000">
                Upgrade your infrastructure to stay ahead of the curve.
              </p>
            </div>

            <div>
              <svg
                width="49"
                height="48"
                className="pb-2"
                viewBox="0 0 49 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30.5 38C30.5 33.5817 25.1274 30 18.5 30C11.8726 30 6.5 33.5817 6.5 38M34.1562 10.3438C34.8991 11.0866 35.4884 11.9685 35.8904 12.9391C36.2925 13.9097 36.4998 14.9507 36.4998 16.0012C36.4998 17.0518 36.2927 18.0899 35.8906 19.0605C35.4886 20.0312 34.8991 20.9141 34.1562 21.657M38.5 6C39.8132 7.31322 40.8549 8.87223 41.5656 10.588C42.2763 12.3038 42.6437 14.1425 42.6437 15.9997C42.6437 17.8569 42.2771 19.6963 41.5664 21.4121C40.8557 23.1279 39.8132 24.6871 38.5 26.0003M18.5 24C14.0817 24 10.5 20.4183 10.5 16C10.5 11.5817 14.0817 8 18.5 8C22.9183 8 26.5 11.5817 26.5 16C26.5 20.4183 22.9183 24 18.5 24Z"
                  stroke="#00A8E8"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h1 className="text-[24px] lg:text-[36px] font-bold mb-6 leading-tight">
                Your Partner in Technology and Support
              </h1>
              <p className="text-base md:text-[17px] mb-8 max-w-xl transform transition-all duration-700 delay-1000">
                Count on us for ongoing support and expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white p-5 md:p-20">
        <div className="flex-1 mt-6 mb-14 text-center">
          <p className="text-base font-[600] pb-2">Streamline</p>
          <h1 className="text-[36px] lg:text-5xl font-bold mb-6 leading-tight">
            Streamlining and Enhancing Your Workflows
          </h1>
          <p className="text-base mb-8 transform transition-all duration-700 delay-1000">
            Enhancing efficiency through innovative solutions and technology.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full flex gap-5 flex-col md:flex-row">
            <div className="border border-gray-600 w-full rounded-[20px] p-3 py-10 flex flex-col gap-1 ">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36 24V34C36 37.3137 30.6274 40 24 40C17.3726 40 12 37.3137 12 34V24M36 24V14M36 24C36 27.3137 30.6274 30 24 30C17.3726 30 12 27.3137 12 24M36 14C36 10.6863 30.6274 8 24 8C17.3726 8 12 10.6863 12 14M36 14C36 17.3137 30.6274 20 24 20C17.3726 20 12 17.3137 12 14M12 24V14"
                  stroke="#00A8E8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h1 className="text-[24px] font-bold mb-6 leading-tight">
                Seamless Integration of Services
              </h1>
              <p className="text-base -mt-3 max-w-xl transform transition-all duration-700 delay-1000">
                Simplifying your workflow for better productivity.
              </p>

              <Link
                to="/contact"
                className="flex gap-4 text-sm h-12 py-3 rounded-full transition duration-300 items-center whitespace-nowrap group"
              >
                Get started{" "}
                <svg
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.70697 11.9496L7.41397 6.24264L1.70697 0.535645L0.292969 1.94964L4.58597 6.24264L0.292969 10.5356L1.70697 11.9496Z"
                    fill="black"
                  />
                </svg>
              </Link>
            </div>

            <div className="border border-gray-600 w-full rounded-[20px] p-3 py-11 flex flex-col gap-1 ">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36 24V34C36 37.3137 30.6274 40 24 40C17.3726 40 12 37.3137 12 34V24M36 24V14M36 24C36 27.3137 30.6274 30 24 30C17.3726 30 12 27.3137 12 24M36 14C36 10.6863 30.6274 8 24 8C17.3726 8 12 10.6863 12 14M36 14C36 17.3137 30.6274 20 24 20C17.3726 20 12 17.3137 12 14M12 24V14"
                  stroke="#00A8E8"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h1 className="text-[24px] font-bold mb-6 leading-tight">
                Tailored Solutions for Your Business
              </h1>
              <p className="text-base -mt-3 max-w-xl transform transition-all duration-700 delay-1000">
                Customizable options to meet your unique needs.
              </p>

              <Link
                to="/contact"
                className="flex gap-4 text-sm h-12 py-3 rounded-full transition duration-300 items-center whitespace-nowrap group"
              >
                Get started{" "}
                <svg
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.70697 11.9496L7.41397 6.24264L1.70697 0.535645L0.292969 1.94964L4.58597 6.24264L0.292969 10.5356L1.70697 11.9496Z"
                    fill="black"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-full lg:w-[1400px] items-center border border-gray-600 rounded-[20px]">
            <img src={img} alt="" />

            <div className="p-3 flex flex-col gap-1 ">
              <p className="font-bold">Efficiency</p>
              <h1 className="text-[24px] font-bold mb-6 leading-tight">
                Expert Support When You Need It
              </h1>
              <p className="text-base -mt-3 max-w-xl transform transition-all duration-700 delay-1000">
                Dedicated assistance for seamless operations.
              </p>

              <Link
                to="/contact"
                className="flex gap-4 text-sm h-12 py-3 mt-5 rounded-full transition duration-300 items-center whitespace-nowrap group"
              >
                Get started{" "}
                <svg
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.70697 11.9496L7.41397 6.24264L1.70697 0.535645L0.292969 1.94964L4.58597 6.24264L0.292969 10.5356L1.70697 11.9496Z"
                    fill="black"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-navy-blue text-white  p-5 md:p-20 relative overflow-hidden"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full flex flex-col md:flex-row justify-between">
          <div className="w-full">
            <div className="flex-1 mt-6 mb-14">
              <p className="text-base font-[600] pb-2">Empower</p>
              <h1 className="text-[36px] lg:text-5xl font-bold mb-6 leading-tight">
                Unlock the Full Potential of Your Business
              </h1>
              <p className="text-base mb-8 transform transition-all duration-700 delay-1000">
                Our services streamline operations, enhance efficiency, and
                drive growth. Experience the transformation that comes with
                expert support and innovative solutions.
              </p>
            </div>

            <div className="flex flex-col gap-5 md:flex-row">
              <div className="grid gap-2">
                <h1 className="font-[700] text-[48px] text-white">50%</h1>
                <p className="text-base">
                  Increase productivity with our tailored solutions.
                </p>
              </div>
              <div className="grid gap-2">
                <h1 className="font-[700] text-[48px] text-white">50%</h1>
                <p className="text-base">
                  Reduce downtime and enhance service delivery.
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-10 transform transition-all duration-700 delay-1200">
              <Link
                to="/contact"
                className="text-white border border-white text-sm px-4 md:px-8 h-12 py-3 rounded-full transition duration-300 flex items-center whitespace-nowrap group"
              >
                Get started
              </Link>
              <Link
                to="/services"
                className="text-sm px-4 md:px-8 h-12 rounded-full flex gap-4 items-center whitespace-nowrap transition-all duration-300 hover:scale-105"
              >
                Learn More{" "}
                <svg
                  width="24"
                  height="24"
                  className="flex items-center mt-[2.3px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.70697 16.9496L15.414 11.2426L9.70697 5.53564L8.29297 6.94964L12.586 11.2426L8.29297 15.5356L9.70697 16.9496Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <img src={lock} alt="" />
        </div>
      </section>

      <div className="pb-16">
        <Section />
      </div>
    </>
  );
};

export default Home;
