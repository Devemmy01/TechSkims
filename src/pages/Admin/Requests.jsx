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

const BASE_URL = 'https://api.techskims.com/api';

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

  const itemsPerPage = 7;

  // Add new state for success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updatedRequest, setUpdatedRequest] = useState(null);

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
        const requestsWithStatus = response.data.data.map(request => ({
          ...request,
          status: request.status?.toLowerCase() || 'pending'
        }));
        setRequests(requestsWithStatus);
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

  // Add a function to handle status changes
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const data = new FormData();
      data.append('status', newStatus);
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
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update status');
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
            <div className="overflow-x-auto border shadow-sm rounded-[8px] bg-white">
              <table className="w-full min-w-[800px] table-auto">
                <thead>
                  <tr className="border-b text-sm text-gray-600 bg-gray-50">
                    <th className="px-6 py-4 font-medium text-left w-16">ID</th>
                    <th className="px-6 py-4 font-medium text-left">Technician Title</th>
                    <th className="px-6 py-4 font-medium text-left">Service</th>
                    <th className="px-6 py-4 font-medium text-left w-32">Contact</th>
                    <th className="px-6 py-4 font-medium text-left w-48">Schedule</th>
                    <th className="px-6 py-4 font-medium text-left">Status</th>
                    <th className="px-6 py-4 font-medium text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
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
                          className={`px-3 py-1 rounded-full text-sm border-none focus:ring-2 focus:ring-offset-2 ${
                            request.status === 'completed' ? 'bg-green-100 text-green-600 focus:ring-green-500' :
                            request.status === 'ongoing' ? 'bg-blue-100 text-blue-600 focus:ring-blue-500' :
                            request.status === 'pending' ? 'bg-[#ffa85633] text-[#FFA756] focus:ring-yellow-500' :
                            'bg-gray-100 text-gray-600 focus:ring-gray-500'
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

