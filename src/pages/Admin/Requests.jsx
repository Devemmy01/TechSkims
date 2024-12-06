import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://beta.techskims.tech/api';

export default function Requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    technicianTitle: "",
    location: "",
    contactNo: "",
    startDate: "",
    startTime: "",
    description: "",
    specialTools: "",
    pickupLocation: "",
    payType: "",
    rate: "",
    request_images: [],
  });

  const itemsPerPage = 7;

  // Check authentication
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      toast.error('Please login to access this page');
      navigate('/login');
      return false;
    }
    
    if (userRole !== 'admin') {
      toast.error("You don't have permission to access this page");
      navigate('/login');
      return false;
    }
    
    return true;
  };

  // Check auth on component mount
  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      fetchRequests();
    }
  }, []);

  // Fetch requests with auth check
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${BASE_URL}/admin/requests`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Add detailed logging
      console.log('Full Response:', response);
      console.log('Response Data:', response.data);
      console.log('Requests Array:', response.data.data);
      if (response.data.data && response.data.data.length > 0) {
        console.log('First Request Object:', response.data.data[0]);
        console.log('Images in first request:', response.data.data[0].request_images);
      }

      if (response.data.data) {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to fetch requests');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format time to H:i format
  const formatTimeToHi = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  // Handle request update with auth check
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    if (!checkAuth()) return;

    try {
      const token = localStorage.getItem('token');
      
      // Format the data before sending
      const formattedData = {
        ...editFormData,
        startTime: formatTimeToHi(editFormData.startTime)
      };

      const response = await axios.put(
        `${BASE_URL}/admin/requests/${selectedRequest.id}`,
        formattedData,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Request updated successfully');
        setShowEditModal(false);
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else if (error.response?.data?.error_message) {
        // Show specific validation errors
        const errorMessages = Object.values(error.response.data.error_message)
          .flat()
          .join(', ');
        toast.error(errorMessages);
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update request');
      }
    }
  };

  // Generate PDF
  const generatePDF = (request) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Request Details', 20, 20);
    
    // Add request information
    doc.setFontSize(12);
    const data = [
      ['Technician Title', request.technicianTitle],
      ['Location', request.location],
      ['Contact Number', request.contactNo],
      ['Start Date', request.startDate],
      ['Start Time', request.startTime],
      ['Description', request.description],
      ['Special Tools', request.specialTools],
      ['Pickup Location', request.pickupLocation],
      ['Pay Type', request.payType],
      ['Rate', request.rate],
      ['Status', request.status]
    ];

    doc.autoTable({
      startY: 30,
      head: [['Field', 'Value']],
      body: data,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 168, 232] },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 100 }
      }
    });

    // Save the PDF
    doc.save(`request-${request.id}.pdf`);
  };

  // Filter requests based on search term
  const filteredRequests = requests.filter(request => 
    request.technicianTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requests...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8">
          <div className="mx-auto rounded-lg bg-[#F8F8F8] w-full p- shadow-sm">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Client Requests</h1>
              <p className="text-sm text-gray-500">Manage client requests here.</p>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                  <Filter className="h-4 w-4" />
                  Filter By
                </button>
                
                <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                  <option>Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <button className="text-sm text-red-500">Reset Filter</button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-gray-300 focus:outline-none md:w-64"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] table-auto">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Id</th>
                    <th className="pb-3 font-medium">Client Name</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Images</th>
                    <th className="pb-3 font-medium">Start Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
                    <tr key={request.id} className="border-b text-sm">
                      <td className="py-4">{request.id}</td>
                      <td className="py-4">{request.technicianTitle}</td>
                      <td className="py-4">{request.location}</td>
                      <td className="py-4">
                        <div className="flex -space-x-2">
                          {request.request_images?.map((image, index) => (
                            <img
                              key={index}
                              src={`https://beta.techskims.tech/storage/${image.image}`}
                              alt={`Request ${request.id} image ${index + 1}`}
                              className="h-8 w-8 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {request.request_images?.length > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs">
                              +{request.request_images.length - 3}
                            </div>
                          )}
                          {(!request.request_images || request.request_images.length === 0) && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                              <Image className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4">{request.startDate}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowViewModal(true);
                            }}
                            className="rounded-full p-1 text-blue-500 hover:bg-blue-50"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedRequest(request);
                              setEditFormData({
                                technicianTitle: request.technicianTitle,
                                location: request.location,
                                contactNo: request.contactNo,
                                startDate: request.startDate,
                                startTime: request.startTime,
                                description: request.description,
                                specialTools: request.specialTools,
                                pickupLocation: request.pickupLocation,
                                payType: request.payType,
                                rate: request.rate,
                                request_images: request.request_images,
                              });
                              setShowEditModal(true);
                            }}
                            className="rounded-full p-1 text-green-500 hover:bg-green-50"
                            title="Edit Request"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => generatePDF(request)}
                            className="rounded-full p-1 text-gray-500 hover:bg-gray-50"
                            title="Download PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
          </div>

          {/* View Modal */}
          {showViewModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-xl font-semibold mb-4">Request Details</h2>
                
                {/* Add Images Section */}
                <div className="mb-6">
                  <label className="text-base font-medium text-[#606060] block mb-2">Request Images</label>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedRequest.request_images?.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <img
                          src={`https://beta.techskims.tech/storage/${image.image}`}
                          alt={`Request image ${index + 1}`}
                          className="rounded-lg object-cover w-full h-full"
                        />
                      </div>
                    ))}
                    {(!selectedRequest.request_images || selectedRequest.request_images.length === 0) && (
                      <div className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg">
                        <Image className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">No images</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-base font-medium text-[#606060]">Client Name</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.technicianTitle}</p>
                  </div>
                  <div>
                    <label className="text-base font-medium text-[#606060]">Location</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.location}</p>
                  </div>
                  <div>
                    <label className="text-base font-medium text-[#606060]">Contact Number</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.contactNo}</p>
                  </div>
                  <div>
                    <label className="text-base font-medium text-[#606060]">Start Date & Time</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.startDate} {selectedRequest.startTime}</p>
                  </div>
                  <div>
                    <label className="text-base font-medium text-[#606060]">Description</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.description}</p>
                  </div>
                  <div>
                    <label className="text-base font-medium text-[#606060]">Special Tools</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.specialTools}</p>
                  </div>
                  <div>
                    <label className="text-base font-medium text-[#606060]">Pickup Location</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.pickupLocation}</p>
                  </div>
                  <div>
                    <label className="text-base font-medium text-[#606060]">Payment Details</label>
                    <p className="font-medium text-gray-400 bg-[#F5F6FA] border border-[#D5D5D5] p-3 rounded-md px-4">{selectedRequest.payType} - {selectedRequest.rate}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => generatePDF(selectedRequest)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Modal */}
          {showEditModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Request</h2>
                <form onSubmit={handleUpdateRequest} className="grid gap-4">
                  {/* Add Images Section if editing is allowed */}
                  <div>
                    <label className="text-base font-medium text-[#606060] block mb-2">Current Images</label>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {editFormData.request_images?.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={`https://beta.techskims.tech/storage/${image.image}`}
                            alt={`Request image ${index + 1}`}
                            className="rounded-lg object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...editFormData.request_images];
                              newImages.splice(index, 1);
                              setEditFormData({...editFormData, request_images: newImages});
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-500">Technician Title</label>
                    <input
                      type="text"
                      value={editFormData.technicianTitle}
                      onChange={(e) => setEditFormData({...editFormData, technicianTitle: e.target.value})}
                      className="w-full mt-1 rounded-md border border-gray-200 p-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Location</label>
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                      className="w-full mt-1 rounded-md border border-gray-200 p-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Contact Number</label>
                    <input
                      type="text"
                      value={editFormData.contactNo}
                      onChange={(e) => setEditFormData({...editFormData, contactNo: e.target.value})}
                      className="w-full mt-1 rounded-md border border-gray-200 p-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Start Date</label>
                      <input
                        type="date"
                        value={editFormData.startDate}
                        onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                        className="w-full mt-1 rounded-md border border-gray-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Start Time (24-hour format)</label>
                      <input
                        type="time"
                        value={editFormData.startTime}
                        onChange={(e) => setEditFormData({...editFormData, startTime: e.target.value})}
                        className="w-full mt-1 rounded-md border border-gray-200 p-2"
                        step="60"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Description</label>
                    <textarea
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      className="w-full mt-1 rounded-md border border-gray-200 p-2"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Special Tools</label>
                    <textarea
                      value={editFormData.specialTools}
                      onChange={(e) => setEditFormData({...editFormData, specialTools: e.target.value})}
                      className="w-full mt-1 rounded-md border border-gray-200 p-2"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Pickup Location</label>
                    <input
                      type="text"
                      value={editFormData.pickupLocation}
                      onChange={(e) => setEditFormData({...editFormData, pickupLocation: e.target.value})}
                      className="w-full mt-1 rounded-md border border-gray-200 p-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500">Pay Type</label>
                      <select
                        value={editFormData.payType}
                        onChange={(e) => setEditFormData({...editFormData, payType: e.target.value})}
                        className="w-full mt-1 rounded-md border border-gray-200 p-2"
                      >
                        <option value="">Select pay type</option>
                        <option value="flat">Flat</option>
                        <option value="hourly">Hourly</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Rate</label>
                      <input
                        type="number"
                        value={editFormData.rate}
                        onChange={(e) => setEditFormData({...editFormData, rate: e.target.value})}
                        className="w-full mt-1 rounded-md border border-gray-200 p-2"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

