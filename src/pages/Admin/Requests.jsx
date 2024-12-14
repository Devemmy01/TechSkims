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
import logo from '@/assets/techskims3.png';

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
    client: "",
    service: "",
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
    images: [],
    deliveryInstructions: "",
  });

  const itemsPerPage = 5;

  // Add new state for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updatedRequest, setUpdatedRequest] = useState(null);

  // Add status state at the top with other state declarations
  const [status, setStatus] = useState("all");

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
      const token = localStorage.getItem('authToken');

      console.log('Fetching requests with token:', token); // Debug log

      const response = await axios.get(`${BASE_URL}/admin/requests`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Add detailed logging
      console.log('API Response:', response);
      console.log('Response Data:', response.data);
      console.log('Requests Array:', response.data.data);

      if (response.data && response.data.data) {
        const formattedRequests = response.data.data.map(request => ({
          ...request,
          status: request.status?.toLowerCase() || 'pending'
        }));
        console.log('Formatted Requests:', formattedRequests); // Debug log
        setRequests(formattedRequests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
        console.error('Error Status:', error.response.status);
      }
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch requests');
      }
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Format time to H:i format
  const formatTimeToHi = (time) => {
    if (!time) {
      const now = new Date();
      return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    }
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  // Handle request update with auth check
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    if (!checkAuth()) return;

    try {
      const token = localStorage.getItem('token');
      
      const formattedTime = editFormData.startTime ? formatTimeToHi(editFormData.startTime) : '';
      
      const data = new FormData();
      
      if (editFormData.status) {
        data.append('status', editFormData.status);
      }
      
      if (editFormData.startDate) {
        data.append('startDate', editFormData.startDate);
      }
      if (editFormData.endDate) {
        data.append('endDate', editFormData.endDate);
      }
      if (formattedTime) {
        data.append('startTime', formattedTime);
      }
      if (editFormData.specialTools) {
        data.append('specialTools', editFormData.specialTools);
      }
      if (editFormData.adminPayType) {
        data.append('adminPayType', editFormData.adminPayType);
      }
      if (editFormData.adminRate) {
        data.append('adminRate', editFormData.adminRate);
      }
      if (editFormData.deliverables) {
        data.append('deliverables', editFormData.deliverables);
      }
      if (editFormData.deliveryInstructions) {
        data.append('deliveryInstructions', editFormData.deliveryInstructions);
      }
      
      data.append('_method', 'PUT');

      const response = await axios.post(
        `${BASE_URL}/admin/requests/${selectedRequest.id}`,
        data,
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
        setUpdatedRequest(response.data.data);
        setShowSuccessModal(true);
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating request:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to update request. Please check all fields are filled correctly.');
      }
    }
  };

  // Modify the generatePDF function to handle image loading
  const generatePDF = async (request) => {
    // Debug logging
    console.log('Generating PDF for request:', request);
    console.log('Deliverables:', request.deliverables);
    console.log('Images:', request.request_images || request.images);

    const doc = new jsPDF();
    
    // Add TechSkims logo using the imported image
    doc.addImage(
      logo,
      'PNG',
      10,
      10,
      60,
      50
    );
    
    // Add title with adjusted position to accommodate logo and margin
    doc.setFontSize(20);
    doc.text('Request Details', 105, 70, { align: 'center' });
    
    let yPos = 80;

    // Add request information
    doc.setFontSize(12);
    
    // Section headers style
    const sectionHeaderStyle = {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 12
    };

    // Regular row style
    const regularStyle = {
      fontSize: 10,
      cellPadding: 4,
      cellWidth: 'wrap',
      lineWidth: 0.1,
      lineColor: [80, 80, 80]
    };

    // Client Information Section
    doc.autoTable({
      startY: yPos,
      head: [[{ content: 'Client Information', colSpan: 2, styles: sectionHeaderStyle }]],
      body: [
        ['Client', request.client || ''],
        ['Service', request.service || ''],
        ['Technician Title', request.technicianTitle || ''],
        ['Location', request.location || ''],
        ['Contact No', request.contactNo || ''],
        ['Pay Type', request.payType || ''],
        ['Rate', request.rate || ''],
        ['Pickup Location', request.pickupLocation || ''],
        ['Description', request.description || '']
      ],
      theme: 'grid',
      styles: regularStyle,
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 130 }
      },
      margin: { left: 10 }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Modified images section
    const images = request.request_images || request.images || [];
    if (images && images.length > 0) {
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Request Images', 10, yPos);
      
      yPos += 10;

      // Load and add each image
      for (let i = 0; i < images.length; i++) {
        try {
          const imageUrl = images[i].image || images[i].url || images[i];
          
          // Fetch the image
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          // Convert blob to base64
          const reader = new FileReader();
          const base64data = await new Promise((resolve) => {
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });

          // Calculate image dimensions to fit in PDF
          const imgWidth = 180; // Max width in the PDF
          const imgHeight = 100; // Max height in the PDF

          // Add image to PDF
          doc.addImage(
            base64data,
            'JPEG',
            10,
            yPos,
            imgWidth,
            imgHeight,
            `img${i}`,
            'MEDIUM'
          );

          yPos += imgHeight + 10; // Add spacing after each image
        } catch (error) {
          console.error(`Error loading image ${i}:`, error);
          // If image fails to load, add a placeholder text
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.text(`Image ${i + 1} could not be loaded`, 10, yPos);
          yPos += 10;
        }
      }
      
      yPos += 10; // Add some spacing before next section
    }

    // Admin Settings Section
    doc.autoTable({
      startY: yPos,
      head: [[{ content: 'Admin Settings', colSpan: 2, styles: sectionHeaderStyle }]],
      body: [
        ['Start Date', request.startDate || ''],
        ['End Date', request.endDate || ''],
        ['Start Time', request.startTime || ''],
        ['Special Tools', request.specialTools || ''],
        ['Admin Pay Type', request.adminPayType || request.payType || ''],
        ['Admin Rate', request.adminRate || request.rate || ''],
        ['Deliverables', request.deliverables || ''],
        ['Delivery Instructions', request.deliveryInstructions || '']
      ],
      theme: 'grid',
      styles: regularStyle,
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 130 }
      },
      margin: { left: 10 }
    });

    // Add footer with date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(128);
    doc.text(`Generated on: ${date}`, 10, doc.internal.pageSize.height - 10);
    doc.text(`Request ID: ${request.id}`, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10, { align: 'right' });

    // Save the PDF
    doc.save(`request-${request.id}.pdf`);
  };

  // Add search and filter handlers
  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleReset = () => {
    setStatus("all");
    setSearchTerm("");
    fetchRequests();
  };

  // Filter requests based on search and status
  const filteredRequests = requests.filter((request) => {
    console.log('Filtering request:', request); // Debug log
    
    const matchesSearch =
      request.technicianTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location?.toLowerCase().includes(searchTerm.toLowerCase());

    console.log('Matches search:', matchesSearch); // Debug log

    if (!matchesSearch) return false;

    if (status === "all") return true;
    return request.status?.toLowerCase() === status.toLowerCase();
  });

  console.log('Filtered Requests:', filteredRequests); // Debug log

  // Pagination logic
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log('Paginated Requests:', paginatedRequests); // Debug log

  // Modify the handleCompleteRequest function to use the existing update endpoint
  const handleCompleteRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Create FormData for the update
      const data = new FormData();
      data.append('status', 'completed');
      data.append('_method', 'PUT');

      const response = await axios.post(
        `${BASE_URL}/admin/requests/${requestId}`,
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success('Request marked as completed');
        fetchRequests(); // Refresh the requests list
      }
    } catch (error) {
      console.error('Error completing request:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to complete request');
      }
    }
  };

  // Modify the handleStatusChange function
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Find the current request data
      const currentRequest = requests.find(req => req.id === requestId);
      
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      
      const data = new FormData();
      // Add all required fields with proper formatting
      data.append('status', newStatus);
      data.append('startDate', currentRequest.startDate || today);
      data.append('startTime', formatTimeToHi(currentRequest.startTime));
      data.append('specialTools', currentRequest.specialTools || 'None');
      data.append('deliveryInstructions', currentRequest.deliveryInstructions || 'None');
      data.append('_method', 'PUT');

      const response = await axios.post(
        `${BASE_URL}/admin/requests/${requestId}`,
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        toast.success(`Request marked as ${newStatus}`);
        fetchRequests();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      
      // Handle validation errors
      if (error.response?.status === 422) {
        const errorMessages = error.response.data.error_message;
        
        // Format validation error messages
        if (errorMessages) {
          Object.entries(errorMessages).forEach(([field, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            switch (field) {
              case 'startDate':
                toast.error('Start date must not be in the past. Please update the request details first.');
                break;
              case 'startTime':
                toast.error('Invalid time format. Please update the request details first.');
                break;
              case 'specialTools':
                toast.error('Special tools information is required. Please update the request details first.');
                break;
              case 'deliveryInstructions':
                toast.error('Delivery instructions are required. Please update the request details first.');
                break;
              default:
                toast.error(message);
            }
          });
        } else {
          toast.error('Please ensure all required fields are properly filled');
        }
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(
          error.response?.data?.message || 
          'Failed to update status. Please try again later.'
        );
      }
    }
  };

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
          <div className="mx-auto rounded-lg bg-[#F8F8F8] w-full shadow-sm">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Client Requests</h1>
              <p className="text-sm text-gray-500">Manage client requests here.</p>
            </div>

            {/* Filters and Search */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3 border rounded-[10px] p-1">
                <button className="flex items-center gap-2 text-black font-[700] rounded-md px-3 py-2 text-sm border-r">
                  <Filter className="h-5 w-5" />
                  Filter By
                </button>

                <select
                  className="rounded-md border-r bg-transparent outline-none font-[700] px-3 py-2"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  className="font-[700] flex gap-4 text-[#EA0234]"
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full rounded-md border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-gray-300 focus:outline-none md:w-64"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white rounded-t-lg shadow whitespace-nowrap scrollbar-custom">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="border-b text-sm text-black uppercase bg-gray-50">
                    <th className="px-6 py-4 font-bold text-left w-16">ID</th>
                    <th className="px-6 py-4 font-bold text-left">Technician Title</th>
                    <th className="px-6 py-4 font-bold text-left">Service</th>
                    <th className="px-6 py-4 font-bold text-left w-32">Contact</th>
                    <th className="px-6 py-4 font-bold text-left w-48">Schedule</th>
                    <th className="px-6 py-4 font-bold text-left">Status</th>
                    <th className="px-6 py-4 font-bold text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRequests.length > 0 ? (
                    paginatedRequests.map((request) => (
                      <tr key={request.id} className="border-b text-sm hover:bg-gray-50">
                        <td className="px-6 py-4 text-left">{request.id}</td>
                        <td className="px-6 py-4 text-left font-medium text-gray-900">{request.technicianTitle}</td>
                        <td className="px-6 py-4 text-left">{request.service}</td>
                        <td className="px-6 py-4 text-left">{request.contactNo}</td>
                        <td className="px-6 py-4 text-left">
                          <div>
                            <div className="text-gray-900">{request.startDate}</div>
                            <div className="text-gray-500 text-xs">{request.startTime}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <select
                            value={request.status || 'pending'}
                            onChange={(e) => handleStatusChange(request.id, e.target.value)}
                            className={`px-2 py-1 rounded-md text-sm border-none outline-none appearance-none -webkit-appearance-none text-center w-fit ${
                              request.status === 'completed' ? 'bg-green-100 text-green-500 font-semibold' :
                              request.status === 'ongoing' ? 'bg-blue-100 font-semibold text-blue-500' :
                              request.status === 'pending' ? 'bg-[#ffa85633] text-[#FFA756] font-semibold' :
                              'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => {
                                setSelectedRequest(request);
                                setEditFormData({
                                  ...request,
                                  adminPayType: request.adminPayType || request.payType,
                                  adminRate: request.adminRate || request.rate,
                                  deliverables: request.deliverables || '',
                                  deliveryInstructions: request.deliveryInstructions || '',
                                });
                                setShowEditModal(true);
                              }}
                              className="rounded-full p-2 text-blue-500 hover:bg-blue-50"
                              title="Edit Request"
                            >
                              <EditIcon className="h-4 w-4" />
                            </button>

                            <button 
                              onClick={() => generatePDF(request)}
                              className="rounded-full p-2 text-gray-500 hover:bg-gray-50"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                        No requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, filteredRequests.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredRequests.length}</span> results
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

          {/* View Modal */}
          {showViewModal && selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                <h2 className="text-xl font-semibold mb-4">Request Details</h2>
                
                {/* Add Images Section */}
                <div className="mb-6">
                  <label className="text-base font-medium text-[#606060] block mb-2">Request Images</label>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedRequest.images && selectedRequest.images.length > 0 ? (
                      selectedRequest.images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={image.image}
                            alt={`Request image ${index + 1}`}
                            className="rounded-lg object-cover w-full h-full"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/200?text=Error';
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg">
                        <div className="text-center">
                          <Image className="h-8 w-8 text-gray-400 mx-auto" />
                          <p className="text-sm text-gray-500 mt-2">No images</p>
                        </div>
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
                  {/* Client Information Section - Read Only */}
                  <div className="border-b pb-4">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Client Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-500">Client Name</label>
                        <input
                          type="text"
                          value={selectedRequest.client || 'N/A'}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Service</label>
                        <input
                          type="text"
                          value={selectedRequest.service}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Technician Title</label>
                        <input
                          type="text"
                          value={selectedRequest.technicianTitle}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Location</label>
                        <input
                          type="text"
                          value={selectedRequest.location}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Contact Number</label>
                        <input
                          type="text"
                          value={selectedRequest.contactNo}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Client Pay Type</label>
                        <input
                          type="text"
                          value={selectedRequest.payType}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Client Rate</label>
                        <input
                          type="text"
                          value={selectedRequest.rate}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Pickup Location</label>
                        <input
                          type="text"
                          value={selectedRequest.pickupLocation}
                          readOnly
                          className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm text-gray-500">Description</label>
                      <textarea
                        value={selectedRequest.description}
                        readOnly
                        rows="2"
                        className="w-full mt-1 rounded-md border border-gray-200 bg-gray-50 p-2 text-gray-600"
                      />
                    </div>
                    
                    {/* Add Images Section */}
                    <div className="mt-4">
                      <label className="text-sm text-gray-500">Request Images</label>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        {selectedRequest.images && selectedRequest.images.length > 0 ? (
                          selectedRequest.images.map((image, index) => (
                            <div key={index} className="relative aspect-square">
                              <img
                                src={image.image}
                                alt={`Request image ${index + 1}`}
                                className="rounded-lg object-cover w-full h-full"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://via.placeholder.com/200?text=Error';
                                }}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg">
                            <div className="text-center">
                              <Image className="h-8 w-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-500 mt-2">No images</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Editable Section */}
                  <div className="pt-4">
                    <h3 className="text-md font-medium text-gray-700 mb-3">Admin Settings</h3>
                    <div className="grid gap-4">
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
                          <label className="text-sm text-gray-500">End Date</label>
                          <input
                            type="date"
                            value={editFormData.endDate}
                            onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                            className="w-full mt-1 rounded-md border border-gray-200 p-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Start Time</label>
                        <input
                          type="time"
                          value={editFormData.startTime}
                          onChange={(e) => setEditFormData({...editFormData, startTime: e.target.value})}
                          className="w-full mt-1 rounded-md border border-gray-200 p-2"
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

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-500">Admin Pay Type</label>
                          <select
                            value={editFormData.adminPayType}
                            onChange={(e) => setEditFormData({...editFormData, adminPayType: e.target.value})}
                            className="w-full mt-1 rounded-md border border-gray-200 p-2"
                          >
                            <option value="">Select pay type</option>
                            <option value="flat">Flat</option>
                            <option value="hourly">Hourly</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-500">Admin Rate</label>
                          <input
                            type="number"
                            value={editFormData.adminRate}
                            onChange={(e) => setEditFormData({...editFormData, adminRate: e.target.value})}
                            className="w-full mt-1 rounded-md border border-gray-200 p-2"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Deliverables</label>
                        <textarea
                          value={editFormData.deliverables}
                          onChange={(e) => setEditFormData({...editFormData, deliverables: e.target.value})}
                          className="w-full mt-1 rounded-md border border-gray-200 p-2"
                          rows="3"
                          placeholder="Enter deliverables for this request"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-gray-500">Delivery Instructions</label>
                        <textarea
                          value={editFormData.deliveryInstructions}
                          onChange={(e) => setEditFormData({...editFormData, deliveryInstructions: e.target.value})}
                          className="w-full mt-1 rounded-md border border-gray-200 p-2"
                          rows="3"
                          placeholder="Enter delivery instructions"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 bg-transparent border border-gray-200 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#00A8E8] text-white rounded-md hover:bg-[#00a6e8d8]"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showSuccessModal && updatedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6">
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Request Updated Successfully</h3>
                  <p className="text-sm text-gray-500">
                    The request has been updated. Would you like to download the request details as PDF?
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      // Merge the original request with updated data to ensure we have all fields
                      const completeRequest = {
                        ...selectedRequest,
                        ...updatedRequest,
                        // Ensure admin fields are properly set
                        adminPayType: updatedRequest.adminPayType || updatedRequest.payType,
                        adminRate: updatedRequest.adminRate || updatedRequest.rate,
                        deliverables: updatedRequest.deliverables || ''
                      };
                      generatePDF(completeRequest);
                      setShowSuccessModal(false);
                    }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-[#00A8E8] text-white rounded-md hover:bg-[#00a6e8d8] focus:outline-none"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download PDF
                  </button>
                  
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

