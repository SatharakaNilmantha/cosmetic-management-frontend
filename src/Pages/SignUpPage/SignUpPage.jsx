import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import wallpaper from '../../Images/others/wallpaper.png';
import './SignUpPage.css';

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeStep, setActiveStep] = useState("signup"); // "signup" | "verifyEmail"
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);
  const [timer, setTimer] = useState(60); // 60 seconds timer
  const [canResend, setCanResend] = useState(false);
  const verifyOtpRefs = useRef([]);
  const navigate = useNavigate();

  // Hide scrollbars when component mounts
  useEffect(() => {
    // Hide scrollbars on body
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    // Trigger animation after mount
    setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    // Restore scrollbars when component unmounts
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
    
    // When moving to verifyEmail, start the timer
    if (step === "verifyEmail") {
      setOtpSentTime(Date.now());
      setTimer(60);
      setCanResend(false);
    }
  };

  // Function to resend OTP
  const handleResendOTP = () => {
    if (!canResend) return;
    
    // Reset OTP fields
    setOtp(["", "", "", "", "", ""]);
    
    // Reset and start timer
    setOtpSentTime(Date.now());
    setTimer(60);
    setCanResend(false);
    
    // Show success message
    alert(`OTP has been resent to ${email}`);
    
    // Focus on first OTP input
    if (verifyOtpRefs.current[0]) {
      verifyOtpRefs.current[0].focus();
    }
  };

  // Function to verify OTP
  const handleVerifyOTP = () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      alert("Please enter a complete 6-digit OTP");
      return;
    }
    
    // Here you would typically verify the OTP with your backend
    // For demo purposes, we'll simulate successful verification
    alert("Email Verified! Redirecting to login page...");
    
    // Reset OTP
    setOtp(["", "", "", "", "", ""]);
    
    // Redirect to login page after 1 second
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Get animation class based on state
  const getAnimationClass = (step) => {
    if (!isPageLoaded) return "slide-right"; // Start off-screen
    
    if (activeStep === step) {
      return "activestatus";
    } else {
      return "slide-right";
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${wallpaper})` }}>
      
      {/* ===== SIGNUP CARD ===== */}
      <div className={`glass-card ${getAnimationClass("signup")}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Create an Account </h2>
        <form className="flex flex-col gap-3">
          <input type="text" placeholder="First Name" required className="w-full"/>
          <input type="text" placeholder="Last Name" required className="w-full"/>
          <input type="email"  placeholder="Enter your email"  value={email}  onChange={e => setEmail(e.target.value)}  required  className="w-full"/>
          <input type="password"  placeholder="Enter your password"  required  className="w-full" />
          <input type="password"  placeholder="Confirm password"  required  className="w-full" />
          <button type="button" className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition" 
            onClick={() => {
              if (!email) {
                alert("Please enter your email first");
                return;
              }
              handleStepChange("verifyEmail");
            }}
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-center text-white text-sm">
            Already have an account?{" "}
          <Link to="/login" className="underline font-medium">
            Login
          </Link>
        </p>
      </div>

      {/* ===== EMAIL VERIFICATION / OTP AFTER SIGNUP ===== */}
      <div className={`glass-card ${getAnimationClass("verifyEmail")}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Verify Email </h2>
        <p className="text-center text-white text-sm mb-6 leading-relaxed"> An OTP has been sent to <br />
            <span className="bg-gradient-to-r from-[#A953BA] via-[#C8488C] to-[#F68961] bg-clip-text text-transparent font-semibold text-bold block mt-1"> {email}</span>
            <span className="block mt-2"> Enter it below to verify your email.</span>
        </p>

        <div className="flex justify-between gap-2 mb-4">
          {Array(6).fill(0).map((_, idx) => (
            <input key={idx}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={otp[idx]}
              onChange={(e) => handleVerifyOtpChange(idx, e.target.value)}
              onKeyDown={(e) => handleVerifyOtpKeyDown(idx, e)}
              ref={(el) => verifyOtpRefs.current[idx] = el}
              className="w-12 h-14 text-center rounded-xl bg-white/30 border-2 border-white/50 outline-none text-white font-bold transition-all"
              style={{  fontSize: '20px',lineHeight: '1',padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          
            />
          ))}
        </div>
        <button type="button" className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition mb-3" onClick={handleVerifyOTP}> Verify Email</button>
        <div className="flex justify-between items-center mt-4">
          <button type="button" onClick={handleResendOTP} disabled={!canResend} className={`text-white text-sm underline font-medium ${!canResend ? 'opacity-50 cursor-not-allowed' : 'hover:text-white/80'}`}>
            {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
          </button>
          <button type="button" className="text-white text-sm underline hover:text-white/80" onClick={() => handleStepChange("signup")} >Back to Signup</button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;