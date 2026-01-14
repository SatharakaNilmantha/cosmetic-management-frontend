import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import wallpaper from '../../Images/others/wallpaper.png';
import './SignUpPage.css';

import { toast } from "react-hot-toast";
import { showWarningToast } from "../../Components/PopupMessageComponent/PopupMessage";


function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeStep, setActiveStep] = useState("signup");
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const verifyOtpRefs = useRef([]);
  const navigate = useNavigate();

  // Hide scrollbars when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, []);

  // Initialize refs
  useEffect(() => {
    verifyOtpRefs.current = verifyOtpRefs.current.slice(0, 6);
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (otpSentTime && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSentTime, timer]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle signup form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/registeruser`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      toast.success(response.data.message);
      
      // Store verification ID for OTP verification
      if (response.data.verificationId) {
        setVerificationId(response.data.verificationId);
      }
      
      // Move to OTP verification step
      // handleStepChange("verifyEmail");

      navigate('/login'); // Redirect to login page after successful signup
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Signup failed");
      } else if (error.request) {
        console.log("Network error:", error.message);
        showWarningToast("Network error: Please check your connection"); // ⚠️ now works
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      verifyOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        verifyOtpRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      verifyOtpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      verifyOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
    
    if (step === "verifyEmail") {
      setOtpSentTime(Date.now());
      setTimer(60);
      setCanResend(false);
    }
  };

  // Function to resend OTP
  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/resend-otp`, {
        email: formData.email
      });
      
      toast.success(response.data.message);
      
      // Reset OTP fields
      setOtp(["", "", "", "", "", ""]);
      
      // Reset and start timer
      setOtpSentTime(Date.now());
      setTimer(60);
      setCanResend(false);
      
      // Focus on first OTP input
      if (verifyOtpRefs.current[0]) {
        verifyOtpRefs.current[0].focus();
      }
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to resend OTP");
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify OTP
  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/verify-email`, {
        email: formData.email,
        otp: otpString,
        verificationId: verificationId // Include this if your backend needs it
      });
      
      toast.success(response.data.message);
      
      // Reset OTP
      setOtp(["", "", "", "", "", ""]);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Redirect to login page after 1 second
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "OTP verification failed");
      } else if (error.request) {
        toast.error("Network error: Please check your connection");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Get animation class based on state
  const getAnimationClass = (step) => {
    if (!isPageLoaded) return "slide-right";
    
    if (activeStep === step) {
      return "activestatus";
    } else {
      return "slide-right";
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${wallpaper})` }}>
      
      {/* Signup Card */}
      <div className={`glass-card ${getAnimationClass("signup")}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">Create an Account</h2>
        <form className="flex flex-col gap-3" onSubmit={handleSignUp}>
          <input 
            type="text" 
            name="firstName"
            placeholder="First Name" 
            value={formData.firstName}
            onChange={handleInputChange}
            required 
            className="w-full"
          />
          <input 
            type="text" 
            name="lastName"
            placeholder="Last Name" 
            value={formData.lastName}
            onChange={handleInputChange}
            required 
            className="w-full"
          />
          <input 
            type="email"  
            name="email"
            placeholder="Enter your email"  
            value={formData.email}
            onChange={handleInputChange}
            required  
            className="w-full"
          />
          <input 
            type="password"  
            name="password"
            placeholder="Enter your password"  
            value={formData.password}
            onChange={handleInputChange}
            required  
            className="w-full" 
          />
          <input 
            type="password"  
            name="confirmPassword"
            placeholder="Confirm password"  
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required  
            className="w-full" 
          />
          <button 
            type="submit" 
            className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-white text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline font-medium">
            Login
          </Link>
        </p>
      </div>

      {/* Email Verification / OTP Card */}
      <div className={`glass-card ${getAnimationClass("verifyEmail")}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">Verify Email</h2>
        <p className="text-center text-white text-sm mb-6 leading-relaxed">
          An OTP has been sent to <br />
          <span className="bg-gradient-to-r from-[#A953BA] via-[#C8488C] to-[#F68961] bg-clip-text text-transparent font-semibold text-bold block mt-1">
            {formData.email}
          </span>
          <span className="block mt-2">Enter it below to verify your email.</span>
        </p>

        <div className="flex justify-between gap-2 mb-4">
          {Array(6).fill(0).map((_, idx) => (
            <input 
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={otp[idx]}
              onChange={(e) => handleVerifyOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleVerifyOtpKeyDown(idx, e)}
              ref={(el) => verifyOtpRefs.current[idx] = el}
              className="w-12 h-14 text-center rounded-xl bg-white/30 border-2 border-white/50 outline-none text-white font-bold transition-all"
              style={{ 
                fontSize: '20px',
                lineHeight: '1',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              disabled={isLoading}
            />
          ))}
        </div>
        
        <button 
          type="button" 
          className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleVerifyOTP}
          disabled={isLoading}
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
        
        <div className="flex justify-between items-center mt-4">
          <button 
            type="button" 
            onClick={handleResendOTP} 
            disabled={!canResend || isLoading}
            className={`text-white text-sm underline font-medium ${(!canResend || isLoading) ? 'opacity-50 cursor-not-allowed' : 'hover:text-white/80'}`}
          >
            {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
          </button>
          <button 
            type="button" 
            className="text-white text-sm underline hover:text-white/80 disabled:opacity-50"
            onClick={() => handleStepChange("signup")}
            disabled={isLoading}
          >
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;