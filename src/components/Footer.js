import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p>Developed with ❤️ by <a style={{textDecoration: 'none', color: 'inherit' }} href ="/admin">Ayush Raj Sharma</a></p>
      <p>Email: rasilarecording@gmail.com</p>
      <p>Phone: +91-9826579100</p> 
      <p>© 2025 Skylark Infotainment</p>
      <div className="footer-links">
        <a href="/">Home</a> | <a href="/music">Music</a> | <a href="/associates">Artists</a> | <a href="/services">Services</a> | <a href="/contact">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
