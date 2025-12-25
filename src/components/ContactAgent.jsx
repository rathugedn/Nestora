import React from 'react';
import { Link } from 'react-router-dom';
import './ContactAgent.css';

const ContactAgent = () => {
    return (
        <div className="contact-container">
            <h1>Get in Touch with our Agents</h1>
            <p className="contact-subtitle">Our Experienced real estate professional are here to help you find your perfect property </p>

            <div className="contact-cards">
                <div className="agent-card">
                    <div className="agent-image">
                        <img src="C:\Users\USER\Desktop\nestora\src\components\Agents\olivia.jpg" alt="Agent Olivia Parker" />  
                    </div>
                    <div className="agent-info">
                        <h3>Olivia Parker</h3>
                        <p className="agent-title">Senior Property Consultant</p>
                        <p className="agent-contact"> <span>📞 </span> +94 77678490 </p>
                        <p className="agent-contact">
                            <span>✉️</span>olivia@nestora.com
                        </p>
                        <Link to="/contact-form" className="contact-btn">
                        Contact Olivia </Link>
                    </div>
                </div>

                <div className="agent-card">
                    <div className="agent-image">
                        <img src="C:\Users\USER\Desktop\nestora\src\components\Agents\ethan.jpg" alt="Ethan Brooks" />
                        </div>
                        <div className="agent-info">
                            <h3>Ethan Brooks</h3>
                                <p className="agent-title">Luxury Home Specialist</p>
                                <p className="agent-contact"> <span>📞</span> +94 77678491 </p>
                                <p className="agent-contact"><span>✉️</span> ethan@nestora.com </p>
                            <Link to="/contact-form" className="contact-btn">
                            Contact Ethan </Link>
                        </div>
                    </div>
                </div>

                <div className="contact-form-section">
                    <h2> Send us a Message</h2>
                    <p className = "form-subtitle">
                        Fill out the form below and one of our agents will get back to you shortly
                    </p>

                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Your Name </label>
                            <input type="text" id="name" placeholder="Enter your email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" placeholder="Enter your email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" placeholder="Enter your phone number" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" rows="5" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="submit-btn">
                        Send Message
                        </button>
                    </form>   
                </div>
       </div>
    );
};

export default ContactAgent;