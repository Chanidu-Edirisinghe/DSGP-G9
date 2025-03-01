import { useState } from "react";
import { Link } from "react-router-dom";
import "./AuthStyles.css";

function Signup() {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  const handleGuestLogin = () => {
    console.log("Guest Login");
    // Add guest login logic here
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
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

        <button onClick={handleGuestLogin} className="btn-guest">
          Continue as Guest
        </button>

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
