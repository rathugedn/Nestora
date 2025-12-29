import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    fetch("/properties.json")
      .then((response) => response.json())
      .then((data) => {
        const foundProperty = data.properties.find((prop) => prop.id === id);
        setProperty(foundProperty);
      })
      .catch((error) =>
        console.error("Error fetching property details:", error)
      );
  }, [id]);

  if (!property) {
    return <div className="loading">Loading property details...</div>;
  }

  return (
    <div className="property-details-container">
      <div className="property-details">
        <button className="back-button" onClick={() => navigate("/search")}>
          &larr; Back to Search
        </button>

        <header className="property-header">
  <div className="property-header-left">
    <h1>{property.type} in {property.location.split(',').pop()}</h1>
    <h2 className="price-tag">£{property.price.toLocaleString()}</h2>
  </div>
  
  {/* This is the badge that will stay in the corner */}
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
    <span>£{property.price.toLocaleString()}</span>
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
    <strong>Postcode Area:</strong> 
    {/* Extracts the last part of the location string, e.g., BR6 */}
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