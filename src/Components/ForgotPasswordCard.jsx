import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ForgotPasswordCard({ activeCard, setActiveCard, email, setEmail }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  useEffect(() => {
    otpRefs.current = otpRefs.current.slice(0, 6);
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Move to next input if value is entered
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current field is empty and backspace is pressed, move to previous field
        otpRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      } else if (otp[index]) {
        // If current field has value, clear it
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setActiveCard("resetPassword");
      setOtp(["", "", "", "", "", ""]);
    } else {
      alert("Please enter a complete 6-digit OTP");
    }
  };

  const handleResetPassword = () => {
    alert("Password reset successful!");
    setActiveCard("login");
  };

  return (
   < > 
    <div className={`glass-card ${activeCard === "forgot" || activeCard === "forgotOtp" || activeCard === "resetPassword" ? "activestatus" : "slide-left"}`}>
    
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
          <p className="text-center text-white text-sm mb-4"> Enter the 6-digit OTP sent to <span className="bg-gradient-to-r from-[#A953BA] via-[#C8488C] to-[#F68961] bg-clip-text text-transparent font-semibold text-bold block mt-1">{email}</span></p>
      
        <div className="flex justify-center items-center gap-3 mb-8">
         {Array(6).fill(0).map((_, idx) => (
            <input key={idx} type="text" inputMode="numeric" maxLength="1"
                value={otp[idx]}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                ref={(el) => otpRefs.current[idx] = el}
                className="w-12 h-14 text-center rounded-xl bg-white/30 border-2 border-white/50 outline-none text-white font-bold focus:border-[#A953BA] focus:ring-2 focus:ring-[#A953BA]/30 transition-all"
                style={{  caretColor: 'transparent', fontSize: '20px', lineHeight: '1', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          ))}
        </div>
       
        <button type="button" className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition" onClick={handleVerifyOtp} > Verify OTP </button>
       
        </>

      )}

      {activeCard === "resetPassword" && (
        <>
          <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Reset Password </h2>
          <form className="flex flex-col gap-3">
            <input type="password" placeholder="New Password" required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"/>
            <input type="password" placeholder="Confirm New Password" required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm" />
            <button type="button" className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition" onClick={handleResetPassword} > Reset Password</button>
          </form>
        </>
      )}

      <p className="mt-4 text-center text-white text-sm"> Back to{" "}  <Link to="#" className="underline font-medium" onClick={() => setActiveCard("login")}> Login </Link> </p>
    
    </div>
  </>
  );
}

export default ForgotPasswordCard;