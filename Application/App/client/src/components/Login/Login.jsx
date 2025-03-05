import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthStyles.css";

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // ✅ Add login validation logic (backend/API call can go here)
    console.log("User logged in:", formData);
    setIsAuthenticated(true);
    navigate("/classification"); // Redirect after login
  };

  // const handleGuestLogin = () => {
  //   console.log("Guest Login");
  //   navigate("/classification");
  // };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>

        {/* <button onClick={handleGuestLogin} className="btn-guest">
          Continue as Guest
        </button> */}

        <div className="auth-footer">
          <p>Don't have an account yet?</p>
          <Link to="/signup" className="btn-secondary">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
