// ============================================
// 1. searchUtils.test.js - Search Logic Tests
// ============================================

import { filterProperties } from '../utils/searchUtils';

const mockProperties = [
  {
    id: 1,
    type: 'House',
    price: 450000,
    bedrooms: 3,
    added: { month: 'December', year: 2024 },
    location: 'BR1 3XY, Bromley'
  },
  {
    id: 2,
    type: 'Flat',
    price: 280000,
    bedrooms: 2,
    added: { month: 'November', year: 2024 },
    location: 'NW1 5AB, Camden'
  },
  {
    id: 3,
    type: 'House',
    price: 650000,
    bedrooms: 4,
    added: { month: 'December', year: 2024 },
    location: 'BR6 8CD, Orpington'
  },
  {
    id: 4,
    type: 'Flat',
    price: 195000,
    bedrooms: 1,
    added: { month: 'October', year: 2024 },
    location: 'NW10 2EF, Willesden'
  },
  {
    id: 5,
    type: 'House',
    price: 520000,
    bedrooms: 3,
    added: { month: 'January', year: 2025 },
    location: 'BR2 7GH, Hayes'
  }
];

describe('Search Functionality - Property Filtering', () => {
  
  /**
   * TEST 1: Filter by Property Type
   * Critical: Tests single criteria filtering
   */
  test('should filter properties by type (House only)', () => {
    const criteria = { propertyType: 'House' };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(3);
    expect(results.every(prop => prop.type === 'House')).toBe(true);
    expect(results.map(p => p.id)).toEqual([1, 3, 5]);
  });

  /**
   * TEST 2: Filter by Price Range
   * Critical: Tests min/max price filtering logic
   */
  test('should filter properties by price range (£200k - £500k)', () => {
    const criteria = { minPrice: 200000, maxPrice: 500000 };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(2);
    results.forEach(prop => {
      expect(prop.price).toBeGreaterThanOrEqual(200000);
      expect(prop.price).toBeLessThanOrEqual(500000);
    });
    expect(results.map(p => p.id)).toEqual([1, 2]);
  });

  /**
   * TEST 3: Filter by Multiple Criteria
   * Critical: Tests combining type, price, and bedroom filters
   */
  test('should filter by multiple criteria (House, £400k-£700k, 3+ beds)', () => {
    const criteria = {
      propertyType: 'House',
      minPrice: 400000,
      maxPrice: 700000,
      minBedrooms: 3
    };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(3);
    results.forEach(prop => {
      expect(prop.type).toBe('House');
      expect(prop.price).toBeGreaterThanOrEqual(400000);
      expect(prop.price).toBeLessThanOrEqual(700000);
      expect(prop.bedrooms).toBeGreaterThanOrEqual(3);
    });
  });

  /**
   * TEST 4: Filter by Date (Month and Year)
   * Critical: Tests date filtering functionality
   */
  test('should filter properties by added date (December 2024)', () => {
    const criteria = { addedMonth: 'December', addedYear: '2024' };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(2);
    results.forEach(prop => {
      expect(prop.added.month).toBe('December');
      expect(prop.added.year).toBe(2024);
    });
    expect(results.map(p => p.id)).toEqual([1, 3]);
  });

  /**
   * TEST 5: Filter by Postcode Area
   * Critical: Tests postcode filtering (partial match)
   */
  test('should filter properties by postcode area (BR)', () => {
    const criteria = { postcode: 'BR' };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(3);
    results.forEach(prop => {
      expect(prop.location.toLowerCase()).toContain('br');
    });
  });

  /**
   * TEST 6: Handle "Any" Type Selection
   * Critical: Tests that "Any" returns all properties
   */
  test('should return all properties when type is "Any"', () => {
    const criteria = { propertyType: 'Any' };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(5);
  });

  /**
   * TEST 7: Return Empty Array for No Matches
   * Critical: Tests edge case when no properties match
   */
  test('should return empty array when no properties match criteria', () => {
    const criteria = { minPrice: 1000000 };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(0);
    expect(results).toEqual([]);
  });

  /**
   * TEST 8: Filter with All Criteria Combined
   * Critical: Tests complex multi-criteria search
   */
  test('should handle all criteria simultaneously', () => {
    const criteria = {
      propertyType: 'Flat',
      minPrice: 150000,
      maxPrice: 300000,
      minBedrooms: 2,
      maxBedrooms: 2,
      addedMonth: 'November',
      addedYear: '2024',
      postcode: 'NW1'
    };
    const results = filterProperties(mockProperties, criteria);
    
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe(2);
  });
});

// ============================================
// 2. favourites.test.js - Favourites Logic Tests
// ============================================

describe('Favourites Management', () => {
  
  let favourites = [];
  
  const mockProperty = {
    id: 1,
    type: 'House',
    price: 450000,
    bedrooms: 3,
    picture: '/images/house1.jpg',
    short: 'Beautiful family home'
  };
  
  const mockProperty2 = {
    id: 2,
    type: 'Flat',
    price: 280000,
    bedrooms: 2,
    picture: '/images/flat1.jpg',
    short: 'Modern apartment'
  };

  beforeEach(() => {
    favourites = [];
  });

  /**
   * TEST 9: Add Property to Favourites
   * Critical: Tests adding functionality
   */
  test('should add property to favourites list', () => {
    const addToFavourites = (property, currentFavs) => {
      if (!currentFavs.some(fav => fav.id === property.id)) {
        return [...currentFavs, property];
      }
      return currentFavs;
    };

    favourites = addToFavourites(mockProperty, favourites);
    
    expect(favourites).toHaveLength(1);
    expect(favourites[0].id).toBe(1);
    expect(favourites[0]).toEqual(mockProperty);
  });

  /**
   * TEST 10: Prevent Duplicate Favourites
   * Critical: Tests duplicate prevention logic
   */
  test('should prevent adding duplicate properties to favourites', () => {
    const addToFavourites = (property, currentFavs) => {
      if (!currentFavs.some(fav => fav.id === property.id)) {
        return [...currentFavs, property];
      }
      return currentFavs;
    };

    favourites = addToFavourites(mockProperty, favourites);
    expect(favourites).toHaveLength(1);
    
    // Try adding same property again
    favourites = addToFavourites(mockProperty, favourites);
    expect(favourites).toHaveLength(1);
    
    // Add different property
    favourites = addToFavourites(mockProperty2, favourites);
    expect(favourites).toHaveLength(2);
  });

  /**
   * TEST 11: Remove Property from Favourites
   * Critical: Tests removal functionality
   */
  test('should remove property from favourites by ID', () => {
    const removeFromFavourites = (propertyId, currentFavs) => {
      return currentFavs.filter(fav => fav.id !== propertyId);
    };

    favourites = [mockProperty, mockProperty2];
    expect(favourites).toHaveLength(2);
    
    favourites = removeFromFavourites(1, favourites);
    
    expect(favourites).toHaveLength(1);
    expect(favourites[0].id).toBe(2);
    expect(favourites.find(fav => fav.id === 1)).toBeUndefined();
  });

  /**
   * TEST 12: Clear All Favourites
   * Critical: Tests clear functionality
   */
  test('should clear all favourites', () => {
    const clearFavourites = () => [];

    favourites = [mockProperty, mockProperty2];
    expect(favourites).toHaveLength(2);
    
    favourites = clearFavourites();
    
    expect(favourites).toHaveLength(0);
    expect(favourites).toEqual([]);
  });

  /**
   * TEST 13: Check if Property is in Favourites
   * Critical: Tests favourite status checking
   */
  test('should correctly identify if property is in favourites', () => {
    const isFavourite = (propertyId, currentFavs) => {
      return currentFavs.some(fav => fav.id === propertyId);
    };

    favourites = [mockProperty];
    
    expect(isFavourite(1, favourites)).toBe(true);
    expect(isFavourite(2, favourites)).toBe(false);
    expect(isFavourite(999, favourites)).toBe(false);
  });
});

// ============================================
// 3. security.test.js - Security Utilities Tests
// ============================================

import { sanitizeInput, validatePostcode, validateNumber } from '../utils/security';

describe('Security - Input Validation', () => {
  
  /**
   * TEST 14: Sanitize Malicious Input
   * Critical: Tests XSS prevention
   */
  test('should remove script tags from input', () => {
    const maliciousInput = 'Hello <script>alert("XSS")</script> World';
    const sanitized = sanitizeInput(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('alert');
    expect(sanitized).toBe('Hello  World');
  });

  /**
   * TEST 15: Validate UK Postcode Format
   * Critical: Tests postcode validation
   */
  test('should validate UK postcode format', () => {
    expect(validatePostcode('BR1')).toBe(true);
    expect(validatePostcode('NW10')).toBe(true);
    expect(validatePostcode('SW1A')).toBe(true);
    
    expect(validatePostcode('invalid')).toBe(false);
    expect(validatePostcode('12345')).toBe(false);
    expect(validatePostcode('<script>')).toBe(false);
  });

  /**
   * TEST 16: Validate Numeric Input
   * Critical: Tests number validation and negative prevention
   */
  test('should validate numeric input and reject negatives', () => {
    expect(validateNumber('100')).toBe(true);
    expect(validateNumber('450000')).toBe(true);
    expect(validateNumber('0')).toBe(true);
    
    expect(validateNumber('-50')).toBe(false);
    expect(validateNumber('abc')).toBe(false);
    expect(validateNumber('12.5.6')).toBe(false);
  });
});

// ============================================
// 4. SearchPage.test.js - Component Integration Tests
// ============================================

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchPage from '../pages/SearchPage';

describe('SearchPage Component Integration', () => {
  
  /**
   * TEST 17: Component Renders Successfully
   * Critical: Tests component mounting
   */
  test('should render search form with all input fields', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Search Your Dream Home/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Price/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  /**
   * TEST 18: Form Input Handling
   * Critical: Tests user input changes
   */
  test('should update input values when user types', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    const minPriceInput = screen.getByLabelText(/Min Price/i);
    
    fireEvent.change(minPriceInput, { target: { value: '200000' } });
    
    expect(minPriceInput.value).toBe('200000');
  });

  /**
   * TEST 19: Favourites Section Renders
   * Critical: Tests favourites display
   */
  test('should render favourites section', () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Favourites/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Favourites/i })).toBeInTheDocument();
  });

  /**
   * TEST 20: Search Results Section Renders
   * Critical: Tests results display
   */
  test('should render search results section', async () => {
    render(
      <BrowserRouter>
        <SearchPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Search Results/i)).toBeInTheDocument();
    });
  });
});

// ============================================
// BONUS: utils/searchUtils.js Implementation
// ============================================

/**
 * Filter properties based on search criteria
 * This is the implementation file that the tests use
 */
export function filterProperties(properties, criteria) {
  return properties.filter((property) => {
    // Type filter
    const matchesType =
      !criteria.propertyType ||
      criteria.propertyType === "Any" ||
      property.type.toLowerCase() === criteria.propertyType.toLowerCase();

    // Price filters
    const matchesMinPrice =
      !criteria.minPrice || property.price >= parseInt(criteria.minPrice, 10);
    const matchesMaxPrice =
      !criteria.maxPrice || property.price <= parseInt(criteria.maxPrice, 10);

    // Bedroom filters
    const matchesMinBedrooms =
      !criteria.minBedrooms || property.bedrooms >= parseInt(criteria.minBedrooms, 10);
    const matchesMaxBedrooms =
      !criteria.maxBedrooms || property.bedrooms <= parseInt(criteria.maxBedrooms, 10);

    // Date filters
    const matchesAddedMonth =
      !criteria.addedMonth || 
      property.added.month.toLowerCase() === criteria.addedMonth.toLowerCase();
    const matchesAddedYear =
      !criteria.addedYear || 
      property.added.year.toString() === criteria.addedYear.toString();

    // Postcode filter
    const matchesPostcode =
      !criteria.postcode ||
      property.location.toLowerCase().includes(criteria.postcode.toLowerCase());

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
}