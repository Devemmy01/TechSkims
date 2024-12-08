import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import axios from "axios";
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
      const loginAxios = axios.create();
      
      const response = await loginAxios.post(
        "https://api.techskims.com/api/login",
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
  
      const responseData = response.data;
  
      if (responseData.status === "success") {
        // Clear any existing tokens first
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
  
        // Store new token
        const token = responseData.data.apiToken;
        localStorage.setItem("token", token);
  
        // Handle remember password
        if (rememberPassword) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }
  
        // Handle role-based navigation
        const role = responseData.data.role || responseData.data.roles;
        const effectiveRole = Array.isArray(role) ? role[0] : role;
        localStorage.setItem("userRole", effectiveRole);
  
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
            console.warn('Unknown role:', effectiveRole);
            navigate("/client-dashboard"); // Fallback to client dashboard
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
    </div>
  );
};

export default Login;
