import { React, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./navbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState("");
  
  const getUserInitials = () => {
    return currentUser.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // Fetch user information when authenticated
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (isAuthenticated) {
        try {
          const token = localStorage.getItem("access_token");
          const response = await axios.get("http://127.0.0.1:5000/api/user/info", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Set the user's name from the response
          if (response.data && response.data.name) {
            setCurrentUser(response.data.name);
          }
        } catch (error) {
          console.error("Error fetching user information:", error);
          setCurrentUser("User"); // Fallback name if fetch fails
        }
      }
    };

    fetchUserInfo();
  }, [isAuthenticated]);

  // Check if user is trying to access a protected route
  useEffect(() => {
    const protectedRoutes = ["/readmission", "/mortality", "/dashboard"];
    if (!isAuthenticated && protectedRoutes.includes(location.pathname)) {
      // Redirect to login page if trying to access protected route
      window.location.href = "/login";
    }
  }, [isAuthenticated, location.pathname]);

  return (
    <div className="topnav">
      <div className="topnav-left">
        <h2 className="logo">DiaTrack</h2>
        <div className="nav-links">
          <Link to="/classification" className={isActive("/classification")}>
            Classification
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/readmission" className={isActive("/readmission")}>
                Readmission
              </Link>
              <Link to="/mortality" className={isActive("/mortality")}>
                Mortality
              </Link>
              <Link to="/dashboard" className={isActive("/dashboard")}>
                Dashboard
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="topnav-right">
        {!isAuthenticated ? (
          <Link to="/login" className={isActive("/login")}>
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
            <Link to="/classification" onClick={handleLogout}>
              Logout
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;