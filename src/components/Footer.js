import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Skylark Infotainment</p>
      <p>Developed with ❤️ by <a style={{textDecoration: 'none', color: 'inherit' }} href ="/admin">Ayush Raj Sharma</a></p>
      <p>Address: B-123, Music Nagar, Delhi</p>
      <div className="footer-links">
        <a href="/">Home</a> | <a href="/music">Music</a> | <a href="/associates">Associates</a> | <a href="/services">Services</a> | <a href="/contact">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
