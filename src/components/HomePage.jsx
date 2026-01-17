import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero-section split-layout">
        <div className="hero-left">
          <div className="hero-content">
            <h1>
              Elevate Your <span className="luxury-gradient">Living Experience</span>
            </h1>
            <p>
              Discover premium properties tailored to your lifestyle with our curated
              selection of modern homes.
            </p>

            <div className="hero-buttons">
              <Link to="/search" className="primary-btn">Browse Properties</Link>
              <Link to="/contact" className="secondary-btn">Contact Agent</Link>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="image-stack single">
            <div className="image-card large">
              <img src="/property.jpg" alt="Modern Home" />
              <div className="card-overlay">
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🏡</div>
            <h3>Wide Selection</h3>
            <p>Choose from hundreds of properties across the country.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>We negotiate the best deals for our clients.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍💼</div>
            <h3>Expert Agents</h3>
            <p>Our team has over 20 years of combined experience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;