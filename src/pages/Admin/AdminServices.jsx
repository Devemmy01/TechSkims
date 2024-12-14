import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "https://beta.techskims.tech/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AddServiceModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    } else if (!isOpen) {
      setFormData({ name: "", description: "" });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded-md"
              rows="4"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00a6e8] text-white rounded-md hover:bg-[#00a6e8]/80"
            >
              {initialData ? "Update Service" : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminServices = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/services');
      if (response.data.status === "success") {
        setServices(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        // Optionally redirect to login page
      } else {
        toast.error("Failed to fetch services");
      }
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post('/admin/services', formData);
      
      if (response.data.status === "success") {
        toast.success("Service added successfully");
        setIsModalOpen(false);
        fetchServices();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 422) {
        // Handle validation errors
        const errorMessages = error.response.data.error_message;
        if (errorMessages.name) {
          toast.error(errorMessages.name[0]); // Show the first name error
        } else {
          toast.error("Validation error. Please check your input.");
        }
      } else {
        toast.error("Failed to add service");
      }
      console.error("Error adding service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = async (formData) => {
    try {
      setLoading(true);
      
      // Only include changed fields in the update request
      const updatedFields = {};
      if (formData.name !== selectedService.name) {
        updatedFields.name = formData.name;
      }
      if (formData.description !== selectedService.description) {
        updatedFields.description = formData.description;
      }

      // If nothing has changed, close the modal and return
      if (Object.keys(updatedFields).length === 0) {
        setIsModalOpen(false);
        setSelectedService(null);
        toast.info("No changes were made");
        return;
      }

      const response = await api.put(
        `/admin/services/${selectedService.id}`, 
        updatedFields
      );
      
      if (response.data.status === "success") {
        toast.success("Service updated successfully");
        setIsModalOpen(false);
        setSelectedService(null);
        fetchServices();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error.response?.status === 422) {
        // Handle validation errors
        const errorMessages = error.response.data.error_message;
        if (errorMessages.name) {
          toast.error(errorMessages.name[0]);
        } else {
          // Show all validation errors if there are multiple
          const allErrors = Object.values(errorMessages).flat();
          allErrors.forEach(error => toast.error(error));
        }
      } else {
        toast.error("Failed to update service");
      }
      console.error("Error updating service:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = (formData) => {
    if (selectedService) {
      handleUpdateService(formData);
    } else {
      handleAddService(formData);
    }
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        setLoading(true);
        const response = await api.delete(`/admin/services/${id}`);
        if (response.data.status === "success") {
          toast.success("Service deleted successfully");
          fetchServices();
        }
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          // Optionally redirect to login page
        } else {
          toast.error("Failed to delete service");
        }
        console.error("Error deleting service:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8">
          <div className="mx-auto rounded-lg bg-[#F8F8F8] w-full flex justify-between items-center shadow-sm mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Services</h1>
              <p className="text-sm text-gray-500">Manage your services here.</p>
            </div>

            <button
              onClick={() => {
                setSelectedService(null);
                setIsModalOpen(true);
              }}
              className="bg-[#00a6e8] whitespace-nowrap hover:bg-[#00a6e8]/80 transition-all duration-300 cursor-pointer rounded-[4px] h-[48px] w-fit flex items-center px-5 text-white"
            >
              Add Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-4 rounded-lg shadow-sm"
              >
                <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(service)}
                    className="text-[#00A6E8] hover:text-[#0088c2] transition-colors duration-300"
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-300"
                    title="Delete"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <AddServiceModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedService(null);
            }}
            onSubmit={handleModalSubmit}
            initialData={selectedService}
          />
        </div>
      )}
    </>
  );
};

export default AdminServices;
