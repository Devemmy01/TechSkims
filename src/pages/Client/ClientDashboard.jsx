import React, { useState, useEffect } from "react";
import StatsCards from "./components/StatsCards";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = 'https://beta.techskims.tech/api';

function ClientDashboard() {
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${BASE_URL}/client/profile`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          setClientName(response.data.data.name);
        }
      } catch (error) {
        console.error('Error fetching client profile:', error);
      }
    };

    fetchClientProfile();
  }, []);

  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10">
      <div className="flex items-center justify-between mt-10 pb-3">
        <div>
          <h1 className="text-2xl font-[600] text-[#202224]">
            Welcome{clientName ? `, ${clientName}` : ''}
          </h1>
          <p className="text-[#666666] text-sm text-[500] pb-3">
            Here is a summary of the current activity
          </p>
        </div>
        <Link 
          to="/client-dashboard/requests" 
          className="bg-[#00a6e8] hover:bg-[#00a6e8]/80 transition-all duration-300 cursor-pointer rounded-[4px] h-[48px] w-fit flex items-center px-5 text-white whitespace-nowrap"
        >
          New Request
        </Link>
      </div>
      <StatsCards />
      
    </div>
  );
}

export default ClientDashboard;
