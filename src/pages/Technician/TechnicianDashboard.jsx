import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import TechnicianAnalytics from "./components/TechnicianAnalytics"; // Assuming you have a similar analytics component

const BASE_URL = 'https://beta.techskims.tech/api';

function TechnicianDashboard() {
  const [technicianName, setTechnicianName] = useState('');
  const [stats, setStats] = useState({
    completedTasks: 0,
    ongoingTasks: 0,
    upcomingTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTechnicianProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/technician/profile`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          setTechnicianName(response.data.data.name);
        }
      } catch (error) {
        console.error('Error fetching technician profile:', error);
        setError('Failed to load profile data');
      }
    };

    const fetchTechnicianStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/technician/analytics`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          const data = response.data.data;
          
          const completed = data.completedTasks || 0;
          const ongoing = data.ongoingTasks || 0;
          const pending = data.pendingTasks || 0;
          const total = data.totalTasks || 0;
          
          const upcoming = Math.max(0, total - (completed + ongoing + pending));
          
          setStats({
            completedTasks: completed,
            ongoingTasks: ongoing,
            upcomingTasks: upcoming,
            pendingTasks: pending
          });
        }
      } catch (error) {
        console.error('Error fetching technician stats:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicianProfile();
    fetchTechnicianStats();
  }, []);

  useEffect(() => {
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/67c6bf8eb5d977190f13cc17/1ilg6n4kd'; // Correct widget URL for technician
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  const statsData = [
    {
      label: "Completed Tasks",
      value: stats.completedTasks.toString(),
      icon: <CheckCircle className="text-green-500" size={24} />,
    },
    {
      label: "Ongoing Tasks",
      value: stats.ongoingTasks.toString(),
      icon: <Clock className="text-blue-500" size={24} />,
    },
    {
      label: "Upcoming Tasks",
      value: stats.upcomingTasks.toString(),
      icon: <Calendar className="text-purple-500" size={24} />,
    },
    {
      label: "Pending Tasks",
      value: stats.pendingTasks.toString(),
      icon: <AlertCircle className="text-orange-500" size={24} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg m-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute md:relative h-screen overflow-y-scroll scrollbar-custom">
      <style jsx>{`
            .scrollbar-custom::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 4px;
            }
            .scrollbar-custom::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}</style>
      <div className="flex items-center justify-between mt-10 pb-3">
        <div>
          <h1 className="text-2xl font-[600] text-[#202224]">
            Welcome{technicianName ? `, ${technicianName}` : ''}
          </h1>
          <p className="text-[#666666] text-sm text-[500] pb-3">
            Here is a summary of the current activity
          </p>
        </div>
        <Link 
          to="/technician-dashboard/projects" 
          className="bg-[#00a6e8] hover:bg-[#00a6e8]/80 transition-all duration-300 cursor-pointer rounded-[4px] h-[48px] w-fit flex items-center px-5 text-white whitespace-nowrap"
        >
          View Projects
        </Link>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <TechnicianAnalytics />
      
    </div>
  );
}

export default TechnicianDashboard;