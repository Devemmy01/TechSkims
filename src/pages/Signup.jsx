import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate, useLocation } from "react-router-dom";
import bg from "../assets/bg.png";
import bgg from "../assets/client.png";

const Signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cPasswordVisible, setCPasswordVisible] = useState(false);
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roleParam = queryParams.get("role");
    if (roleParam) {
      setRole(roleParam);
    }
  }, [location.search]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const toggleCPasswordVisibility = () => {
    setCPasswordVisible(!cPasswordVisible);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value.toLowerCase());
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('name', formData.name);
      data.append('password_confirmation', formData.passwordConfirmation);
      data.append('role', role);

      const response = await axiosInstance.post("/register", data);

      if (response.data.status === "success") {
        // Store necessary data
        localStorage.setItem("verificationEmail", formData.email);
        localStorage.setItem("authToken", response.data.data.apiToken);
        localStorage.setItem("userRole", role.toLowerCase());
        
        // Check if email needs verification
        const emailVerified = response.data.data.email_verified || false;
        localStorage.setItem("isEmailVerified", emailVerified);

        if (!emailVerified) {
          // If email is not verified, redirect to verification page
          toast.success("Registration successful! Please verify your email.");
          navigate("/verify-email");
        } else {
          // If somehow email is already verified, redirect to appropriate dashboard
          toast.success("Registration successful!");
          switch(role.toLowerCase()) {
            case 'client':
              navigate("/client-dashboard");
              break;
            case 'technician':
              navigate("/technician-dashboard");
              break;
            case 'admin':
              navigate("/admin/dashboard");
              break;
            default:
              navigate("/login");
          }
        }
      }
    } catch (error) {
      console.error("Registration error details:", error);
      
      // Handle validation errors
      if (error.response?.status === 422) {
        const errorMessages = error.response?.data?.error_message;
        
        if (errorMessages) {
          Object.entries(errorMessages).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                toast.error(message);
              });
            } else if (typeof messages === 'string') {
              toast.error(messages);
            }
          });
        } else {
          toast.error(error.response?.data?.message || "Validation failed. Please check your input.");
        }
      } else {
        const errorMessage = 
          error.response?.data?.message ||
          error.response?.data?.error_message ||
          error.message ||
          "Registration failed. Please try again.";
        
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${role === "client" ? bgg : bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen flex items-center justify-center pt-32 pb-20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center pt-7">
              Create an account
            </CardTitle>
            <p className="text-center text-gray-500">
              Set up your account to continue
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Name of company/organization</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="bg-gray-50"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-gray-50"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="hidden">
                <Label htmlFor="role">Select your role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={handleRoleChange}
                  className="w-full bg-white mt-1 p-2 border border-gray-300 rounded"
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="technician">Technician</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  className="bg-gray-50"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 top-3 font-semibold pr-3 flex items-center text-sm leading-5"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <div className="space-y-2 pb-7 relative">
                <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                <Input
                  id="passwordConfirmation"
                  type={cPasswordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="bg-gray-50"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={toggleCPasswordVisibility}
                  className="absolute inset-y-0 right-0 -top-1 font-semibold pr-3 flex items-center text-sm leading-5"
                >
                  {cPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-600">
                  Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;