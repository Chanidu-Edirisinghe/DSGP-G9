import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const [activeRoute, setActiveRoute] = useState("");
  
  const currentUser = "Admin"; 
  
  // Update active route when location changes
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location]);
  
  // Get user initials for avatar
  const getUserInitials = () => {
    return currentUser.substring(0, 2).toUpperCase();
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    // Clear any auth tokens from localStorage
    localStorage.removeItem("access_token");
  };

  return (
    <div className="topnav">
      <div className="topnav-left">
        <h2 className="logo">DiaTrack</h2>
        <div className="nav-links">
          {/* <Link to="/" 
            className={activeRoute === "/" ? "active" : ""}
          >
            Home
          </Link> */} 
          <Link 
            to="/classification" 
            className={activeRoute === "/classification" ? "active" : ""}
          >
            Classification
          </Link>
          {isAuthenticated && (
            <>
              <Link 
                to="/readmission" 
                className={activeRoute === "/readmission" ? "active" : ""}
              >
                Readmission
              </Link>
              <Link 
                to="/mortality" 
                className={activeRoute === "/mortality" ? "active" : ""}
              >
                Mortality
              </Link>
              <Link 
                to="/dashboard" 
                className={activeRoute === "/dashboard" ? "active" : ""}
              >
                Dashboard
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="topnav-right">
        {!isAuthenticated ? (
          <Link 
            to="/login"
            className={activeRoute === "/login" ? "active" : ""}
          >
            Login
          </Link>
        ) : (
          <>
            <div className="user-info">
              <div className="user-meta">
                <div className="username">{currentUser}</div>
              </div>
              <div className="user-avatar">{getUserInitials()}</div>
            </div>
            <Link to="/classification" onClick={handleLogout} className="logout-btn">
              Logout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;