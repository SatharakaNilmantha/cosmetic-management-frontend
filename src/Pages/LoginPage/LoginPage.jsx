import React, { useState, useEffect } from "react";
import wallpaper from '../../Images/others/admin-wallpaper2.png';
import LoginCard from '../../Components/LoginCard.jsx';
import SignupCard from '../../Components/SignupCard.jsx';
import VerifyEmailCard from '../../Components/VerifyEmailCard.jsx';
import ForgotPasswordCard from '../../Components/ForgotPasswordCard.jsx';
import './LoginPage.css';

function LoginPage() {
  const [activeCard, setActiveCard] = useState(""); // "" | "login" | "signup" | "verifyEmail" | "forgot" | "forgotOtp" | "resetPassword"
  const [email, setEmail] = useState("");

  useEffect(() => {
    // initial animation
    setTimeout(() => setActiveCard("login"), 100);
  }, []);

  return (
    <div className="min-h-screen w-screen fixed items-center justify-center bg-cover bg-center overflow-hidden"style={{ backgroundImage: `url(${wallpaper})` }}>
     
      <LoginCard  activeCard={activeCard} setActiveCard={setActiveCard} email={email} setEmail={setEmail} />
      
      <SignupCard activeCard={activeCard}setActiveCard={setActiveCard}email={email}setEmail={setEmail}/>
      
      <VerifyEmailCard  activeCard={activeCard} setActiveCard={setActiveCard} email={email}/>
      
      <ForgotPasswordCard  activeCard={activeCard}setActiveCard={setActiveCard}email={email}setEmail={setEmail}/>

    </div>
  );
}

export default LoginPage;