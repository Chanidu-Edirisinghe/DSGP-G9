import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AuthStyles.css";
import "./AnimatedBackground.css";
import "./particleAnimation.js";

function Login({ setIsAuthenticated }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check for saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

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

        // Success message before redirect
        setMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/classification"); // Redirect after successful login
        }, 1000);
      } else {
        setMessage(
          data.message || "Login failed. Please check your credentials."
        ); // Set error message from the backend
      }
    } catch (error) {
      console.error("Login error:", error);
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
            <h2>Welcome Back</h2>
            <p className="login-desc">Login to your account</p>
          </div>

          <form onSubmit={handleLogin}>
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
                  autoComplete="current-password"
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
                  <span>Logging in...</span>
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {message && (
            <div
              className={`message ${
                message.includes("successful") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="auth-footer">
            <p>Don't have an account yet?</p>
            <Link to="/signup" className="btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
