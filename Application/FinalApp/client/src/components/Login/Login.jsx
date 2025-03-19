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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sending login data to the backend
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json(); // Parsing JSON response

      if (response.ok) {
        console.log("User logged in:", formData);
        localStorage.setItem("access_token", data.access_token); // Store JWT token
        setIsAuthenticated(true);
        navigate("/classification"); // Redirect after successful login
      } else {
        alert(data.message || "Login failed"); // Show error message in alert
      }
    } catch (error) {
      console.log(error);
      alert("Login failed"); // Show generic error message in alert
    }
  };

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
