import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, BarChart2, PieChart } from 'lucide-react';

const BASE_URL = 'https://beta.techskims.tech/api';

const dateRangeOptions = [
  { label: 'This Month', value: 'month' },
  { label: 'This Quarter', value: 'quarter' },
  { label: 'This Year', value: 'year' },
  { label: 'All Time', value: '' }
];

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalOverallProjects: 0,
    totalProjects: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    pendingProjects: 0,
    range: 'month'
  });
  
  const [selectedRange, setSelectedRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange]);

  const fetchAnalytics = async (range) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const endpoint = range ? `${BASE_URL}/admin/analytics/${range}` : `${BASE_URL}/admin/analytics`;
      
      const response = await axios.get(endpoint, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        const data = response.data.data;
        
        const completed = data.completedProjects || 0;
        const ongoing = data.ongoingProjects || 0;
        const pending = data.pendingProjects || 0;
        const total = data.totalProjects || 0;
        
        setAnalytics({
          totalOverallProjects: data.totalOverallProjects || 0,
          totalProjects: total,
          completedProjects: completed,
          ongoingProjects: ongoing,
          pendingProjects: pending,
          range: data.range || range || ''
        });
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('An error occurred while fetching analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (value, total) => {
    if (!total || total <= 0) return 0;
    return Math.round((value / total) * 100);
  };

  const completionPercentage = calculatePercentage(analytics.completedProjects, analytics.totalProjects);

  const getTimePeriodLabel = () => {
    switch(selectedRange) {
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      case 'year': return 'This Year';
      default: return 'All Time';
    }
  };

  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute md:relative h-screen overflow-y-scroll pb-8 pt-7 scrollbar-custom">
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Admin Analytics</h2>
        <div className="flex items-center space-x-2">
          <select 
            className="bg-white border border-gray-300 rounded-md py-2 px-4 text-sm"
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
          >
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Calendar className="mr-2 text-blue-500" size={20} />
          <h3 className="text-lg font-medium">Time Period: {getTimePeriodLabel()}</h3>
        </div>
        <p className="text-gray-600">
          This dashboard shows analytics for your projects during the selected time period. 
          Switch between different time ranges to see how your project metrics change over time.
        </p>
      </div>
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="space-y-6 mt-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart2 className="mr-2 text-blue-500" size={20} />
                Projects Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <div className="flex items-center">
                    <span className="font-medium">{analytics.completedProjects}</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {Math.min(calculatePercentage(analytics.completedProjects, analytics.totalProjects), 100)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(calculatePercentage(analytics.completedProjects, analytics.totalProjects), 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ongoing</span>
                  <div className="flex items-center">
                    <span className="font-medium">{analytics.ongoingProjects}</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {Math.min(calculatePercentage(analytics.ongoingProjects, analytics.totalProjects), 100)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(calculatePercentage(analytics.ongoingProjects, analytics.totalProjects), 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <div className="flex items-center">
                    <span className="font-medium">{analytics.pendingProjects}</span>
                    <span className="ml-2 text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                      {Math.min(calculatePercentage(analytics.pendingProjects, analytics.totalProjects), 100)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(calculatePercentage(analytics.pendingProjects, analytics.totalProjects), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <PieChart className="mr-2 text-blue-500" size={20} />
                Overall Completion
              </h3>
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f0f0f0"
                      strokeWidth="4"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#00A8E8"
                      strokeWidth="4"
                      strokeDasharray={`${completionPercentage}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-bold text-gray-800">{Math.min(completionPercentage, 100)}%</span>
                    <span className="text-sm text-gray-500">Completed</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Total Projects</div>
                    <div className="text-xl font-semibold">{analytics.totalProjects}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Completed</div>
                    <div className="text-xl font-semibold">{analytics.completedProjects}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">In Progress</div>
                    <div className="text-xl font-semibold">{analytics.ongoingProjects}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Pending</div>
                    <div className="text-xl font-semibold">{analytics.pendingProjects}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics; 