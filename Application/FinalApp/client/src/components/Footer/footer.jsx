import React from "react";
import "./footer.css";

function Footer() {
  return (
    <footer className="footer" id="footer">
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
          <p><i className="fa fa-envelope"></i> <a href="mailto:support@diatrack.com">support@diatrack.com</a></p>
        </div>

        {/* Social Media Links */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://web.facebook.com/?_rdc=1&_rdr#" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://x.com/i/flow/login?lang=en" aria-label="x">
              <i className="fab fa-x-twitter"></i>
            </a>
            <a href="https://lk.linkedin.com/" aria-label="LinkedIn">
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
