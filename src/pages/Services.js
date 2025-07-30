import React from 'react';
import './Services.css';

const services = [
  'Music Production - Recording, Mixing, Mastering, songwriting, Studio setup, plugins and VSTs',
  'YouTube Services, Content Distribution and promotion, reels and shorts, live telecasts',
  'Video Recording, Editing, Production',
  'Podcast Production - Recording, Editing, Publishing',
  'Live Event Coverage - Recording, Streaming, Editing',
  'Social Media Management - Content Creation, Posting, Engagement',
  'Branding and Marketing - Strategy, Design, Implementation',
  'Consultation Services - Music, Video, Social Media, Branding',
  'Training and Workshops - Music Production, Video Editing, Social Media Marketing',
  'Distribution - music and video distribution to platforms like Spotify, Apple Music, YouTube, instagram etc.',
  'Equipment Rental - Cameras, Microphones, Lighting, music instruments etc.',
  'live streaming setup and management - for events, concerts, webinars etc.',
  'live event management - planning, execution, coordination',
  'live performances - organizing and managing live music events, concerts, gigs',
  'Music Composition - Original music creation for various media',
  'Sound Design - Custom sound effects and audio for video games, films, and other media',
];

const Services = () => {
  return (
    <div className="services-page">
      <h2 class="section-heading">Our Services</h2>
      <ul>
        {services.map((service, index) => <li key={index}>{service}</li>)}
      </ul>
    </div>
  );
};

export default Services;
