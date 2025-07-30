import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      <h2 class="section-heading">Contact Us</h2>
      <p><strong>Phone:</strong> +91-9826579100</p>
      <p><strong>Email:</strong> rasilarecording@gmail.com </p>
      <p><strong>Address:</strong> A-5 Sarovar Plaza, Phalka Bazaar, Lashkar, Gwalior 474001</p>
      <div className="socials">
        {['Facebook', 'Instagram', 'YouTube', 'Spotify'].map(platform => (
          <a href={`https://www.${platform.toLowerCase()}.com/skylark`} target="_blank" rel="noreferrer" key={platform}>{platform}</a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
