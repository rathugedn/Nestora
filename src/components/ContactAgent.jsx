import React, { useState, useRef, useEffect } from 'react';
import './ContactAgent.css';
import oliviaImg from '../Agents/olivia.jpg';
import ethanImg from '../Agents/ethan.jpg';

const AGENTS = [
    {
        id: 'olivia',
        name: 'Olivia Parker',
        title: 'Senior Property Consultant',
        phone: '+94 77678490',
        email: 'olivia@nestora.com',
        img: oliviaImg,
        
    },
    {
        id: 'ethan',
        name: 'Ethan Brooks',
        title: 'Luxury Home Specialist',
        phone: '+94 77678491',
        email: 'ethan@nestora.com',
        img: ethanImg,
    },
];

const ContactAgent = () => {
    const [modalAgent, setModalAgent] = useState(null);
    const formRef = useRef(null);
    const nameRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        preferredAgent: '',
    });
    const [lightboxSrc, setLightboxSrc] = useState(null);

    useEffect(() => {
        // when preferredAgent is set, focus name input for convenience
        if (formData.preferredAgent && nameRef.current) {
            nameRef.current.focus();
        }
    }, [formData.preferredAgent]);

    const openModal = (agent) => {
        setModalAgent(agent);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setModalAgent(null);
        document.body.style.overflow = '';
    };

    const handleCardKey = (e, agent) => {
        if (e.key === 'Enter' || e.key === ' ') openModal(agent);
    };

    const handleContactClick = (agent) => {
        setFormData((s) => ({ ...s, preferredAgent: agent.name, message: `Hi ${agent.name}, I'm interested in your services.` }));
        // scroll to form
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const openLightbox = (src) => {
        setLightboxSrc(src);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxSrc(null);
        document.body.style.overflow = '';
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((s) => ({ ...s, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // placeholder submit - adapt to your API
        console.log('Contact form submitted', formData);
        alert('Message sent — we will contact you shortly.');
        setFormData({ name: '', email: '', phone: '', message: '', preferredAgent: '' });
    };

    return (
        <div className="contact-container">
            <h1>Get in Touch with our Agents</h1>
            <p className="contact-subtitle">Our experienced real estate professionals are here to help you find your perfect property.</p>

            <div className="contact-cards">
                {AGENTS.map((agent) => (
                    <div
                        key={agent.id}
                        className="agent-card"
                        role="button"
                        tabIndex={0}
                        onClick={() => openModal(agent)}
                        onKeyDown={(e) => handleCardKey(e, agent)}
                        aria-label={`Open ${agent.name} details`}
                    >
                        <div className="agent-banner">
                            <div className="agent-image">
                                <img src={agent.img} alt={`Agent ${agent.name}`} />
                            </div>
                            {agent.top && <div className="agent-badge">Top Agent</div>}
                        </div>
                        <div className="agent-info">
                            <h3>{agent.name}</h3>
                            <p className="agent-title">{agent.title}</p>
                            <p className="agent-contact"> <span>📞</span> {agent.phone} </p>
                            <p className="agent-contact"> <span>✉️</span> {agent.email} </p>
                            <button
                                type="button"
                                className="contact-btn"
                                onClick={(e) => { e.stopPropagation(); handleContactClick(agent); }}
                            >
                                Contact {agent.name.split(' ')[0]}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {modalAgent && (
                <div className="agent-modal" role="dialog" aria-modal="true">
                    <div className="agent-modal-backdrop" onClick={closeModal} />
                    <div className="agent-modal-panel">
                        <button className="modal-close" onClick={closeModal} aria-label="Close">×</button>
                        <div className="modal-grid">
                            <div className="modal-image">
                                <img src={modalAgent.img} alt={modalAgent.name} onClick={() => openLightbox(modalAgent.img)} />
                            </div>
                            <div className="modal-info">
                                <h2>{modalAgent.name}</h2>
                                <p className="agent-title">{modalAgent.title}</p>
                                <p><strong>Phone:</strong> {modalAgent.phone}</p>
                                <p><strong>Email:</strong> {modalAgent.email}</p>
                                <p className="modal-bio">Experienced agent with a strong track record of helping clients find premium properties.</p>
                                <button
                                    type="button"
                                    className="contact-btn"
                                    onClick={() => { closeModal(); handleContactClick(modalAgent); }}
                                >Contact {modalAgent.name.split(' ')[0]}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="contact-form-section" ref={formRef}>
                <h2>Send us a Message</h2>
                <p className="form-subtitle">Fill out the form below and one of our agents will get back to you shortly.</p>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input ref={nameRef} id="name" value={formData.name} onChange={handleChange} type="text" placeholder="Enter your name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" value={formData.email} onChange={handleChange} type="email" placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input id="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="Enter your phone number" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea id="message" value={formData.message} onChange={handleChange} rows={5} placeholder="How can we help you?" />
                    </div>
                    <div className="form-group">
                        <label>Preferred Agent</label>
                        <input type="text" value={formData.preferredAgent} readOnly />
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </div>
            {lightboxSrc && (
                <div className="lightbox" role="dialog" onClick={closeLightbox}>
                    <img src={lightboxSrc} alt="Full size" />
                </div>
            )}
        </div>
    );
};

export default ContactAgent;