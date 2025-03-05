import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import bg from "../assets/bg.png";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showInactivePopup, setShowInactivePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberPassword(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
  
    try {
      const response = await axiosInstance.post("/login", formData);
  
      const responseData = response.data;
  
      if (responseData.status === "success") {
        // Check if user is inactive
        if (responseData.data.status === 'inactive') {
          setShowInactivePopup(true);
          setIsLoading(false);
          return;
        }
  
        // Clear any existing tokens
        localStorage.clear();
  
        // Store new token and user data
        const token = responseData.data.apiToken;
        localStorage.setItem("token", token);
        localStorage.setItem("authToken", token);
  
        // Handle remember password
        if (rememberPassword) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        }
  
        // Store user role
        const role = responseData.data.role || responseData.data.roles;
        const effectiveRole = Array.isArray(role) ? role[0] : role;
        localStorage.setItem("userRole", effectiveRole.toLowerCase());
  
        // Check email verification status and store it
        if (responseData.data.email_verified) {
          localStorage.setItem("isEmailVerified", 'true');
          toast.success("Login successful!");
          
          // Navigate based on role
          switch(effectiveRole.toLowerCase()) {
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
              toast.error("Invalid user role");
              navigate("/login");
          }
        } else {
          // Store email for verification page
          localStorage.setItem("verificationEmail", email);
          localStorage.setItem("isEmailVerified", 'false');
          // toast.info("Please verify your email address");
          navigate("/verify-email");
        }
      } else {
        toast.error(responseData.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error_message?.email?.[0] ||
        error.response?.data?.error_message?.password?.[0] ||
        error.response?.data?.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const InactiveAccountPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 md:p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <svg
              className="h-6 w-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Account Not Activated
          </h3>
          
          <p className="text-sm text-gray-500 mb-6">
            Your account is currently pending activation by an administrator. You will receive an email notification once your account has been activated.
          </p>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowInactivePopup(false)}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00A8E8] hover:bg-[#00A8E8]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              I Understand
            </button>
            
            <button
              onClick={() => {
                setShowInactivePopup(false);
                setEmail("");
                setPassword("");
              }}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Another Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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
              Log in to account
            </CardTitle>
            <p className="text-center text-gray-500">
              Please enter your email and password to continue
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 top-3 font-semibold pr-3 flex items-center text-sm leading-5"
                >
                  {passwordVisible ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberPassword"
                  checked={rememberPassword}
                  onCheckedChange={(checked) => setRememberPassword(checked)}
                />
                <label
                  htmlFor="rememberPassword"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember Password
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-blue hover:bg-navy-bluex"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {showInactivePopup && <InactiveAccountPopup />}
    </div>
  );
};

export default Login;
