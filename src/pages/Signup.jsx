import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/bg.png";

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
  
    // Validation checks
    const requiredFields = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation,
      role: role,
    };
  
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);
  
    if (missingFields.length > 0) {
      toast.error("Please fill all fields");
      return;
    }
  
    if (formData.password !== formData.passwordConfirmation) {
      toast.error("Passwords do not match.");
      return;
    }
  
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://beta.techskims.tech/api/register",
        {
          ...formData,
          role,
        }
      );
  
      const responseData = response.data;
  
      if (responseData.status === "error" && responseData.message === "Email already exists but not verified") {
        toast.info("Email already exists but hasn't been verified. A new verification code has been sent to your email.");
  
        // Resend the verification code
        await axios.post('https://beta.techskims.tech/api/email/resend', {
          email: formData.email
        }, {
          headers: {
            'Accept': 'application/json'
          }
        });
  
        navigate("/verify-email");
      } else if (responseData.status === "success") {
        const token = responseData.data.apiToken;
        localStorage.setItem("authToken", token);
        toast.success("Registration successful!");
        navigate("/verify-email");
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error_message?.email?.[0] ||
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bg})`,
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
              <div>
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
                  className="absolute inset-y-0 right-0 -top-3 font-semibold pr-3 flex items-center text-sm leading-5"
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
                  className="absolute inset-y-0 right-0 -top-3 font-semibold pr-3 flex items-center text-sm leading-5"
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
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Signup;