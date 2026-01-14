import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import wallpaper from '../../Images/others/wallpaper.png';
import './LoginPage.css';
import axios from "axios";

import { toast } from "react-hot-toast";
import { showWarningToast } from "../../Components/PopupMessageComponent/PopupMessage";


function LoginPage() {
  const [activeCard, setActiveCard] = useState(""); // "" | "login" | "forgot" | "forgotOtp" | "resetPassword"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotOtp, setForgotOtp] = useState(["", "", "", "", "", ""]);
  const forgotOtpRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    // initial animation
    setTimeout(() => setActiveCard("login"), 100);
    forgotOtpRefs.current = forgotOtpRefs.current.slice(0, 6);
  }, []);

  const handleForgotOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...forgotOtp];
    newOtp[index] = value;
    setForgotOtp(newOtp);
    
    if (value && index < 5) {
      forgotOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleForgotOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!forgotOtp[index] && index > 0) {
        forgotOtpRefs.current[index - 1]?.focus();
        const newOtp = [...forgotOtp];
        newOtp[index - 1] = "";
        setForgotOtp(newOtp);
      } else if (forgotOtp[index]) {
        const newOtp = [...forgotOtp];
        newOtp[index] = "";
        setForgotOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      forgotOtpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      forgotOtpRefs.current[index + 1]?.focus();
    }
  };

 // Handle login form submission
async function handleLoginSubmit(e) {
  e.preventDefault(); // Prevent default form submission

  // Basic validation
  if (!email || !password) {
    toast.error("Please enter both email and password");
    return;
  }

  try {
    const response = await axios.post(import.meta.env.VITE_API_URL + '/api/users/login', { 
      email, 
      password 
    });

    console.log(response.data);
    toast.success(response.data.message);

    localStorage.setItem('token', response.data.token); // Store JWT token
    
    if (response.data.role === 'admin') {
      navigate('/admin/dashboard'); // Redirect to admin dashboard
      return;
    }else{
      navigate('/'); // Redirect to user homepage
      return;
    }
    

  } catch (error) {
    if (error.response) {
      // Server responded with a status code outside 2xx
      console.log("Login error:", error.response.data.message);
      toast.error(error.response.data.message);
    }else if (error.request) {
      // Network error
      console.log("Network error:", error.message);
      showWarningToast("Network error: Please check your connection"); // ⚠️ now works
    } else {
      // Something else happened
      console.log("Error:", error.message);
      toast.error("An unexpected error occurred");
    }
  }

 
  console.log("Logging in with:", { email, password }); // Optional: For debugging only
}


  return (
     <div className="min-h-screen w-screen flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${wallpaper})` }}>

      {/* ===== LOGIN CARD ===== */}
      <div className={`glass-card ${activeCard === "login" ? "active" : "slide-left"}`}>
        <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Welcome back</h2>
        <form className="flex flex-col gap-3" onSubmit={handleLoginSubmit}>
          <input  type="email"  placeholder="Enter your email"  value={email}  onChange={e => setEmail(e.target.value)}  required  className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"  />
          <input  type="password"  placeholder="Enter your password"  value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm" />
         
          <div className="text-right">
            <button type="button" className="text-sm text-white underline" onClick={() => setActiveCard("forgot")}> Forgot Password?</button>
          </div>
          <button  type="submit"   className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition">   Log in </button>
        </form>

        <div className="mt-4 space-y-3">
          <button type="button" className="w-full flex items-center gap-3 justify-center py-2.5 rounded-full bg-white/80 hover:bg-white transition text-gray-800 text-sm font-medium" >
            <img className="h-4 w-4" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png" alt="Google"/> Continue with Google
          </button>

          <button type="button" className="w-full flex items-center gap-3 justify-center py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium" >
            <img className="h-4 w-4" src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" /> Continue with Facebook
          </button>
        </div>

        <p className="mt-4 text-center text-white text-sm">   Don't have an account?{" "}
          <Link to="/signup" className="underline font-medium"> Signup</Link>
        </p>
      </div>

      {/* ===== FORGOT PASSWORD / SEND OTP / RESET ===== */}
      <div className={`glass-card ${activeCard === "forgot" || activeCard === "forgotOtp" || activeCard === "resetPassword" ? "active" : "slide-left"}`}>
        {activeCard === "forgot" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Forgot Password </h2>
            <p className="text-center text-white text-sm mb-4">Enter your registered email to receive OTP</p>
            <form className="flex flex-col gap-3">
              <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"/>
              <button type="button" className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition" onClick={() => setActiveCard("forgotOtp")} > Send OTP</button>
            </form>
          </>
        )}

        {activeCard === "forgotOtp" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Enter OTP </h2>
            <p className="text-center text-white text-sm mb-4">
              Enter the 6-digit OTP sent to {email}
            </p>
            <div className="flex justify-between gap-2 mb-4">
              {Array(6).fill(0).map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={forgotOtp[idx]}
                  onChange={(e) => handleForgotOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleForgotOtpKeyDown(idx, e)}
                  ref={(el) => forgotOtpRefs.current[idx] = el}
                  className="w-12 h-14 text-center rounded-xl bg-white/30 border-2 border-white/50 outline-none text-white font-bold transition-all"
                  style={{  fontSize: '20px',lineHeight: '1',padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                />
              ))}
            </div>

            <button
              type="button"  
              className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition"
              onClick={() => {
                const otpString = forgotOtp.join('');
                if (otpString.length === 6) {
                  setActiveCard("resetPassword");
                  setForgotOtp(["", "", "", "", "", ""]);
                } else {
                  alert("Please enter a complete 6-digit OTP");
                }
              }}
            >
              Verify OTP
            </button>
          </>
        )}

        {activeCard === "resetPassword" && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Reset Password </h2>
            <form className="flex flex-col gap-3">
              <input type="password" placeholder="New Password" required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"/>
              <input type="password" placeholder="Confirm New Password" required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"/>
              
              <button 
                type="button" 
                className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition"
                onClick={() => { 
                  alert("Password reset successful!"); 
                  setActiveCard("login");
                }}
              >
                Reset Password
              </button>
            </form>
          </>
        )}

        <p className="mt-4 text-center text-white text-sm"> Back to{" "}
          <button   className="underline font-medium"  onClick={() => setActiveCard("login")} >   Login </button>
        </p>
      </div>

    </div>
  );
}

export default LoginPage;