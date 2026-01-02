import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash } from "lucide-react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Divider,
} from "@mui/material";
import './SearchPage.css';

const SearchPage = () => {
  const [filters, setFilters] = useState({
    propertyType: "Any",
    minPrice: "",
    maxPrice: "",
    minBedrooms: "",
    maxBedrooms: "",
    addedMonth: "",
    addedYear: "",
    postcode: "",
  });

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favourites, setFavourites] = useState(() => {
    const savedFavourites = localStorage.getItem("favourites");
    return savedFavourites ? JSON.parse(savedFavourites) : [];
  });

  useEffect(() => {
    fetch("/properties.json")
      .then((response) => response.json())
      .then((data) => {
        setProperties(data.properties);
        setFilteredProperties(data.properties);
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const validateFilters = () => {
    if (
      filters.minPrice < 0 ||
      filters.maxPrice < 0 ||
      filters.minBedrooms < 0 ||
      filters.maxBedrooms < 0 ||
      filters.addedYear < 0
    ) {
      alert("Values cannot be negative.");
      return false;
      
    }
    if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
      alert("Min Price cannot be greater than Max Price.");
      return false;
    }
    if (filters.minBedrooms && filters.maxBedrooms && filters.minBedrooms > filters.maxBedrooms) {
      alert("Min Bedrooms cannot be greater than Max Bedrooms.");
      return false;
    }
    return true;
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!validateFilters()) return;

    const filtered = properties.filter((property) => {
      const matchesType =
        filters.propertyType === "Any" ||
        property.type.toLowerCase() === filters.propertyType.toLowerCase();
      const matchesMinPrice =
        !filters.minPrice || property.price >= parseInt(filters.minPrice, 10);
      const matchesMaxPrice =
        !filters.maxPrice || property.price <= parseInt(filters.maxPrice, 10);
      const matchesMinBedrooms =
        !filters.minBedrooms || property.bedrooms >= parseInt(filters.minBedrooms, 10);
      const matchesMaxBedrooms =
        !filters.maxBedrooms || property.bedrooms <= parseInt(filters.maxBedrooms, 10);
      const matchesAddedMonth =
        !filters.addedMonth || property.added.month.toLowerCase() === filters.addedMonth.toLowerCase();
      const matchesAddedYear =
        !filters.addedYear || property.added.year.toString() === filters.addedYear;
      const matchesPostcode =
        !filters.postcode ||
        property.location.toLowerCase().includes(filters.postcode.toLowerCase());

      return (
        matchesType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesMinBedrooms &&
        matchesMaxBedrooms &&
        matchesAddedMonth &&
        matchesAddedYear &&
        matchesPostcode
      );
    });

    setFilteredProperties(filtered);
  };

  const toggleFavourite = (property) => {
    const isFavourite = favourites.some((fav) => fav.id === property.id);
    
    if (isFavourite) {
      setFavourites(favourites.filter((fav) => fav.id !== property.id));
    } else {
      setFavourites([...favourites, property]);
    }
  };

  const addToFavourites = (property) => {
    if (!favourites.some((fav) => fav.id === property.id)) {
      setFavourites([...favourites, property]);
    }
  };

  const removeFavourite = (propertyId) => {
    setFavourites(favourites.filter((fav) => fav.id !== propertyId));
  };

  const clearFavourites = () => {
    setFavourites([]);
  };

  const handleDragStart = (e, property) => {
    e.dataTransfer.setData("property", JSON.stringify(property));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const property = JSON.parse(e.dataTransfer.getData("property"));
    addToFavourites(property);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const isFavourite = (propertyId) => {
    return favourites.some((fav) => fav.id === propertyId);
  };

  return (
    <Box className="search-page-container">
      <Typography variant="h4" align="center" gutterBottom className="page-title">
        Search Your Dream Home
      </Typography>
      
      <Box component="form" className="search-form" onSubmit={handleSearch}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Property Type"
              name="propertyType"
              value={filters.propertyType}
              onChange={handleInputChange}
              select
              fullWidth
            >
              <MenuItem value="Any">Any</MenuItem>
              <MenuItem value="House">House</MenuItem>
              <MenuItem value="Flat">Flat</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Min Price (£.)"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Max Price (£.)"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Min Bedrooms"
              name="minBedrooms"
              type="number"
              value={filters.minBedrooms}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Max Bedrooms"
              name="maxBedrooms"
              type="number"
              value={filters.maxBedrooms}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Added Month (Ex: February)"
              name="addedMonth"
              value={filters.addedMonth}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Added Year (Ex: 2020)"
              name="addedYear"
              type="number"
              value={filters.addedYear}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Post Code Area (Ex: BR6, NW1)"
              name="postcode"
              value={filters.postcode}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button type="submit" variant="contained" fullWidth className="search-button">
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider className="section-divider" />

      <Box className="favourites-section" onDrop={handleDrop} onDragOver={handleDragOver}>
        <Typography variant="h5" gutterBottom className="section-title">
          Favourites ({favourites.length})
        </Typography>
        <Button
          variant="contained"
          onClick={clearFavourites}
          disabled={favourites.length === 0}
          className="clear-favourites-button"
        >
          Clear Favourites
        </Button>
        {favourites.length === 0 ? (
          <Typography className="empty-favourites-message">
            No favourites yet. Click the heart icon or drag properties here to add them!
          </Typography>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {favourites.map((property) => (
              <Grid item xs={12} sm={6} md={4} key={property.id} className="grid-item-center">
                <Card className="property-card">
                  <div className="card-media-wrapper">
                    <CardMedia
                      component="img"
                      image={property.picture}
                      alt={property.short}
                    />
                  </div>
                  <CardContent>
                    <Typography variant="h6" className="property-price">
                      £. {property.price.toLocaleString()} 
                    </Typography>
                    <Typography>{property.short}</Typography>
                    <Box className="property-actions">
                      <IconButton
                        onClick={() => removeFavourite(property.id)}
                        color="error"
                        title="Remove from favourites"
                      >
                        <Trash />
                      </IconButton>
                      <Button
                        component={Link}
                        to={`/property/${property.id}`}
                        variant="outlined"
                        className="view-details-button"
                      >
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Divider className="section-divider" />

      <Typography variant="h5" gutterBottom className="section-title results-title">
        Search Results ({filteredProperties.length})
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {filteredProperties.map((property) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={property.id} 
            className="grid-item-center" 
            draggable 
            onDragStart={(e) => handleDragStart(e, property)}
          >
            <Card className="property-card">
              <div className="card-media-wrapper">
                <CardMedia
                  component="img"
                  image={property.picture}
                  alt={property.short}
                />
              </div>
              <CardContent>
                <Typography variant="h6" className="property-price">
                  £. {property.price.toLocaleString()} 
                </Typography>
                <Typography>{property.short}</Typography>
                <Box className="property-actions">
                  <IconButton
                    onClick={() => toggleFavourite(property)}
                    className={`favourite-button ${isFavourite(property.id) ? 'is-favourite' : ''}`}
                    title={isFavourite(property.id) ? "Remove from favourites" : "Add to favourites"}
                  >
                    <Heart fill={isFavourite(property.id) ? "#d32f2f" : "none"} />
                  </IconButton>
                  <Button
                    component={Link}
                    to={`/property/${property.id}`}
                    variant="outlined"
                    className="view-details-button"
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchPage;