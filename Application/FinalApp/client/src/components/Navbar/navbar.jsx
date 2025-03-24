import { React, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  // Function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

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
          <Link to="/classification" onClick={handleLogout}>
            Logout
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
