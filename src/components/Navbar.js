import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <img src={logo} alt="Skylark Logo" className="logo" />
      <button
        className="hamburger"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle navigation"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/music" onClick={() => setMenuOpen(false)}>Music</Link></li>
        <li><Link to="/associates" onClick={() => setMenuOpen(false)}>Associates</Link></li>
        <li><Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;