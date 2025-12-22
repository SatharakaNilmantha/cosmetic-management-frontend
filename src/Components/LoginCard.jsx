import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginCard({ activeCard, setActiveCard, email, setEmail }) {

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Validation
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // If there are errors, set them and prevent navigation
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // If validation passes, navigate to home
    navigate("/");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(e);
  };

  

  return (
    <div className={`glass-card ${activeCard === "login" ? "activestatus" : "slide-left"}`}>
      <h2 className="text-2xl font-semibold mb-4 text-center text-white">Welcome back</h2>
     
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
       
        <input  type="email"  placeholder="Enter your email" value={email}  onChange={e => setEmail(e.target.value)}  required  className={`w-full bg-white/30 placeholder-gray-700 border outline-none rounded-full py-2.5 px-4 text-sm ${errors.email ? 'border-red-500' : 'border-white/40'}`} /> {errors.email && <p className="text-red-500 text-xs mt-1 ml-4">{errors.email}</p>} 
        
        <input  type="password"  placeholder="Enter your password"  value={password} onChange={e => setPassword(e.target.value)} required className={`w-full bg-white/30 placeholder-gray-700 border outline-none rounded-full py-2.5 px-4 text-sm ${errors.password ? 'border-red-500' : 'border-white/40'}`} />{errors.password && <p className="text-red-500 text-xs mt-1 ml-4">{errors.password}</p>}
        
        <div className="text-right"> <Link  to="#" className="text-sm text-white underline"  onClick={() => setActiveCard("forgot")} > Forgot Password?</Link> </div>
        
        <button  type="submit" className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition"  > Log in </button>
    
      </form>

      <div className="mt-4 space-y-3">
        <button  type="button"  className="w-full flex items-center gap-3 justify-center py-2.5 rounded-full bg-white/80 hover:bg-white transition text-gray-800 text-sm font-medium">
          <img  className="h-4 w-4"  src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleFavicon.png"  alt="Google"/>Continue with Google
        </button>

        <button  type="button"  className="w-full flex items-center gap-3 justify-center py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 transition text-white text-sm font-medium" >
          <img  className="h-4 w-4"  src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"  alt="Facebook"/>Continue with Facebook
        </button>
      </div>

      <p className="mt-4 text-center text-white text-sm"> Don't have an account?{" "} <Link    to="#"    className="underline font-medium"   onClick={() => setActiveCard("signup")}> Signup </Link></p>
    </div>
  );
}

export default LoginCard;