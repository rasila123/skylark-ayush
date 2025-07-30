import React from 'react';
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faFacebook, faInstagram, faYoutube, faSpotify } from '@fortawesome/free-brands-svg-icons';


const Contact = () => {
  return (
    <div className="contact-page">
      <h2 class="section-heading">Contact Us</h2>
      <p>
        <strong>Phone:</strong>
        <a href="tel:+919826579100" class="contact-link"> +91 - 9826579100</a>
      </p>
      

      <p>
        <strong>Email:</strong>
        <a href="mailto:rasilarecording@gmail.com" class="contact-link"> rasilarecording@gmail.com
        </a>
      </p>

      <p>
        <strong>Address:</strong>
        <a
          href="https://www.google.com/maps/search/?api=1&query=A-5+Sarovar+Plaza,+Phalka+Bazaar,+Lashkar,+Gwalior+474001"
          target="_blank"
          rel="noopener noreferrer"
          class="contact-link"
        > A-5 Sarovar Plaza, Phalka Bazaar, Lashkar, Gwalior 474001
        </a>
      </p>

      <div className="social">
        <p style={{textAlign: 'center', fontWeight: 'bold'}}>Click to connect with us on:</p>
        <div className="social-icons">
          <a
            href="https://wa.me/9826579100"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-link"
            title="WhatsApp"
            style={{color: '#25D366'}}
          >
            <FontAwesomeIcon icon={faWhatsapp}/>
          </a>
          <a
            href="tel:+919826579100"
            className="contact-link"
            title="Call Us"
            style={{color: '#34B7F1'}}
          >
            <FontAwesomeIcon icon={faPhone} />
          </a>
          <a
            href="https://www.facebook.com/skylark"
            target="_blank"
            rel="noreferrer"
            title="Facebook"
            style={{color: '#1877F3'}}
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://www.instagram.com/skylark"
            target="_blank"
            rel="noreferrer"
            title="Instagram"
            style={{color: '#E4405F'}}
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://www.youtube.com/skylark"
            target="_blank"
            rel="noreferrer"
            title="YouTube"
            style={{color: '#FF0000'}}
          >
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a
            href="https://open.spotify.com/user/skylark"
            target="_blank"
            rel="noreferrer"
            title="Spotify"
            style={{color: '#1DB954'}}
          >
            <FontAwesomeIcon icon={faSpotify} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
