import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="topnav">
      <div className="topnav-left">
        <h2 className="logo">DiaTrack</h2>
        <div className="nav-links">
          <Link to="/classification" className="active">
            Classification
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/readmission">Readmission</Link>
              <Link to="/mortality">Mortality</Link>
            </>
          )}
        </div>
      </div>

      <div className="topnav-right">
        {!isAuthenticated ? (
          <Link to="/login">Login</Link>
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
