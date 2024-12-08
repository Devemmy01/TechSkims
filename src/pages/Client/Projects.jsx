import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  X, 
  Filter, 
  Search,
  Download,
  Edit as EditIcon,
  Eye,
  Image
} from "lucide-react";
import { Link } from 'react-router-dom';
import banner from '@/assets/banner.png'
import bannermob from '@/assets/bannermob.png'
import { Skeleton } from "@/components/ui/skeleton"

const BASE_URL = 'https://api.techskims.com/api';

function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        const response = await axios.get(`${BASE_URL}/client/requests`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.data.status === 'success') {
          const transformedData = response.data.data.map(project => ({
            id: project.id,
            service: project.service || project.projectType,
            startDate: project.startDate,
            endDate: project.completionDate || project.endDate,
            technicianTitle: project.technician?.name || project.technicianTitle,
            status: project.status?.toLowerCase() || 'pending'
          }));
          setRequests(transformedData);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, []);

  const itemsPerPage = 7;

   // Filter requests based on search term
   const filteredRequests = requests.filter(request => 
    request.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.technicianTitle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);
  
  const TableLoader = () => (
    <tbody>
      {[...Array(7)].map((_, index) => (
        <tr key={index} className="border-b">
          <td className="px-6 py-4"><Skeleton className="h-4 w-8" /></td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
          <td className="px-6 py-4"><Skeleton className="h-8 w-24 rounded-md" /></td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="bg-[#F8F8F8] w-full px-4 md:px-10 absolute lg:w-[calc(100%-256px)] pb-10">
      <div className="w-full items-center mt-10 pb-3">
        <div className='flex flex-col gap-2'>
          <h1 className="text-2xl font-[600] text-[#202224]">Projects</h1>
          <p className="text-[#666666] text-sm text-[500] pb-3">Manage your projects</p>
        </div>

        <img src={banner} alt="banner" className='w-full -mt-5 -ml-10 hidden md:block' />
        <img src={bannermob} alt="banner" className='w-full -mt-5 block md:hidden' />
      </div>

      
      <div className="overflow-x-auto border shadow-sm rounded-[8px] bg-white">
        <table className="w-full min-w-[800px] table-auto">
          <thead>
            <tr className="border-b text-sm text-gray-600 bg-gray-50">
              <th className="px-6 py-4 font-medium text-left w-16">ID</th>
              <th className="px-6 py-4 font-medium text-left">Project Type</th>
              <th className="px-6 py-4 font-medium text-left">Start Date</th>
              <th className="px-6 py-4 font-medium text-left">End Date</th>
              <th className="px-6 py-4 font-medium text-left">Technician</th>
              <th className="px-6 py-4 font-medium text-left">Status</th>
            </tr>
          </thead>
          {loading ? (
            <TableLoader />
          ) : (
            <tbody>
              {currentRequests.map((request) => (
                <tr key={request.id} className="border-b text-sm hover:bg-gray-50">
                  <td className="px-6 py-4 text-left">{request.id}</td>
                  <td className="px-6 py-4 text-left">{request.service}</td>
                  <td className="px-6 py-4 text-left">{request.startDate}</td>
                  <td className="px-6 py-4 text-left">{request.endDate}</td>
                  <td className="px-6 py-4 text-left font-medium text-gray-900">
                    {request.technicianTitle}
                  </td>
                  <td className="px-6 py-4 text-base capitalize text-left">
                    <span className={`px-4 py-2 rounded-md ${
                      request.status === 'completed' ? 'bg-green-100 text-[#00B69B]' :
                      request.status === 'pending' ? 'bg-[#ffa85633] text-[#FFA756]' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {!loading && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredRequests.length)} of {filteredRequests.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects; 