import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bg from "../assets/bg.png";

export default function EmailVerification() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);
  const navigate = useNavigate();

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

    if (value !== "" && index < 3) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < 3) {
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

  const handleResendCode = () => {
    setIsLoading(true);

    const token = localStorage.getItem('authToken');

    axios.post('https://api.techskims.com/api/email/resend', {}, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((response) => {
      console.log(response.data);
      toast.success("A new confirmation code has been sent to your email");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to resend the confirmation code");
      setIsLoading(false);
    });
  };

  const handleVerify = () => {
    setIsLoading(true);

    const token = localStorage.getItem('authToken');

    const verificationCode = code.join("");
    const formData = new FormData();
    formData.append('confirmation_code', verificationCode);
  
    axios.post('https://api.techskims.com/api/verify-code', formData, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.status === "success") {
        toast.success("Email verified successfully");
        navigate('/login');
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to verify the confirmation code");
    })
    .finally(() => {
      setIsLoading(false);
    });
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
                <div className="flex justify-center gap-2">
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
}