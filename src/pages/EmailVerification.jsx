import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { toast } from "react-toastify";
import bg from "../assets/bg.png";

export default function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('verificationEmail');
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const isVerified = localStorage.getItem('isEmailVerified') === 'true';
    const codeSent = localStorage.getItem('verificationCodeSent') === 'true';

    // If email is verified or we don't have necessary data, redirect
    if (!email || !token) {
      navigate("/login");
      return;
    }

    if (isVerified) {
      // Redirect based on user role
      switch(userRole?.toLowerCase()) {
        case 'client':
          navigate("/client-dashboard");
          break;
        case 'admin':
          navigate("/admin/dashboard");
          break;
        default:
          navigate("/login");
      }
      return;
    }

    // Only send verification code if it hasn't been sent yet
    if (!codeSent) {
      const sendInitialCode = async () => {
        try {
          const data = new FormData();
          data.append('confirmation_code', '');
          
          const response = await axiosInstance.post('/email/resend', 
            data,
            {
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            }
          );

          if (response.data.status === "success") {
            localStorage.setItem('verificationCodeSent', 'true');
            toast.info("A verification code has been sent to your email");
          }
        } catch (error) {
          // If the error is because email is already verified
          if (error.response?.data?.message === 'Email already verified.') {
            localStorage.setItem('isEmailVerified', 'true');
            
            // Redirect based on user role
            switch(userRole?.toLowerCase()) {
              case 'client':
                navigate("/client-dashboard");
                break;
              case 'admin':
                navigate("/admin/dashboard");
                break;
              default:
                navigate("/login");
            }
            return;
          }

          const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error_message || 
                            "Failed to send verification code";
          toast.error(errorMessage);
          
          if (error.response?.status === 401) {
            navigate("/login");
          }
        }
      };

      sendInitialCode();
    }
  }, [navigate]);

  const focusInput = (index) => {
    if (inputs.current[index]) {
      inputs.current[index]?.focus();
    }
  };

  const handleInput = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value !== "" && index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newCode[i] = pastedData[i];
      }
    }

    setCode(newCode);
    if (pastedData.length > 0) {
      focusInput(Math.min(pastedData.length, 3));
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    const email = localStorage.getItem('verificationEmail');
    const token = localStorage.getItem('authToken');
    const currentCode = code.join("");

    try {
      const data = new FormData();
      data.append('confirmation_code', currentCode);

      const response = await axiosInstance.post('/email/resend', 
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === "success") {
        setCode(["", "", "", "", "", ""]);
        toast.success("A new confirmation code has been sent to your email", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.error(response.data.message || "Failed to resend code");
      }
    } catch (error) {
      console.error("Resend code error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error_message || 
                          "Failed to resend the confirmation code";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    setIsLoading(true);
    const email = localStorage.getItem('verificationEmail');
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const verificationCode = code.join("");

    try {
      const data = new FormData();
      data.append('email', email);
      data.append('confirmation_code', verificationCode);

      const response = await axiosInstance.post('/verify-code', 
        data,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.status === "success") {
        toast.success("Email verified successfully");
        localStorage.setItem('isEmailVerified', 'true');
        localStorage.removeItem('verificationCodeSent');
        
        // Redirect based on user role after successful verification
        if (userRole === 'admin') {
          navigate("/admin/dashboard");
        } else if (userRole === 'client') {
          navigate("/client-dashboard");
        } else {
          navigate("/login");
        }
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error_message || 
                          "Failed to verify the confirmation code";
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
        <Card className="w-full max-w-md mt-20">
          <CardContent className="pt-6">
            <div className="space-y-10">
              <div className="flex items-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center text-sm text-sky-blue hover:text-gray-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go back
                </Link>
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Verify your email
                </h1>
                <p className="text-gray-500">
                  A verification code was sent to your email
                </p>
              </div>
              <div className="flex flex-col relative">
                <div className="flex flex-wrap justify-center gap-2">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      ref={(el) => (inputs.current[index] = el)}
                      onChange={(e) => handleInput(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-14 h-14 text-center text-lg bg-gray-50"
                    />
                  ))}
                </div>
                <button
                  onClick={handleResendCode}
                  className="absolute w-fit -bottom-6 right-20 text-sky-blue hover:text-blue-600 text-sm"
                >
                  Resend code
                </button>
              </div>

              <Button
                className="w-full bg-sky-blue hover:bg-navy-bluex"
                onClick={handleVerify}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
