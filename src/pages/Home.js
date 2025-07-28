import React, { useEffect, useState } from 'react';
import './Home.css';
import introVideo from '../assets/intro.mp4';
import logo from '../assets/logo.png';
import Associates from './Associates';

const Home = () => {
  const [showContent, setShowContent] = useState(false);
  const [fadeOutVideo, setFadeOutVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOutVideo(true);
      setTimeout(() => {
        setShowContent(true);
        // Do NOT hide the video element
      }, 1000); // 1s fade duration
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Animated crazy cursor effect
  useEffect(() => {
    // Always ensure the global crazy-cursor exists
    let cursor = document.getElementById('crazy-cursor-global');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'crazy-cursor';
      cursor.id = 'crazy-cursor-global';
      const burstLines = 28;
      const dotsPerLine = 7;
      const maxDistance = 48;
      const minDistance = 12;
      const colors = [
        '#ff0055', '#00cfff', '#ffe600', '#00ff2a', '#ff00cc', '#ffb300', '#00ffea', '#a100ff',
        '#ff0055', '#00cfff', '#ffe600', '#00ff2a', '#ff00cc', '#ffb300', '#00ffea', '#a100ff',
      ];
      for (let i = 0; i < burstLines; i++) {
        const angle = (360 / burstLines) * i;
        for (let j = 1; j <= dotsPerLine; j++) {
          const dot = document.createElement('div');
          dot.className = 'crazy-cursor-dot';
          dot.style.setProperty('--angle', `${angle}deg`);
          const dist = minDistance + ((maxDistance - minDistance) * (j - 1)) / (dotsPerLine - 1);
          dot.style.setProperty('--distance', `${dist}px`);
          dot.style.setProperty('--dot-color', colors[(i + j) % colors.length]);
          dot.style.setProperty('--dot-delay', `${(j * 0.07 + i * 0.01)}s`);
          cursor.appendChild(dot);
        }
      }
      document.body.appendChild(cursor);
    }
    // Always update the cursor position on mousemove
    const setInitial = () => {
      const x = window.innerWidth / 2 - 12;
      const y = window.innerHeight / 2 - 12;
      cursor.style.transform = `translate(${x}px, ${y}px)`;
    };
    setInitial();
    const move = (e) => {
      cursor.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('resize', setInitial);
    // Clean up only the event listeners, not the global cursor
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('resize', setInitial);
    };
  }, []);

  return (
    <div className="home-container">
      <video
        autoPlay
        muted
        className={`intro-video${fadeOutVideo ? ' fade-out' : ''}`}
      >
        <source src={introVideo} type="video/mp4" />
      </video>

      {showContent && (
        <div className={`intro-content${showContent ? ' fade-in' : ''}`}>
          <img src={logo} alt="Skylark Logo Large" className="big-logo" />
          <h1>Skylark Infotainment</h1>
          <p>Music Beyond Limits</p>
          <a href="/contact"><button>Contact Us</button></a>
        </div>
      )}
      {showContent && (
        <div className="countercont">
          <div className="row counters d-flex flex-row">
            <div className="common-box col-md-2 col-sm-4">
              <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuvH0WVv7w6V-d_iDSXBQCmz9CGM0XWPotHQ&s" alt="Experience" /></i>
              <span className="count-data">20</span><sup>+</sup><span className="count-data"> Yr</span>
              <div className="counter-text">Years of Experience</div>
            </div>
            <div className="common-box col-md-2 col-sm-4">
              <i><img src="https://cdn-icons-png.flaticon.com/512/9104/9104636.png" alt="Artists" /></i>
              <span className="count-data">1K</span><sup>+</sup>
              <div className="counter-text">Satisfied Artists</div>
            </div>
            <div className="common-box col-md-2 col-sm-4">
              <i><img src="https://cdn-icons-png.flaticon.com/512/4472/4472584.png" alt="Audios" /></i>
              <span className="count-data">30K</span><sup>+</sup>
              <div className="counter-text">Audios</div>
            </div>
            <div className="common-box col-md-2 col-sm-4">
              <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISmhLTbb8GC8NgGhQMpz3J-0OBbBqwdgUsA&s" alt="Videos" /></i>
              <span className="count-data">15K</span><sup>+</sup>
              <div className="counter-text">Videos</div>
            </div>
            <div className="common-box col-md-2 col-sm-4">
              <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9v03DGCRcA3m53cTgCgk3I-DHv2WzRz-8uA&s" alt="Subscribers" /></i>
              <span className="count-data">2M</span><sup>+</sup>
              <div className="counter-text">Subscribers</div>
            </div>
            <div className="common-box col-md-2 col-sm-4">
              <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEbHSnYazsz4iNmEq6tD_aBVdzq-fgNPmObw&s" alt="Views" /></i>
              <span className="count-data">7B</span><sup>+</sup>
              <div className="counter-text">Views</div>
            </div>
          </div>
        </div>
      )}

      <div className="main-sections-bg">
        <h2>Our Labels</h2>
        <section className="cards-section">
          <div
            className="card animated-card"
            onClick={() => window.open('https://youtube.com/skylarkinfotainment', '_blank')}
          >
            <img src={require('../assets/infotainment.jpg')} alt="Skylark Infotainment" className="card-img" />
            {/* <span>SKYLARK INFOTAINMENT</span> */}
          </div>
          <div
            className="card animated-card"
            onClick={() => window.open('https://youtube.com/@skylarkbhojpuri', '_blank')}
          >
            <img src={require('../assets/bhojpuri.jpg')} alt="Skylark Bhojpuri" className="card-img" />
            {/* <span>SKYLARK BHOJPURI</span> */}
          </div>
        </section>

        <section className="presence-section">
          <h2>Our Presence</h2>
          <div className="platforms">
            {(() => {
              const logoMap = {
                'iTunes': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIiKOracQ8AnYdnjgy-CQe3Qkot0e0CU5XwQ&s',
                'Shazam': 'https://img.icons8.com/color/96/shazam.png',
                'Apple Music': 'https://logos-world.net/wp-content/uploads/2020/11/Apple-Music-Logo.png',
                'Spotify': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdhm0QX77yGJFrD_lk6iASPtpxc_is48Sc_g&s',
                'Amazon Music': 'https://wallpapers.com/images/hd/amazon-music-logo-owwdlwkbkbplmz91-2.jpg',
                'Audible': 'https://cdn.worldvectorlogo.com/logos/audible.svg',
                'Snapchat': 'https://i.pinimg.com/736x/65/25/ea/6525ea3430a2145e472ce030dd98bdcb.jpg',
                'Canva': 'https://img.icons8.com/color/96/canva.png',
                'Pandora': 'https://img.icons8.com/color/96/pandora-app.png',
                'YouTube': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI2E5Huc3ioxoXvRVn1phb8yWyk9jOjOWI8Q&s',
                'YouTube Shorts': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMXlieX-1UjEMJUoe21hpPXUx6jOrKsYfJiA&s',
                'gaana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gaana_%28music_streaming_service%29_logo.png/1200px-Gaana_%28music_streaming_service%29_logo.png',
                'SoundCloud': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx1Qi6WJbO3ub1j4_pWBeajrs1A4wYL1sEmA&s',
                'Saavn': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/JioSaavn_Logo.svg/1024px-JioSaavn_Logo.svg.png',
                'Anghami Music': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOW63bhTaI5XulvseNt7vUInE5fEyCHzasuw&s',
                'Facebook': 'https://img.icons8.com/color/96/facebook-new.png',
                'Instagram': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/2048px-Instagram_icon.png',
                'WhatsApp': 'https://img.icons8.com/color/96/whatsapp--v1.png',
                'YouTube Music': 'https://upload.wikimedia.org/wikipedia/commons/1/1c/YouTube_Music_2024.svg',
                'WeSing': 'https://play-lh.googleusercontent.com/R8ROhhJoi-A34JeO_nVb8-FSznLvCLnMvrN-gCWH_9HilcXyhC1KKF__yCsY6hjfThox=s96-rw',
                'TikTok': 'https://img.icons8.com/color/96/tiktok--v1.png',
                'Hungama Music': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStY-aRGGKFmYDq69A8kitKLeH1b7Ga6fBA6Q&s',
                'Resso': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpx4wBqh5oFPnIHc7gYBZMmuostvCCO1TWsw&s',
                'Wynk Music': 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Wynk_music_logo.png',
                'Audible Magic': 'https://www.audiblemagic.com/wp-content/uploads/2019/08/AM-Logo.png',
                'Rdio': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAsKIPKN1PnFJOJn4ItiP9LZrFkc1qjt7DOw&s',
                'CapCut': 'https://logos-world.net/wp-content/uploads/2024/01/CapCut-Logo.png'
              };
              return [
                'iTunes',
                'Rdio',
                'Shazam',
                'Apple Music',
                'Spotify',
                'Amazon Music',
                'Audible',
                'Snapchat',
                'Canva',
                'Pandora',
                'YouTube',
                'YouTube Shorts',
                'gaana',
                'SoundCloud',
                'Saavn',
                'Hungama Music',
                'Resso',
                'Wynk Music',
                'Anghami Music',
                'Audible Magic',
                'Facebook',
                'Instagram',
                'WhatsApp',
                'YouTube Music',
                'WeSing',
                'CapCut',
                'TikTok'
              ].map((name) => (
                <div className="platform" key={name}>
                  <img src={logoMap[name] || 'https://img.icons8.com/color/48/musical-notes.png'} alt={name} className="platform-logo" />
                </div>
              ));
            })()}
          </div>
        </section>

        <section className="associates-section">
          <Associates/>
        </section>
      </div>
    </div>
  );
};

export default Home;
