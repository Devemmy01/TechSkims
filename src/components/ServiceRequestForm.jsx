import React, { useState } from "react";
// import { X } from 'lucide-react';

export default function ServicesRequestForm() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    organization: "",
    address: "",
    phoneNumber: "",
    serviceType: "",
    serviceDetails: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to a server
    console.log("Form submitted:", formData);
    console.log("Image file:", imageFile);
    // Reset form after submission
    setFormData({
      organization: "",
      address: "",
      phoneNumber: "",
      serviceType: "",
      serviceDetails: "",
    });
    setImageFile(null);
    setIsFormVisible(false);
  };

  return (
    <>
      <button
        onClick={() => setIsFormVisible(true)}
        className="text-white text-[17px] py-2 px-4 rounded"
      >
        Request a service
      </button>

      {isFormVisible && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative z-[10000]">
            <button
              onClick={() => setIsFormVisible(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              {/* <X size={24} /> */}X
            </button>
            <h2 className="text-2xl font-bold mb-4 text-navy-blue">
              Service Request Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="organization"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name of organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring focus:ring-sky-blue focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring focus:ring-sky-blue focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring focus:ring-sky-blue focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="serviceType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Kind of Service Needed
                </label>
                <input
                  type="text"
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring focus:ring-sky-blue focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="serviceDetails"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Details
                </label>
                <textarea
                  id="serviceDetails"
                  name="serviceDetails"
                  value={formData.serviceDetails}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-blue focus:ring focus:ring-sky-blue focus:ring-opacity-50"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload Descriptive Image (Optional)
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-sky-blue file:text-white
                    hover:file:bg-navy-blue"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-navy-blue text-white font-bold py-2 px-4 rounded hover:bg-sky-blue transition duration-300"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
