import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/techskims4.png";
import bg from "../assets/bg.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { title: "Home", url: "/" },
    { title: "About", url: "/about" },
    { title: "Services", url: "/services" },
    { title: "Gallery", url: "/gallery" },
    { title: "Contact", url: "/contact" },
  ];

  return (
    <nav
      className="bg-navy-blue text-white fixed top-0 h-20 w-full z-50"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-start px-3 -ml-5 pt-1">
            <Link to="/">
              <img src={logo} alt="TechSkims" className="w-[220px]" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.url}
                  className="hover:text-sky-blue px-3 py-2 transition-colors duration-200 flex items-center gap-2 group"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="gap-2 hidden md:flex">
            <Link to="/signup">
              <button className="h-10 rounded-full border p-2 px-6">
                Client
              </button>
            </Link>
            <Link to="/signup">
              <button className="h-10 rounded-full bg-[#001F3F] p-2 px-6">
                Technician
              </button>
            </Link>
            <Link to="/login">
              <button className="h-10 rounded-full border p-2 px-6">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden z-[9999]">
            <button
              onClick={toggleMenu}
              className="relative w-10 h-10 mt-4 group focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-5">
                {/* Top line */}
                <span
                  className={`absolute top-0 right-0 w-4 h-[2px] bg-white transform transition-all duration-500 ease-in-out origin-right ${
                    isOpen
                      ? "rotate-45 translate-y-[2px] top-4 w-9 !left-0"
                      : "group-hover:w-5"
                  }`}
                ></span>
                {/* Middle line */}
                <span
                  className={`absolute top-1/2 -translate-y-1/2 left-0 w-6 h-[2px] bg-white transform transition-all duration-300 ease-in-out ${
                    isOpen ? "opacity-0 translate-x-3" : "group-hover:w-4"
                  }`}
                ></span>
                {/* Bottom line */}
                <span
                  className={`absolute bottom-0 left-0 w-5 h-[2px] bg-white transform transition-all duration-500 ease-in-out origin-left ${
                    isOpen
                      ? "-rotate-45 -translate-y-[2px] w-9"
                      : "group-hover:w-6"
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`transform h-screen overflow-y-auto -mt-16 fixed transition-all duration-500 ease-in-out ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } md:hidden absolute w-full bg-navy-blue z-50`}
      >
        <div className="flex flex-col justify-center items-center h-[80%] space-y-">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.url}
              className={`text-center font-bold text-4xl hover:text-sky-blue hover:bg-sky-blue/10 px-8 py-1 rounded-md transition-all duration-300 transform group flex flex-col items-center gap-2 ${
                isOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0"
              }`}
              style={{ transitionDelay: `${200 * index}ms` }}
              onClick={toggleMenu}
            >
              <span className="group-hover:translate-y-1 transition-transform duration-300">
                {item.title}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col mx-auto items-center justify-center -mt-14 gap-2 md:hidden">
          <Link to="/signup" onClick={toggleMenu}>
            <button className="h-10 rounded-full border p-2 px-6">
              Client
            </button>
          </Link>
          <Link to="/signup" onClick={toggleMenu}>
            <button className="h-10 rounded-full border p-2 px-6">
              Technician
            </button>
          </Link>
          <Link to="/login" onClick={toggleMenu}>
            <button className="h-10 rounded-full border p-2 px-6">Login</button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
