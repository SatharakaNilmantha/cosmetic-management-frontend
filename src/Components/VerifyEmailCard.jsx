import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function VerifyEmailCard({ activeCard, setActiveCard, email }) {
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

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      alert("Email Verified!");
      setActiveCard("login");
      setOtp(["", "", "", "", "", ""]);
    } else {
      alert("Please enter a complete 6-digit OTP");
    }
  };

  return (
   <>
   
    <div className={`glass-card ${activeCard === "verifyEmail" ? "activestatus" : "slide-right"}`}>
    
      <h2 className="text-2xl font-semibold mb-4 text-center text-white"> Verify Email </h2>
     
      <p className="text-center text-white text-sm mb-6 leading-relaxed"> An OTP has been sent to <br />
        <span className="bg-gradient-to-r from-[#A953BA] via-[#C8488C] to-[#F68961] bg-clip-text text-transparent font-semibold text-bold block mt-1"> {email}</span>
        <span className="block mt-2"> Enter it below to verify your email.</span>
      </p>
      
      <div className="flex justify-center items-center gap-3 mb-8">
        {Array(6).fill(0).map((_, idx) => (
          <input key={idx} type="text" inputMode="numeric" maxLength="1"
            value={otp[idx]}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
            ref={(el) => otpRefs.current[idx] = el}
            className="w-12 h-14 text-center rounded-xl bg-white/30 border-2 border-white/50 outline-none text-white font-bold focus:border-[#A953BA] focus:ring-2 focus:ring-[#A953BA]/30 transition-all"
            style={{  caretColor: 'transparent', fontSize: '20px',lineHeight: '1',padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          />
        ))}
      </div>

      <button type="button" className="w-full py-3 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition text-base" onClick={handleVerify} > Verify </button>
      <p className="mt-6 text-center text-white text-sm"> Back to{" "} <Link to="#" className="underline font-medium" onClick={() => setActiveCard("login")}>  Login </Link> </p>
    
    </div>
  </>
  );
}

export default VerifyEmailCard;