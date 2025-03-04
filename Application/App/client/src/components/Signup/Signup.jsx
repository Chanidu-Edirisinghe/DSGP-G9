import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthStyles.css";

function Signup({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    // ✅ Add logic to handle signup (backend/API call can go here)
    console.log("User signed up:", formData);
    setIsAuthenticated(true);
    navigate("/classification"); // Redirect after signup
  };

  // const handleGuestLogin = () => {
  //   console.log("Guest Login");
  //   navigate("/classification");
  // };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Sign Up
          </button>
        </form>

        {/* <button onClick={handleGuestLogin} className="btn-guest">
          Continue as Guest
        </button> */}

        <div className="auth-footer">
          <p>Already have an account?</p>
          <Link to="/login" className="btn-secondary">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
