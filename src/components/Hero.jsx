import { useEffect, useState } from "react";
import bg from "../assets/bg.png";
import { Link } from "react-router-dom";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="home"
      className="bg-navy-blue text-white py-20 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
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
      {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(0,31,63,0.2)_2px,transparent_2px),linear-gradient(90deg,rgba(0,31,63,0.2)_2px,transparent_2px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div> */}

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
            <h1 className="text-[40px] lg:text-5xl font-bold mb-6 leading-tight">
            Empowering Your Business with Innovative Solutions
            </h1>
            <p className="text-base md:text-[17px] mb-8 text-gray-300 max-w-xl transform transition-all duration-700 delay-1000">
            Discover how our cutting-edge technology solutions streamline your operations and enhance productivity. From field service management to IT installations, we provide tailored services that drive success.
            </p>
            <div className="flex gap-4 transform transition-all duration-700 delay-1200">
              <Link
                to="/contact"
                className="bg-sky-blue text-white text-sm px-4 md:px-8 h-12 py-3 rounded-full hover:bg-sky-700 transition duration-300 flex items-center whitespace-nowrap group"
              >
                Get started
              </Link>
              <Link
                to="/services"
                className="border text-white text-sm px-4 md:px-8 h-12 rounded-full flex items-center whitespace-nowrap transition-all duration-300 hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Animated Tech Elements */}
          <div
            className={`flex-1 hidden md:block transform md:mt-20 transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-20 opacity-0"
            }`}
          >
            <div className="relative w-full h-[400px] ">
              {/* Floating elements with hover effects */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-sky-blue/20 rounded-lg backdrop-blur-sm hover:bg-sky-blue/30 transition-colors duration-300"></div>
              <div className="absolute top-20 right-10 w-24 h-24 bg-sky-blue/30 rounded-full backdrop-blur-sm animation-delay-1000 hover:bg-sky-blue/40 transition-colors duration-300"></div>
              <div className="absolute bottom-20 left-20 w-40 h-40 bg-sky-blue/10 rounded-lg backdrop-blur-sm animation-delay-2000 hover:bg-sky-blue/20 transition-colors duration-300"></div>

              {/* Code snippets with enhanced styling */}
              <div className="absolute top-10 w-fit -left-36 lg:left-48 bg-navy-blue/90 p-4 rounded-lg backdrop-blur-sm border border-sky-blue/20 animation-delay-1500 hover:border-sky-blue/40 transition-all duration-300 hover:scale-105">
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
      {/* Curvy Bottom Effect */}
      <svg
        className="absolute -bottom-14 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="rgba(0, 31, 63, 1)" // Match this color with your background
          d="M0,128L30,144C60,160,120,192,180,202.7C240,213,300,203,360,186.7C420,171,480,149,540,144C600,139,660,149,720,160C780,171,840,181,900,186.7C960,192,1020,192,1080,186.7C1140,181,1200,171,1260,160C1320,149,1380,139,1410,134.7L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320H0Z"
        ></path>
      </svg>
    </section>
  );
};

export default Hero;
