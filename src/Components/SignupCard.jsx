import React, { useState } from "react";
import { Link } from "react-router-dom";

function SignupCard({ activeCard, setActiveCard, email, setEmail }) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // confirm password validation
    if (password !== confirmPassword) {
       setError("Passwords do not match");
      return;
    }

    setError("");
    setActiveCard("verifyEmail");
  };

  return (
    <>
      <div className={`glass-card ${activeCard === "signup" ? "activestatus" : "slide-right" }`} >
       
        <h2 className="text-2xl font-semibold mb-4 text-center text-white">Create an Account </h2>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
         
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"/>

          <input  type="text"  placeholder="Last Name"  value={lastName}  onChange={(e) => setLastName(e.target.value)}  required  className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"/>

          <input  type="email"  placeholder="Enter your email"  value={email}  onChange={(e) => setEmail(e.target.value)}  required  className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm" />

          <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"/>

          <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required  className="w-full bg-white/30 placeholder-gray-700 border border-white/40 outline-none rounded-full py-2.5 px-4 text-sm"  />

          {error && (  <p className="text-red-400 text-sm text-center">{error}</p>)}

          <button type="submit" className="w-full py-2.5 rounded-full text-white font-medium bg-gradient-to-r from-[#A953BA] to-[#F68961] hover:opacity-90 transition" > Sign up</button>
        </form>

        <p className="mt-4 text-center text-white text-sm"> Already have an account?{" "} <Link  to="#"  className="underline font-medium"   onClick={() => setActiveCard("login")} > Login </Link> </p>
      </div>
    </>
  );
}

export default SignupCard;
