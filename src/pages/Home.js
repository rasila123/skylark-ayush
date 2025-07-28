//import React, { useEffect, useState } from 'react';
import React from 'react';
import './Home.css';
//import introVideo from '../assets/intro.mp4';
import logo from '../assets/logo.png';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  // Intro video logic disabled; show all content by default
  const navigate = useNavigate();

  /*
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOutVideo(true);
      setTimeout(() => {
        setShowContent(true);
        // Show main content after 1.5s (or adjust as needed)
        setTimeout(() => setShowMainContent(true), 1200);
      }, 1000); // 1s fade duration
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  */

  // Dynamic carousel settings for both sections
  const getCarouselSettings = (itemCount) => {
    // Default slidesToShow for desktop
    let slidesToShow = 4;
    if (itemCount < 4) slidesToShow = itemCount || 1;
    return {
      dots: true,
      infinite: itemCount > slidesToShow, // Only infinite if enough items
      speed: 500,
      slidesToShow,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: Math.min(3, itemCount || 1),
            infinite: itemCount > 3,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: Math.min(2, itemCount || 1),
            infinite: itemCount > 2,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: Math.min(3, itemCount || 1), // Show at least 3 on mobile
            infinite: itemCount > 3,
          },
        },
      ],
      arrows: true,
    };
  };

  // Get artistList and songs from child components (Associates, Music)
  // We'll use hooks in Home.js to fetch the same data as those components
  const [artistList, setArtistList] = React.useState([]);
  const [songs, setSongs] = React.useState([]);
  React.useEffect(() => {
    // Fetch artists
    import('./Associates').then(({ default: AssociatesComp }) => {
      if (AssociatesComp && AssociatesComp.fetchArtists) {
        AssociatesComp.fetchArtists().then(setArtistList);
      } else {
        // fallback: fetch from supabase directly
        import('../supabaseClient').then(({ supabase }) => {
          supabase.from('artists').select('*').then(({ data }) => {
            if (data) setArtistList(data.map(a => ({ name: a.name, img: a.photo })));
          });
        });
      }
    });
    // Fetch songs
    import('../supabaseClient').then(({ supabase }) => {
      supabase.from('songs').select('*').then(({ data }) => {
        if (data) setSongs(data);
      });
    });
  }, []);

  return (
    <div className="home-container">
      {/* Intro video and transition logic disabled */}
      {/* Center logo and intro */}
      <div className="intro-stat">
        <img src={logo} alt="Skylark Logo Large" className="big-logo" />
        <h1 style={{margin: '10px 0 0 0'}}>Skylark Infotainment</h1>
        {/* <p style={{margin: '0 0 10px 0'}}>Music Beyond Limits</p> */}
        <button onClick={() => navigate('/contact')}>Contact Us</button>
      </div>
      {/* Only show intro content in the center of the counter row below */}
      <div className="countercont">
        <div className="counters-row">
          {/* Left counters */}
          <div className="common-box">
            <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuvH0WVv7w6V-d_iDSXBQCmz9CGM0XWPotHQ&s" alt="Experience" /></i>
            <span className="count-data">20 + Years</span>
            <div className="counter-text">Experience</div>
          </div>
          <div className="common-box">
            <i><img src="https://cdn-icons-png.flaticon.com/512/9104/9104636.png" alt="Artists" /></i>
            <span className="count-data">1K + </span>
            <div className="counter-text">Satisfied Artists</div>
          </div>
          <div className="common-box">
            <i><img src="https://cdn-icons-png.flaticon.com/512/4472/4472584.png" alt="Audios" /></i>
            <span className="count-data">30K + </span>
            <div className="counter-text">Audios</div>
          </div>
          {/* Right counters */}
          <div className="common-box">
            <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRISmhLTbb8GC8NgGhQMpz3J-0OBbBqwdgUsA&s" alt="Videos" /></i>
            <span className="count-data">15K + </span>
            <div className="counter-text">Videos</div>
          </div>
          <div className="common-box">
            <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9v03DGCRcA3m53cTgCgk3I-DHv2WzRz-8uA&s" alt="Subscribers" /></i>
            <span className="count-data">2M + </span>
            <div className="counter-text">Subscribers</div>
          </div>
          <div className="common-box">
            <i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEbHSnYazsz4iNmEq6tD_aBVdzq-fgNPmObw&s" alt="Views" /></i>
            <span className="count-data">7B + </span>
            <div className="counter-text">Views</div>
          </div>
        </div>
      </div>
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
          <h2>Our Artists</h2>
          <Slider {...getCarouselSettings(artistList.length)}>
            {artistList.map((artist, idx) => (
              <div key={artist.name + idx}>
                <div
                  className="artist-card associate-home"
                  style={{cursor:'pointer'}}
                  onClick={() => navigate(`/artist/${encodeURIComponent(artist.name)}`)}
                >
                  <img src={artist.img || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt={artist.name} style={{objectFit:'cover',display:'block',margin:'0 auto'}} />
                  <p>{artist.name}</p>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        <section className="music-section">
          <h2>Our Music</h2>
          <Slider {...getCarouselSettings(songs.length)}>
            {songs.map((song) => (
              <div key={song.id}>
                <div
                  className={'song-card'}
                  onClick={() => window.open(song.url, '_blank')}
                >
                  <img src={song.thumbnail} alt={song.title} />
                  <div style={{marginTop:'8px'}}>
                    <p style={{fontWeight:'bold',margin:'0'}}>{song.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
      </div>
    </div>
  );
};

export default Home;
