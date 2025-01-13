import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { ChevronDown, Upload, Eye, EyeOff } from "lucide-react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
countries.registerLocale(enLocale);

export const useProfileData = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://beta.techskims.tech/api/admin/profile",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const profileData = response.data.data;
        setProfile(profileData);
        if (profileData.thumbnail) {
          setImagePreview(profileData.thumbnail);
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch profile error:", err); // Debugging line
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);

  return { profile, loading, error, setProfile };
};

const AdminSettings = () => {
  const { profile, loading, error, setProfile } = useProfileData();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageRetryAttempted, setImageRetryAttempted] = useState(false);
  const [passwordFields, setPasswordFields] = useState({
    password: "",
    passwordConfirmation: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password" || name === "passwordConfirmation") {
      setPasswordFields((prev) => ({ ...prev, [name]: value }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("_method", "PUT");
    formData.append("name", profile.name);
    formData.append("email", profile.email);
    formData.append("phone", profile.phone || "");

    // Only include password fields if a new password is being set
    if (passwordFields.password || passwordFields.passwordConfirmation) {
      // Validate password fields if either is filled
      if (!passwordFields.password || !passwordFields.passwordConfirmation) {
        toast.error(
          "Both password fields must be filled when updating password"
        );
        return;
      }
      if (passwordFields.password !== passwordFields.passwordConfirmation) {
        toast.error("Password and Confirm Password do not match");
        return;
      }
      formData.append("password", passwordFields.password);
      formData.append(
        "password_confirmation",
        passwordFields.passwordConfirmation
      );
    }

    try {
      const response = await axios.post(
        "https://beta.techskims.tech/api/admin/profile",
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setPasswordFields({ password: "", passwordConfirmation: "" });
    } catch (error) {
      console.error("Error:", error.response.data);
      toast.error(`Error: ${error.response.data.message}`);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show immediate preview of selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://beta.techskims.tech/api/admin/profile/image",
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success" && response.data.data) {
        // Add cache-busting timestamp to the URL
        const timestamp = Date.now();
        const newThumbnailUrl = response.data.data.thumbnail.includes("?")
          ? `${response.data.data.thumbnail}&t=${timestamp}`
          : `${response.data.data.thumbnail}?t=${timestamp}`;

        // Fetch the new image to ensure it's loaded
        const checkImage = (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => reject(new Error("Image not accessible"));
            img.src = url;
          });
        };

        try {
          await checkImage(newThumbnailUrl);

          // Update both local state and profile state
          setImagePreview(newThumbnailUrl);
          setProfile((prevProfile) => ({
            ...prevProfile,
            thumbnail: response.data.data.thumbnail, // Store the base URL without timestamp
          }));

          // Force browser to clear cached version
          const existingImg = document.querySelector(
            `img[src*="${response.data.data.thumbnail}"]`
          );
          if (existingImg) {
            existingImg.src = newThumbnailUrl;
          }

          toast.success(response.data.message);
        } catch (error) {
          console.error("Image not accessible after upload");
          toast.error("Image upload failed. Please try again.");
        }
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  const handleImageDelete = async () => {
    const token = localStorage.getItem("token");

    try {
      // First, attempt to delete the image
      const deleteResponse = await axios.delete(
        "https://beta.techskims.tech/api/admin/profile/image",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Verify the deletion by fetching the latest profile data
      const verifyResponse = await axios.get(
        "https://beta.techskims.tech/api/admin/profile",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the thumbnail still exists in the response
      if (verifyResponse.data.data.thumbnail) {
        // If thumbnail still exists, show an error
        toast.error(
          "Failed to delete image. Please try again or contact support."
        );
        return;
      }

      // If we reach here, the image was successfully deleted
      setProfile((prevProfile) => ({
        ...prevProfile,
        thumbnail: null,
      }));
      setImagePreview(null);

      // Clear any cached versions of the image
      const existingImg = document.querySelector(
        `img[src*="${profile.thumbnail}"]`
      );
      if (existingImg) {
        existingImg.src = "";
      }

      toast.success("Image successfully deleted");
    } catch (error) {
      console.error("Delete error:", error);

      // More specific error messaging
      if (error.response?.status === 404) {
        toast.error("Image not found or already deleted");
      } else if (error.response?.status === 403) {
        toast.error("You don't have permission to delete this image");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete image");
      }

      // Refresh the profile data to ensure UI is in sync with backend
      try {
        const refreshResponse = await axios.get(
          "https://beta.techskims.tech/api/admin/profile",
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(refreshResponse.data.data);
        setImagePreview(refreshResponse.data.data.thumbnail);
      } catch (refreshError) {
        console.error("Error refreshing profile:", refreshError);
      }
    }
  };

  useEffect(() => {
    if (profile?.thumbnail) {
      const timestamp = Date.now();
      const thumbnailUrl = profile.thumbnail.includes("?")
        ? `${profile.thumbnail}&t=${timestamp}`
        : `${profile.thumbnail}?t=${timestamp}`;
      setImagePreview(thumbnailUrl);
    } else {
      setImagePreview(null);
    }
  }, [profile?.thumbnail]);

  const countryOptions = Object.entries(countries.getNames("en")).map(
    ([code, name]) => ({
      value: name,
      label: name,
    })
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[#F8F8F8] absolute w-full lg:w-[calc(100%-256px)] p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
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

      <div className="mx-auto rounded-lg bg-[#F8F8F8] w-full justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage your account here.</p>
        </div>

        <div className="min-h-screen w-full mt-10 bg-gray-50 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-full bg-white rounded-lg shadow p-6 space-y-6"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400" />
                  )}
                </div>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="flex flex-col gap-2 mt-2">
                  <label
                    htmlFor="image-upload"
                    className="text-center text-sm text-[#00a6e8] cursor-pointer"
                  >
                    Upload Photo
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      className="text-sm text-red-500 text-center"
                      onClick={handleImageDelete}
                    >
                      Delete Photo
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-10">
              <div>
                <label className="block text-sm mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Security</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col w-full md:w-1/2 relative">
                  <label className="block text-sm mb-2">Current Password</label>

                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 relative border border-gray-200 rounded-lg bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-2 top-12 -translate-y-1/2"
                  >
                    {passwordVisible ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 ">
                  <div className="flex flex-col w-full relative">
                    <label className="block text-sm mb-2">
                      New Password
                    </label>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      value={passwordFields.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 relative border border-gray-200 rounded-lg bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-2 top-12 -translate-y-1/2"
                    >
                      {passwordVisible ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                  <div className="flex flex-col w-full relative">
                    <label className="block text-sm mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type={confirmPasswordVisible ? "text" : "password"}
                      name="passwordConfirmation"
                      value={passwordFields.passwordConfirmation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 relative border border-gray-200 rounded-lg bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setConfirmPasswordVisible(!confirmPasswordVisible)
                      }
                      className="absolute right-2 top-12 -translate-y-1/2"
                    >
                      {confirmPasswordVisible ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
            </div>

            <div className="flex items-center justify-end pt-6">
              <div className="space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-600 border border-gray-200 bg-gray-50 hover:text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00a6e8] text-white rounded-md hover:bg-[#00a6e8]/80"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;