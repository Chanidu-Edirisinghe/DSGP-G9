import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthStyles.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data Submitted:", formData);
  };

  const handleGuestLogin = () => {
    console.log("Guest Login");
    // Add guest login logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
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

        <button onClick={handleGuestLogin} className="btn-guest">
          Continue as Guest
        </button>

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
