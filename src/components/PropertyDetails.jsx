import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Loading property with ID:', id); // Debug log
    
    fetch("/properties.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        return response.json();
      })
      .then((data) => {
        console.log('All properties:', data.properties); // Debug log
        
        // FIX: Convert both to string for proper comparison
        const foundProperty = data.properties.find(
          (prop) => prop.id.toString() === id.toString()
        );
        
        console.log('Found property:', foundProperty); // Debug log
        
        if (foundProperty) {
          setProperty(foundProperty);
        } else {
          setError(`Property with ID ${id} not found`);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching property details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading property details...</p>
        <p style={{ fontSize: '0.875rem', color: '#666' }}>Property ID: {id}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Property</h2>
        <p>{error}</p>
        <button className="back-button" onClick={() => navigate("/")}>
          &larr; Back to Search
        </button>
      </div>
    );
  }

  // Property not found
  if (!property) {
    return (
      <div className="error-container">
        <h2>Property Not Found</h2>
        <p>The property you're looking for doesn't exist or has been removed.</p>
        <button className="back-button" onClick={() => navigate("/")}>
          &larr; Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="property-details-container">
      <div className="property-details">
        <button className="back-button" onClick={() => navigate("/")}>
          &larr; Back to Search
        </button>

        <header className="property-header">
          <div className="property-header-left">
            <h1>{property.type} in {property.location.split(',').pop()}</h1>
            <h2 className="price-tag">$. {property.price.toLocaleString()} </h2>
          </div>
          
          <span className="type-badge">
            {property.type}
          </span>
        </header>

        <div className="property-gallery">
          <img src={property.img1} alt="Gallery 1" />
          <img src={property.img2} alt="Gallery 2" />
          <img src={property.img3} alt="Gallery 3" />
          <img src={property.img4} alt="Gallery 4" />
          <img src={property.img5} alt="Gallery 5" />
          <img src={property.img6} alt="Gallery 6" />
          <img src={property.img7} alt="Gallery 7" />
        </div>

        <div className="property-info">
          <div className="info-item">
            <strong>Price:</strong> 
            <span>$. {property.price.toLocaleString()} </span>
          </div>
          
          <div className="info-item">
            <strong>Bedrooms:</strong> 
            <span>{property.bedrooms}</span>
          </div>
          
          <div className="info-item">
            <strong>Tenure:</strong> 
            <span>{property.tenure}</span>
          </div>
          
          <div className="info-item">
            <strong>Location Area:</strong>
            <span>{property.location.split(' ').pop()}</span> 
          </div>

          <div className="info-item full-width">
            <strong>Full Address:</strong> 
            <span>{property.location}</span>
          </div>

          <div className="info-item">
            <strong>Date Added:</strong> 
            <span>{property.added.day} {property.added.month} {property.added.year}</span>
          </div>
        </div>

        {/* Tab System */}
        <div className="tabs-container">
          <div className="tab-buttons">
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={activeTab === "floorPlan" ? "active" : ""}
              onClick={() => setActiveTab("floorPlan")}
            >
              Floor Plan
            </button>
            <button
              className={activeTab === "map" ? "active" : ""}
              onClick={() => setActiveTab("map")}
            >
              Google Map
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description-text">
                <h3>Property Overview</h3>
                <p>{property.description}</p>
              </div>
            )}
            {activeTab === "floorPlan" && (
              <div className="floor-plan-view">
                <img src={property.floorMap} alt="Property Floor Plan" />
              </div>
            )}
            {activeTab === "map" && (
              <div className="map-view">
                <iframe
                  src={property.map}
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Location Map"
                ></iframe>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;