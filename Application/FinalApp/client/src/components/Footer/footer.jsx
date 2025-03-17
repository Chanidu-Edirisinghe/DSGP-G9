import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About & Contact */}
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            DiaTrack is a healthcare decision support system designed to assist 
            medical practitioners in managing diabetic patients efficiently.
          </p>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:support@diatrack.com">support@diatrack.com</a></p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Diatrack | All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
