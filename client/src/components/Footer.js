import React from 'react';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Owner Information</h3>
          <p><strong>Name:</strong> [Your Name]</p>
          <p><strong>Email:</strong> <a href="mailto:your.email@example.com">your.email@example.com</a></p>
          <p><strong>College:</strong> [Your College Name]</p>
        </div>
      </div>
      <div className="ownership">
        <p>This website and all its contents are owned by [Your Name]. All rights reserved. Unauthorized use or reproduction is prohibited.</p>
      </div>
    </footer>
  );
}

export default Footer;
