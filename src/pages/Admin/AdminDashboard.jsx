import React, { useState, useEffect } from "react";
import AdminAnalytics from "./components/AdminAnalytics";
import { Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';

const BASE_URL = 'https://beta.techskims.tech/api'; 

function AdminDashboard() {
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    pendingProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/admin/profile`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          setAdminName(response.data.data.name);
        }
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        setError('Failed to load profile data');
      }
    };

    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${BASE_URL}/admin/analytics`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'success') {
          const data = response.data.data;
          setStats({
            totalProjects: data.totalProjects,
            completedProjects: data.completedProjects,
            ongoingProjects: data.ongoingProjects,
            pendingProjects: data.pendingProjects
          });
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
    fetchAdminStats();
  }, []);

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
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute md:relative h-screen overflow-y-scroll pb-10 scrollbar-custom">
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
            Welcome{adminName ? `, ${adminName}` : ''}
          </h1>
          <p className="text-[#666666] text-sm text-[500] pb-3">
            Here is a summary of the current activity
          </p>
        </div>
        <Link 
          to="/admin/projects" 
          className="bg-[#00a6e8] hover:bg-[#00a6e8]/80 transition-all duration-300 cursor-pointer rounded-[4px] h-[48px] w-fit flex items-center px-5 text-white whitespace-nowrap"
        >
          View All Projects
        </Link>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalProjects}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <Clock className="text-blue-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Ongoing Projects</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.ongoingProjects}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <Calendar className="text-purple-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Completed Projects</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.completedProjects}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-orange-500" size={24} />
            <div>
              <p className="text-sm text-gray-500">Pending Projects</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.pendingProjects}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute mt-10 right-0">
      <AdminAnalytics />
      </div>
    </div>
  );
}

export default AdminDashboard;
