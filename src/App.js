//import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Music from './pages/Music';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Associates from './pages/Associates';
import ArtistPage from './pages/ArtistPage';
import Admin from './pages/Admin';

function App() {
  // Global crazy cursor effect
  // useEffect(() => {
  //   let cursor = document.getElementById('crazy-cursor-global');
  //   if (!cursor) {
  //     cursor = document.createElement('div');
  //     cursor.className = 'crazy-cursor';
  //     cursor.id = 'crazy-cursor-global';
  //     const burstLines = 28;
  //     const dotsPerLine = 7;
  //     const maxDistance = 48;
  //     const minDistance = 12;
  //     const colors = [
  //       '#ff0055', '#00cfff', '#ffe600', '#00ff2a', '#ff00cc', '#ffb300', '#00ffea', '#a100ff',
  //       '#ff0055', '#00cfff', '#ffe600', '#00ff2a', '#ff00cc', '#ffb300', '#00ffea', '#a100ff',
  //     ];
  //     for (let i = 0; i < burstLines; i++) {
  //       const angle = (360 / burstLines) * i;
  //       for (let j = 1; j <= dotsPerLine; j++) {
  //         const dot = document.createElement('div');
  //         dot.className = 'crazy-cursor-dot';
  //         dot.style.setProperty('--angle', `${angle}deg`);
  //         const dist = minDistance + ((maxDistance - minDistance) * (j - 1)) / (dotsPerLine - 1);
  //         dot.style.setProperty('--distance', `${dist}px`);
  //         dot.style.setProperty('--dot-color', colors[(i + j) % colors.length]);
  //         dot.style.setProperty('--dot-delay', `${(j * 0.07 + i * 0.01)}s`);
  //         cursor.appendChild(dot);
  //       }
  //     }
  //     document.body.appendChild(cursor);
  //   }
  //   // Always update the cursor position on mousemove
  //   const setInitial = () => {
  //     const x = window.innerWidth / 2 - 12;
  //     const y = window.innerHeight / 2 - 12;
  //     cursor.style.transform = `translate(${x}px, ${y}px)`;
  //   };
  //   setInitial();
  //   const move = (e) => {
  //     cursor.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
  //   };
  //   window.addEventListener('mousemove', move);
  //   window.addEventListener('resize', setInitial);
  //   // Clean up only the event listeners, not the global cursor
  //   return () => {
  //     window.removeEventListener('mousemove', move);
  //     window.removeEventListener('resize', setInitial);
  //   };
  // }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/music" element={<Music />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/associates" element={<Associates />} />
        <Route path="/artist/:artistId" element={<ArtistPage />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
      <Analytics />
    </Router>
  );
}

export default App;
