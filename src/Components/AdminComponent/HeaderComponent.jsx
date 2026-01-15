import React, { useEffect, useState } from "react";
import "./HeaderComponent.css";

function HeaderComponent(props) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US");

  return (
    <>
    <div className="bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg text-white flex flex-col py-1 px-3 m-3 rounded-lg header-card">
      <div className="HeaderSection">

        {/* Left Section */}
        <div className="header-left ">
          {props.icon && (
            <img src={props.icon} alt="Header Icon" className="header-icon floating-icon" />
          )}

          <div className="header-text">
            <h1 className="gradient-text">{props.title}</h1>
            <p className="gradient-text-desc">{props.description}</p>
          </div>
        </div>

        {/* Right Section */}
          <div className="header-right">
            <h2 className="gradient-text-right">{formattedDate}</h2>
            <p className="gradient-text-right">{formattedTime}</p>
          </div>

      </div>
    </div>
    </>
  );
}

export default HeaderComponent;
