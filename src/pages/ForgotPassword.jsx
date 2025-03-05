import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import bg from "../assets/bg.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/password/email", { email });
      const responseData = response.data;

      if (responseData.status === "success") {
        toast.success(responseData.data);
        navigate("/reset-password", { state: { email } });
      } else {
        toast.error(responseData.message || "Request failed");
      }
    } catch (error) {
      console.error(
        "Password reset error:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.error_message?.email?.[0] ||
        error.response?.data?.message ||
        "Request failed. Please try again.";
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
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center pt-7">
              Forgot Password
            </CardTitle>
            <p className="text-center text-gray-500">
              Enter your email to receive a verification code
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePasswordReset}>
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
              <Button
                type="submit"
                className="w-full bg-sky-blue hover:bg-navy-bluex"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
