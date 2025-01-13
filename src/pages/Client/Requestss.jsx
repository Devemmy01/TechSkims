import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Filter,
  Search,
  Clock,
  MapPin,
  Phone,
  DollarSign
} from "lucide-react";

const BASE_URL = 'https://beta.techskims.tech/api';

const handleAuthError = () => {
  toast.error('Auth error occurred - debugging mode');
};

const setupAxiosInterceptors = () => {
  axios.interceptors.request.eject(axios.interceptors.request.handlers[0]);
  axios.interceptors.response.eject(axios.interceptors.response.handlers[0]);

axios.interceptors.request.use(
  (config) => {
      if (config.url.includes('/login') || config.url.includes('/register')) {
        return config;
      }

    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || !userRole) {
      return Promise.reject(new Error('No authentication token'));
    }
    
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

  // Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
};

export default function Requestss() {
  const formRef = useRef(null);
  const [requests, setRequests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);
  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    serviceId: "",
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
    deliveryInstructions: ""
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.technicianTitle.trim()) {
      newErrors.technicianTitle = 'Technician title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else {
      const phoneRegex = /^\+\d{1,4}[0-9\s-]{10,}$/;
      if (!phoneRegex.test(formData.contactNo.trim())) {
        newErrors.contactNo = 'Please enter a valid phone number with country code (e.g., +1234567890)';
      }
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
      if (selectedDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    } else {
      const [hours, minutes] = formData.startTime.split(':');
      const selectedTime = new Date();
      selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      const currentTime = new Date();
      const selectedDate = new Date(formData.startDate);
      selectedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      if (selectedDate.toDateString() === currentTime.toDateString() && selectedTime < currentTime) {
        newErrors.startTime = 'Start time cannot be in the past for today\'s date';
      }
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description should be at least 20 characters long';
    }
    
    if (!formData.specialTools.trim()) {
      newErrors.specialTools = 'Special tools field is required';
    }
    
    if (!formData.pickupLocation.trim()) {
      newErrors.pickupLocation = 'Pickup location is required';
    }
    
    if (!formData.payType) {
      newErrors.payType = 'Pay type is required';
    }
    
    if (!formData.rate.trim()) {
      newErrors.rate = 'Rate is required';
    } else {
      const rateValue = parseFloat(formData.rate);
      if (isNaN(rateValue) || rateValue <= 0) {
        newErrors.rate = 'Please enter a valid positive number for rate';
      } else if (rateValue < 10) {
        newErrors.rate = 'Minimum rate should be 10';
      }
    }
    
    if (!formData.deliveryInstructions.trim()) {
      newErrors.deliveryInstructions = 'Delivery instructions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhoneInput = (e) => {
    let value = e.target.value;
    
    // If the user is typing and hasn't added a plus sign, add it
    if (value && !value.startsWith('+')) {
      value = '+' + value;
    }
    
    setFormData(prev => ({
      ...prev,
      contactNo: value
    }));

    // Clear error when user starts typing
    if (errors.contactNo) {
      setErrors(prev => ({
        ...prev,
        contactNo: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValid = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isValid) {
        toast.error(`${file.name} is not an image file`);
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
      }
      return isValid && isValidSize;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));

    // Generate preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreview(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index]);
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');

      if (!token || !userRole || userRole !== 'client') {
        toast.error('Authentication required for this action');
        return;
      }

      const response = await axios.get(`${BASE_URL}/client/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data.status === 'success') {
        setRequests(response.data.data);
      }
    } catch (error) {
      console.error('Error in fetchRequests:', error);
      if (error.response?.status === 401) {
        toast.error('Authentication failed');
      } else {
        toast.error('Failed to fetch requests');
      }
    }
  };

  // Fetch single request for editing
  const fetchRequestDetails = async (requestId) => {
    try {
      const response = await axios.get(`${BASE_URL}/client/requests/${requestId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.data) {
        const request = response.data.data;
        setFormData({
          serviceId: request.serviceId || "1",
          technicianTitle: request.technicianTitle || "",
          location: request.location || "",
          contactNo: request.contactNo || "",
          startDate: request.startDate || "",
          startTime: request.startTime || "",
          description: request.description || "",
          specialTools: request.specialTools || "",
          pickupLocation: request.pickupLocation || "",
          payType: request.payType || "",
          rate: request.rate || "",
          images: [],
          deliveryInstructions: request.deliveryInstructions || ""
        });
        setIsEditing(true);
        setCurrentRequestId(requestId);
        
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to fetch request details');
    }
  };

  // Update request
  const updateRequest = async (requestId, formData) => {
    try {
      const data = new FormData();
      
      // Explicitly set each field
      data.append('serviceId', formData.serviceId);
      data.append('technicianTitle', formData.technicianTitle);
      data.append('location', formData.location);
      data.append('contactNo', formData.contactNo);
      data.append('startDate', formData.startDate);
      data.append('startTime', formData.startTime);
      data.append('description', formData.description);
      data.append('specialTools', formData.specialTools);
      data.append('pickupLocation', formData.pickupLocation);
      data.append('payType', formData.payType);
      data.append('rate', formData.rate);

      // Handle images separately
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(image => {
          data.append('images[]', image);
        });
      }

      // Add _method field for Laravel to handle PUT request
      data.append('_method', 'PUT');

      const response = await axios.post(`${BASE_URL}/client/requests/${requestId}`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        toast.success('Request updated successfully');
        fetchRequests();
        resetForm();
      }
    } catch (error) {
      console.error('Error updating request:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.data?.error_message) {
        const errorMessages = Object.values(error.response.data.error_message)
          .flat()
          .join(', ');
        toast.error(errorMessages);
      } else {
        toast.error('Failed to update request');
      }
    }
  };

  // Add function to fetch services
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/services`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.status === 'success') {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      if (error.response?.status === 401) {
        handleAuthError();
      } else {
      toast.error('Failed to load services');
      }
    }
  };

  // Update useEffect to use the existing auth check logic
  useEffect(() => {
    setupAxiosInterceptors();
    
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole || userRole !== 'client') {
      toast.error('Authentication required');
      return;
    }

      fetchRequests();
      fetchServices();
  }, []);

  const resetForm = () => {
    setFormData({
      serviceId: "",
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
      deliveryInstructions: ""
    });
    setIsEditing(false);
    setCurrentRequestId(null);
    setImagePreview([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const data = new FormData();
      
      // Add required fields using exact field names from API response
      data.append('serviceId', formData.serviceId || "1");
      data.append('technicianTitle', formData.technicianTitle);
      data.append('location', formData.location);
      data.append('contactNo', formData.contactNo);
      data.append('startDate', formData.startDate);
      data.append('startTime', formData.startTime);
      data.append('description', formData.description);
      data.append('specialTools', formData.specialTools);
      data.append('pickupLocation', formData.pickupLocation);
      data.append('payType', formData.payType);
      data.append('rate', formData.rate);
      data.append('deliveryInstructions', formData.deliveryInstructions);

      // Handle images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach(image => {
          data.append('images[]', image);
        });
      }

      // Make the request
      const response = await axios.post(`${BASE_URL}/client/requests`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Check if response matches expected format
      if (response.data.status === 'success' && response.data.data) {
        toast.success(response.data.message || 'Request submitted successfully');
        resetForm();
        fetchRequests();
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.error_message;
        const errorMessage = Object.values(validationErrors)
          .flat()
          .join('\n');
        toast.error(errorMessage);
      } else if (error.response?.status === 404) {
        toast.error('Service endpoint not found. Please contact support.');
      } else if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
        window.location.href = '/login';
      } else if (error.response?.data?.error_message) {
        if (typeof error.response.data.error_message === 'string') {
          toast.error(error.response.data.error_message);
        } else {
          const errorMessages = Object.values(error.response.data.error_message)
            .flat()
            .join(', ');
          toast.error(errorMessages);
        }
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#F8F8F8] w-full lg:w-[calc(100%-256px)] absolute pt-10 md:pt-0 md:p-8">
      <div className="mx-auto rounded-lg bg-[#F8F8F8] w-full p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center w-full md:mt-8">
          <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Request' : 'New Request'}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditing 
              ? 'Update the details of your service request' 
              : 'Please provide the details of the service you need'}
          </p>
          </div>

          <a href="#requests" className="bg-[#00a6e8] hover:bg-[#00a6e8]/80 transition-all duration-300 cursor-pointer rounded-[4px] h-[48px] w-fit flex items-center px-4 md:px-5 text-white whitespace-nowrap">View Requests</a>
        </div>

        <div ref={formRef} className="bg-transparent md:bg-white mt-5 rounded-lg md:px-10 lg:px-32 py-10">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-7">
            <div className="flex flex-col gap-2 w-full">
                <label className="text-[#606060] font-[600] text-sm">
                  Technician Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="technicianTitle"
                  value={formData.technicianTitle}
                  onChange={handleInputChange}
                  className={`border ${errors.technicianTitle ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                />
                {errors.technicianTitle && (
                  <span className="text-red-500 text-sm">{errors.technicianTitle}</span>
                )}
              </div>
              <div className="flex flex-col gap-2 w-full">
                <label className="text-[#606060] font-[600] text-sm">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  className={`border ${errors.serviceId ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                >
                  <option value="">Select a service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.serviceId && (
                  <span className="text-red-500 text-sm">{errors.serviceId}</span>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="text-[#606060] font-[600] text-sm">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handlePhoneInput}
                  placeholder="+1234567890"
                  className={`border ${errors.contactNo ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                />
                {errors.contactNo ? (
                  <span className="text-red-500 text-sm">{errors.contactNo}</span>
                ) : (
                  <span className="text-gray-400 text-xs">Enter phone number with country code (e.g., +1234567890)</span>
                )}
              </div>

              

              <div className="flex flex-col gap-2 w-full">
                <label className="text-[#606060] font-[600] text-sm">
                  Project Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`border ${errors.location ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                />
                {errors.location && (
                  <span className="text-red-500 text-sm">{errors.location}</span>
                )}
              </div>

              

              <div className="flex flex-col gap-2 w-full">
                <label className="text-[#606060] font-[600] text-sm">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border border-[#E5E5E5] bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none"
                />
                {imagePreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreview.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#606060] font-[600] text-sm">
                    Start date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`border ${errors.startDate ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                  />
                  {errors.startDate && (
                    <span className="text-red-500 text-sm">{errors.startDate}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#606060] font-[600] text-sm">
                    Start time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`border ${errors.startTime ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                  />
                  {errors.startTime && (
                    <span className="text-red-500 text-sm">{errors.startTime}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#606060] font-[600] text-sm">
                    Pay type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="payType"
                    value={formData.payType}
                    onChange={handleInputChange}
                    className={`border ${errors.payType ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                  >
                    <option value="">Select pay type</option>
                    <option value="flat">Flat</option>
                    <option value="hourly">Hourly</option>
                  </select>
                  {errors.payType && (
                    <span className="text-red-500 text-sm">{errors.payType}</span>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[#606060] font-[600] text-sm">
                    Rate <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`border ${errors.rate ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                  />
                  {errors.rate && (
                    <span className="text-red-500 text-sm">{errors.rate}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="text-[#606060] font-[600] text-sm">
                  Parts pickup location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  className={`border ${errors.pickupLocation ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[52px] outline-none`}
                />
                {errors.pickupLocation && (
                  <span className="text-red-500 text-sm">{errors.pickupLocation}</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-6 w-full">
              <label className="text-[#606060] font-[600] text-sm">
                Problem description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`border ${errors.description ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[100px] outline-none`}
              ></textarea>
              {errors.description && (
                <span className="text-red-500 text-sm">{errors.description}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-6 w-full">
              <label className="text-[#606060] font-[600] text-sm">
                Special tools <span className="text-red-500">*</span>
              </label>
              <textarea
                name="specialTools"
                value={formData.specialTools}
                onChange={handleInputChange}
                className={`border ${errors.specialTools ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[100px] outline-none`}
              ></textarea>
              {errors.specialTools && (
                <span className="text-red-500 text-sm">{errors.specialTools}</span>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-6 w-full">
              <label className="text-[#606060] font-[600] text-sm">
                Delivery Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                className={`border ${errors.deliveryInstructions ? 'border-red-500' : 'border-[#E5E5E5]'} bg-[#F5F6FA] text-[#636262] rounded-md p-2 w-full h-[100px] outline-none`}
              ></textarea>
              {errors.deliveryInstructions && (
                <span className="text-red-500 text-sm">{errors.deliveryInstructions}</span>
              )}
            </div>
            
            <div className="flex gap-4 mt-8">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#00A8E8] flex-1 text-white rounded-md p-2 h-[52px] outline-none disabled:opacity-50 hover:bg-[#0096d1] transition-colors"
              >
                {loading ? 'Submitting...' : isEditing ? 'Update Request' : 'Submit Request'}
              </button>

              {isEditing && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white rounded-md p-2 h-[52px] outline-none hover:bg-gray-600 transition-colors px-6"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Requests List */}
        {/* <div className="mt-12" id="requests">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Requests</h2>
          <div className="grid gap-4">
            {requests.map((request) => (
              <div 
                key={request.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => fetchRequestDetails(request.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {request.technicianTitle}
                    </h3>
                      <span className="text-sm text-gray-500">|</span>
                      <span className="text-sm text-gray-500">{request.service}</span>
                    </div>
                    <h4 className="text-gray-700 mt-1">{request.technicianTitle}</h4>
                    <p className="text-gray-500 text-sm mt-1">
                      {request.description.substring(0, 100)}...
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    !request.status ? 'bg-yellow-100 text-yellow-800' :
                    request.status === 'completed' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {request.status || 'Pending'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{request.startDate} {request.startTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{request.contactNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{request.payType} - {request.rate}</span>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No requests found. Create your first request above.
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
