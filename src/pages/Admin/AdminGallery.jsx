import React, { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminGallery = () => {
  const [loading, setLoading] = useState(true);
  const [galleryItems, setGalleryItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImage, setNewImage] = useState({ title: "", image: null });
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');

  // Get auth token from localStorage
  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    return token || "";
  };

  useEffect(() => {
    fetchGalleryItems();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get("https://beta.techskims.tech/api/admin/services", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          Accept: "application/json"
        }
      });
      setServices(response.data.data);
      // Set the first service as default selected service if available
      if (response.data.data.length > 0) {
        setSelectedService(response.data.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Failed to fetch services");
    }
  };

  const fetchGalleryItems = async () => {
    try {
      const response = await axios.get("https://beta.techskims.tech/api/admin/gallery", {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          Accept: "application/json"
        }
      });
      setGalleryItems(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
      toast.error(error.response?.data?.message || "Failed to fetch gallery items");
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    setUploadProgress(0);

    if (!newImage.title || !newImage.image || !selectedService) {
      toast.error("Title, image, and service are required");
      return;
    }

    if (newImage.image.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB");
      return;
    }

    const formData = new FormData();
    formData.append('title', newImage.title);
    formData.append('image', newImage.image);
    formData.append('serviceId', selectedService);

    try {
      const response = await axios.post('https://beta.techskims.tech/api/admin/gallery', formData, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.status === 'success') {
        toast.success("Image uploaded successfully");
        setIsModalOpen(false);
        fetchGalleryItems();
        setNewImage({ title: "", image: null });
        setSelectedService(services[0]?.id || '');
      } else {
        toast.error(response.data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage = error.response?.data?.error_message?.service_id?.[0] 
        || error.response?.data?.message 
        || "Failed to upload image";
      toast.error(errorMessage);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      await axios.delete(`https://beta.techskims.tech/api/admin/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          Accept: "application/json"
        }
      });
      setGalleryItems(galleryItems.filter((item) => item.id !== id));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete image");
      console.error("Error deleting image:", error);
    }
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
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

          <div className="mx-auto rounded-lg bg-[#F8F8F8] w-full flex justify-between items-center shadow-sm mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Gallery</h1>
              <p className="text-sm text-gray-500">Manage your gallery here.</p>
            </div>

            <Button
              onClick={() => {
                setError("")
                setIsModalOpen(true)
              }}
              className="bg-[#00a6e8] hover:bg-[#00a6e8]/80 text-white"
            >
              Add Image
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-10 gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-lg">
                <img
                  src={item.image || "https://via.placeholder.com/150"} 
                  alt={item.title || "Image not available"} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteImage(item.id)}
                      className="rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/60">
                  <h3 className="text-white font-medium truncate">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Image</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleImageUpload();
                }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service</Label>
                    <select
                      id="service"
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      type="text"
                      value={newImage.title}
                      onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={(e) => setNewImage({ ...newImage, image: e.target.files[0] })}
                      required
                      className="cursor-pointer"
                    />
                  </div>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#00a6e8] hover:bg-[#00a6e8]/80 text-white">
                    Upload
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default AdminGallery;