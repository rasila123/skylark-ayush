import React from 'react';
import './Services.css';

const services = [
  'Music Production', 'Recording', 'Mixing', 'Mastering',
  'YouTube Services', 'Distribution', 'Website Development',
  'Video Recording', 'Editing', 'Video Production'
];

const Services = () => {
  return (
    <div className="services-page">
      <h2>Our Services</h2>
      <ul>
        {services.map((service, index) => <li key={index}>{service}</li>)}
      </ul>
    </div>
  );
};

export default Services;
