import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../components/Login/AuthStyles.css";
import "../../components/Login/AnimatedBackground.css";
import "../../components/Login/particleAnimation.js";

function Signup({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("User signed up:", formData);
        localStorage.setItem("access_token", data.access_token);
        setIsAuthenticated(true);

        // Success message before redirect
        setMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          navigate("/classification"); // Redirect after successful signup
        }, 1000);
      } else {
        setMessage(data.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Animated Background */}
      <div className="animated-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        <div className="gradient-sphere sphere-3"></div>
        <div className="grid-overlay"></div>
        <div className="glow"></div>
        <div className="noise-overlay"></div>
        <div id="particles-container" className="particles-container"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p className="login-desc">Join us today</p>
          </div>

          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <div className="input-container">
                {!formData.name && <i className="input-icon fas fa-user"></i>}
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-container">
                {!formData.email && (
                  <i className="input-icon fas fa-envelope"></i>
                )}
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                {!formData.password && (
                  <i className="input-icon fas fa-lock"></i>
                )}
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`btn-primary ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loader-container">
                  <span className="loader"></span>
                  <span>Creating account...</span>
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {message && (
            <div
              className={`message ${
                message.includes("successfully") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="auth-footer">
            <p>Already have an account?</p>
            <Link to="/login" className="btn-secondary">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
