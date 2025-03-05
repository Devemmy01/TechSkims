import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import bg from "../assets/bg.png";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || ""; // Retrieve email from state
  const [confirmationCode, setConfirmationCode] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Track the current step
  const navigate = useNavigate();

  const handleCodeChange = (value, index) => {
    const newCode = [...confirmationCode];
    newCode[index] = value;
    setConfirmationCode(newCode);
  };

  const handleNextStep = () => {
    if (confirmationCode.join("").length !== 6) {
      toast.error("Please enter the complete confirmation code");
      return;
    }
    setStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/password/reset", {
        email, // Use the email from state
        confirmation_code: confirmationCode.join(""),
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      const responseData = response.data;

      if (responseData.status === "success") {
        toast.success(responseData.data);
        navigate("/login");
      } else {
        toast.error(responseData.message || "Reset failed");
      }
    } catch (error) {
      console.error("Reset password error:", error.response?.data || error.message);
      const errorMessage =
        error.response?.data?.error_message?.password?.[0] ||
        error.response?.data?.message ||
        "Reset failed. Please try again.";
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
              Reset Password
            </CardTitle>
            <p className="text-center text-gray-500">
              {step === 1
                ? "Enter the confirmation code"
                : "Enter your new password"}
            </p>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  {/* <Label>Confirmation Code</Label> */}
                  <div className="flex space-x-2 justify-center">
                    {confirmationCode.map((code, index) => (
                      <Input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 text-base text-center"
                        value={code}
                        onChange={(e) => handleCodeChange(e.target.value, index)}
                        required
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-full bg-sky-blue hover:bg-navy-bluex"
                  onClick={handleNextStep}
                >
                  Next
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter your new password"
                    className="bg-gray-50"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    className="bg-gray-50"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-sky-blue hover:bg-navy-bluex"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword; 