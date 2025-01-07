import React, { useState, useEffect } from "react";
import { Filter, Search, Eye, Check, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Technicians = () => {
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate()
  
    useEffect(() => {
      fetchClients();
    }, [currentPage]);
  
    const fetchClients = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
  
        const response = await axios.get(
          "https://beta.techskims.tech/api/admin/technicians",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              Accept: "application/json",
            },
          }
        );
  
        if (response.data && response.data.data) {
          console.log('Client data:', response.data.data);
          setClients(response.data.data);
        } else {
          setClients([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        console.log("Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
  
        if (error.response?.status === 401) {
          console.log("Auth token used:", localStorage.getItem("authToken"));
        }
        setClients([]);
        setLoading(false);
      }
    };
  
    const handleSearch = (value) => {
      setSearchTerm(value);
    };
  
    const filteredClients = clients.filter((client) => {
      const matchesSearch =
        client.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.user.phone && client.user.phone.includes(searchTerm));
  
      if (!matchesSearch) return false;
  
      if (status === "all") return true;
      if (status === "pending" && client.pendingProjects > 0) return true;
      if (status === "ongoing" && client.ongoingProject > 0) return true;
      if (status === "completed" && client.completedProject > 0) return true;
      return false;
    });
  
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    const handleReset = () => {
      setStatus("all");
      setSearchTerm("");
      fetchClients();
    };
  
    const handleActivation = async (userId, action) => {
      try {
        const authToken = localStorage.getItem("authToken");
        
        console.log(`Sending ${action} request for user ${userId}`);
        console.log(`URL: https://beta.techskims.tech/api/admin/user/${userId}/${action}`);
  
        const response = await axios({
          method: 'post',
          url: `https://beta.techskims.tech/api/admin/user/${userId}/${action}`,
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
  
        console.log('Activation/Deactivation response:', response.data);
  
        if (response.data.status === "success") {
          toast.success(response.data.data);
          
          // Add a longer delay before fetching updated data
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Fetch fresh data
          const updatedResponse = await axios.get(
            "https://beta.techskims.tech/api/admin/technicians",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "application/json",
              },
            }
          );
  
          if (updatedResponse.data && updatedResponse.data.data) {
            // Log detailed information about the user we just updated
            const updatedUser = updatedResponse.data.data.find(client => client.user.id === userId);
            console.log('Updated user details:', {
              id: userId,
              status: updatedUser?.user.status,
              fullUserData: updatedUser
            });
  
            setClients(updatedResponse.data.data);
          }
        }
      } catch (error) {
        console.error(`Error ${action}ing client:`, error);
        console.error('Error response:', error.response?.data);
        
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          window.location.href = '/login';
        } else {
          toast.error(error.response?.data?.message || `Failed to ${action} client. Please try again.`);
        }
      }
    };
  
    return (
      <>
        {loading ? (
          <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading technicians...</p>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-64px)] overflow-y-auto bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 scrollbar-custom">
  
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
  
            <div className="mx-auto rounded-lg bg-[#F8F8F8] w-full">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900">Technicians</h1>
                <p className="text-sm text-gray-500">
                  Keep track and manage technicians here.
                </p>
              </div>
  
              {/* Filters and Search */}
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center md:gap-3 border rounded-[10px] md:p-1 w-fit">
                  <button className="flex items-center gap-1 md:gap-2 text-black font-[700] rounded-md px-1 md:px-3 py-2 text-sm md:text-base border-r ">
                    <svg
                      width="22"
                      height="24"
                      viewBox="0 0 22 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11 9.75C16.3848 9.75 20.75 7.73528 20.75 5.25C20.75 2.76472 16.3848 0.75 11 0.75C5.61522 0.75 1.25 2.76472 1.25 5.25C1.25 7.73528 5.61522 9.75 11 9.75Z"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.25 5.25C1.25253 9.76548 4.35614 13.688 8.75 14.729V21C8.75 22.2426 9.75736 23.25 11 23.25C12.2426 23.25 13.25 22.2426 13.25 21V14.729C17.6439 13.688 20.7475 9.76548 20.75 5.25"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Filter By
                  </button>
  
                  <select
                    className="rounded-md border-r bg-transparent outline-none font-[700] px-1 md:px-3 py-2 text-sm md:text-base"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
  
                  <button
                    className="font-[700] flex gap-2 text-sm md:text-base px-1 md:px-3 md:gap-4 text-[#EA0234]"
                    onClick={handleReset}
                  >
                    <svg
                      width="12"
                      height="16"
                      className="mt-[2px]"
                      viewBox="0 0 12 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 3.75V0.75L2.25 4.5L6 8.25V5.25C8.4825 5.25 10.5 7.2675 10.5 9.75C10.5 12.2325 8.4825 14.25 6 14.25C3.5175 14.25 1.5 12.2325 1.5 9.75H0C0 13.065 2.685 15.75 6 15.75C9.315 15.75 12 13.065 12 9.75C12 6.435 9.315 3.75 6 3.75Z"
                        fill="#EA0234"
                      />
                    </svg>
                    Reset Filter
                  </button>
                </div>
  
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search technicians by name..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-gray-300 focus:outline-none md:w-64"
                  />
                </div>
              </div>
  
              {/* Clients Table */}
              <div className="overflow-x-auto bg-white rounded-lg shadow scrollbar-custom">
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">
                        Client Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">
                        Completed Projects
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">
                        Ongoing Projects
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">
                        Pending Requests
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-black uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(paginatedClients) &&
                    paginatedClients.length > 0 ? (
                      paginatedClients.map((client) => (
                        <tr key={client.user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={
                                    client.user.thumbnail || "/default-avatar.png"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {client.user.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {client.user.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              {client.user.phone || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.completedProject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.ongoingProject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {client.pendingProjects}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              client.user.status === 'active'
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {client.user.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              navigate(`/admin/technicians/${client.user.id}`)
                            }
                            className="text-white bg-[#00A8E8] hover:bg-[#00A8E8]/80 p-1.5 rounded-md cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                            {client.user.status === 'active' ? (
                              <button 
                                onClick={() => handleActivation(client.user.id, 'deactivate')}
                                className="text-white bg-red-500 hover:bg-red-600 p-1.5 rounded-md cursor-pointer"
                                title="Deactivate"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleActivation(client.user.id, 'activate')}
                                className="text-white bg-green-500 hover:bg-green-600 p-1.5 rounded-md cursor-pointer"
                                title="Activate"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                        >
                          No clients found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
  
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-b-lg">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredClients.length)}
                      </span>{' '}
                      of <span className="font-medium">{filteredClients.length}</span> results
                    </p>
                  </div>
                  <div className="flex">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md bg-white px-2 py-2 text-gray-400 border-l border-t border-b border-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md bg-white px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

export default Technicians