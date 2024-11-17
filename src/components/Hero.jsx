import { useEffect, useState } from "react";
import ServiceRequestForm from "./ServiceRequestForm";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="home"
      className="bg-navy-blue text-white py-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-sky-blue/10 rounded-full -top-20 -left-20 blur-3xl animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-sky-blue/10 rounded-full -bottom-20 -right-20 blur-3xl animate-pulse delay-700"></div>

        {/* Additional animated elements */}
        <div className="absolute w-64 h-64 bg-sky-blue/5 rounded-full top-1/4 right-1/4 blur-2xl animate-pulse delay-500"></div>
        <div className="absolute w-48 h-48 bg-sky-blue/5 rounded-full bottom-1/4 left-1/4 blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sky-blue/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,31,63,0.2)_2px,transparent_2px),linear-gradient(90deg,rgba(0,31,63,0.2)_2px,transparent_2px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative pt-20 md:pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between h-full gap-12 z-[9999]">
          {/* Text Content */}
          <div
            className={`text-left flex-1 transform transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-20 opacity-0"
            }`}
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block transform transition-all duration-700 delay-300">
                Innovate
              </span>
              <span className="block text-sky-blue transform transition-all duration-700 delay-500">
                Transform
              </span>
              <span className="block transform transition-all duration-700 delay-700">
                Succeed
              </span>
            </h1>
            <p className="text-xl mb-8 text-gray-300 max-w-xl transform transition-all duration-700 delay-1000">
              Empowering businesses with cutting-edge technology solutions for
              the digital age
            </p>
            <div className="flex gap-4 transform transition-all duration-700 delay-1200">
              <div className="bg-sky-blue text-white px-8 py-3 rounded-full hover:bg-sky-700 transition duration-300 flex items-center whitespace-nowrap group">
                <ServiceRequestForm />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              {/* <a
                href="#contact"
                className="bg-sky-blue text-white px-8 py-3 rounded-full hover:bg-sky-700 transition duration-300 flex items-center whitespace-nowrap group"
              >
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a> */}
              <a
                href="#services"
                className="border-2 border-sky-blue text-sky-blue px-8 py-3 rounded-full flex items-center hover:bg-sky-blue whitespace-nowrap hover:text-white transition-all duration-300 hover:scale-105"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Animated Tech Elements */}
          <div
            className={`flex-1 transform md:mt-20 transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
          >
            <div className="relative w-full h-[400px] ">
              {/* Floating elements with hover effects */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-sky-blue/20 rounded-lg backdrop-blur-sm animate-float hover:bg-sky-blue/30 transition-colors duration-300"></div>
              <div className="absolute top-20 right-10 w-24 h-24 bg-sky-blue/30 rounded-full backdrop-blur-sm animate-float animation-delay-1000 hover:bg-sky-blue/40 transition-colors duration-300"></div>
              <div className="absolute bottom-20 left-20 w-40 h-40 bg-sky-blue/10 rounded-lg backdrop-blur-sm animate-float animation-delay-2000 hover:bg-sky-blue/20 transition-colors duration-300"></div>

              {/* Code snippets with enhanced styling */}
              <div className="absolute top-10 w-fit -left-36 lg:left-48 bg-navy-blue/90 p-4 rounded-lg backdrop-blur-sm border border-sky-blue/20 animate-float animation-delay-1500 hover:border-sky-blue/40 transition-all duration-300 hover:scale-105">
                <pre className="text-sky-blue text-sm">
                  <code>{`// Your Business Growth Plan
Step 1: Analyze Current Systems ✓
Step 2: Implement Solutions ✓
Step 3: Watch Your Business Grow ▶`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
