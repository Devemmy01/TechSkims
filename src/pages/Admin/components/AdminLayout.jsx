import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-[9997]"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      <AdminSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`fixed top-[10px] z-[9998] rounded-lg lg:hidden p-2 text-gray-500 border border-[#E5E5E5] transition-transform duration-200 ease-in-out bg-white ${
            isMobileMenuOpen
              ? "translate-x-[250px]"
              : "translate-x-4 md:translate-x-10 "
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke="#202224"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 17H19M5 12H19M5 7H13"
            />
          </svg>
        </button>

        <div  className={`flex-1 transition-all mt-16 md:mt-0 h-[calc(100vh-64px)] bg-[#F8F8F8] duration-300 ${
          open ? "ml-0" : ""
        }`}
      >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
