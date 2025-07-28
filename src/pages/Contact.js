import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p><strong>Phone:</strong> +91-XXXXXXXXXX</p>
      <p><strong>Email:</strong> skylark@example.com</p>
      <p><strong>Address:</strong> B-123, Music Nagar, Delhi, India</p>
      <div className="socials">
        {['Facebook', 'Instagram', 'YouTube', 'Spotify'].map(platform => (
          <a href={`https://www.${platform.toLowerCase()}.com/skylark`} target="_blank" rel="noreferrer" key={platform}>{platform}</a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
