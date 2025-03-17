import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthStyles.css";

function Signup({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sending JSON data
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }), // Convert formData to JSON string to send in the body
      });

      const data = await response.json(); // Parse the JSON response body
      console.log(response.ok);
      if (response.ok) {
        // Check if status is 2xx
        console.log("User signed up:", formData);
        localStorage.setItem("access_token", data.access_token);
        setIsAuthenticated(true);
        navigate("/classification"); // Redirect after signup
      } else {
        setMessage(data.error || "Signup failed");
      }
    } catch (error) {
      setMessage("Signup failed");
    }
  };

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

        <p>{message}</p>

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
