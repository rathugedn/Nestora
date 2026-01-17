// ===================================
// FILE 1: src/searchUtils.js
// ===================================

/**
 * Filters properties based on search criteria
 * @param {Array} properties - Array of property objects
 * @param {Object} filters - Search filters
 * @returns {Array} - Filtered properties
 */
export function filterProperties(properties, filters) {
  if (!Array.isArray(properties)) return [];
  if (!filters || typeof filters !== 'object') return properties;

  return properties.filter(property => {
    // Filter by location
    if (filters.location && property.location) {
      const locationMatch = property.location
        .toLowerCase()
        .includes(filters.location.toLowerCase());
      if (!locationMatch) return false;
    }

    // Filter by price range
    if (filters.minPrice !== undefined && property.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
      return false;
    }

    // Filter by bedrooms
    if (filters.bedrooms !== undefined && property.bedrooms < filters.bedrooms) {
      return false;
    }

    // Filter by property type
    if (filters.propertyType && property.type !== filters.propertyType) {
      return false;
    }

    // Filter by availability
    if (filters.available !== undefined && property.available !== filters.available) {
      return false;
    }

    return true;
  });
}

/**
 * Sorts properties based on criteria
 * @param {Array} properties - Array of property objects
 * @param {string} sortBy - Sort criteria (price, bedrooms, date)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} - Sorted properties
 */
export function sortProperties(properties, sortBy = 'price', order = 'asc') {
  if (!Array.isArray(properties)) return [];

  const sorted = [...properties].sort((a, b) => {
    let compareA, compareB;

    switch (sortBy) {
      case 'price':
        compareA = a.price || 0;
        compareB = b.price || 0;
        break;
      case 'bedrooms':
        compareA = a.bedrooms || 0;
        compareB = b.bedrooms || 0;
        break;
      case 'date':
        compareA = new Date(a.dateAdded || 0);
        compareB = new Date(b.dateAdded || 0);
        break;
      default:
        compareA = a.price || 0;
        compareB = b.price || 0;
    }

    if (order === 'desc') {
      return compareB > compareA ? 1 : compareB < compareA ? -1 : 0;
    }
    return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
  });

  return sorted;
}

/**
 * Searches properties by keyword
 * @param {Array} properties - Array of property objects
 * @param {string} keyword - Search keyword
 * @returns {Array} - Matching properties
 */
export function searchByKeyword(properties, keyword) {
  if (!Array.isArray(properties)) return [];
  if (!keyword || typeof keyword !== 'string') return properties;

  const searchTerm = keyword.toLowerCase().trim();

  return properties.filter(property => {
    const searchableFields = [
      property.title,
      property.description,
      property.location,
      property.type,
    ].filter(Boolean);

    return searchableFields.some(field =>
      field.toLowerCase().includes(searchTerm)
    );
  });
}

/**
 * Calculates average price from properties
 * @param {Array} properties - Array of property objects
 * @returns {number} - Average price
 */
export function calculateAveragePrice(properties) {
  if (!Array.isArray(properties) || properties.length === 0) return 0;

  const validProperties = properties.filter(p => typeof p.price === 'number' && p.price > 0);
  if (validProperties.length === 0) return 0;

  const total = validProperties.reduce((sum, property) => sum + property.price, 0);
  return Math.round(total / validProperties.length);
}

/**
 * Gets unique property types
 * @param {Array} properties - Array of property objects
 * @returns {Array} - Unique property types
 */
export function getPropertyTypes(properties) {
  if (!Array.isArray(properties)) return [];

  const types = properties
    .map(p => p.type)
    .filter(Boolean);

  return [...new Set(types)];
}

/**
 * Formats price with currency
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol
 * @returns {string} - Formatted price
 */
export function formatPrice(price, currency = '£') {
  if (typeof price !== 'number' || isNaN(price)) return `${currency}0`;
  return `${currency}${price.toLocaleString()}`;
}


// ===================================
// FILE 2: src/searchUtils.test.js
// ===================================

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  filterProperties,
  sortProperties,
  searchByKeyword,
  calculateAveragePrice,
  getPropertyTypes,
  formatPrice,
} from './searchUtils';

// Mock data for testing
const mockProperties = [
  {
    id: 1,
    title: 'Modern Apartment',
    description: 'Beautiful modern apartment in city center',
    location: 'London',
    price: 500000,
    bedrooms: 2,
    type: 'Apartment',
    available: true,
    dateAdded: '2024-01-15',
  },
  {
    id: 2,
    title: 'Family House',
    description: 'Spacious family house with garden',
    location: 'Manchester',
    price: 350000,
    bedrooms: 4,
    type: 'House',
    available: true,
    dateAdded: '2024-01-10',
  },
  {
    id: 3,
    title: 'Studio Flat',
    description: 'Cozy studio flat near station',
    location: 'London',
    price: 250000,
    bedrooms: 1,
    type: 'Apartment',
    available: false,
    dateAdded: '2024-01-20',
  },
  {
    id: 4,
    title: 'Luxury Villa',
    description: 'Stunning luxury villa with pool',
    location: 'Birmingham',
    price: 800000,
    bedrooms: 5,
    type: 'House',
    available: true,
    dateAdded: '2024-01-05',
  },
];

describe('filterProperties', () => {
  test('should return all properties when no filters applied', () => {
    const result = filterProperties(mockProperties, {});
    expect(result).toHaveLength(4);
  });

  test('should filter by location', () => {
    const filters = { location: 'London' };
    const result = filterProperties(mockProperties, filters);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.location === 'London')).toBe(true);
  });

  test('should filter by price range', () => {
    const filters = { minPrice: 300000, maxPrice: 600000 };
    const result = filterProperties(mockProperties, filters);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.price >= 300000 && p.price <= 600000)).toBe(true);
  });

  test('should filter by bedrooms', () => {
    const filters = { bedrooms: 3 };
    const result = filterProperties(mockProperties, filters);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.bedrooms >= 3)).toBe(true);
  });

  test('should filter by property type', () => {
    const filters = { propertyType: 'House' };
    const result = filterProperties(mockProperties, filters);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.type === 'House')).toBe(true);
  });

  test('should filter by availability', () => {
    const filters = { available: true };
    const result = filterProperties(mockProperties, filters);
    expect(result).toHaveLength(3);
    expect(result.every(p => p.available === true)).toBe(true);
  });

  test('should apply multiple filters', () => {
    const filters = {
      location: 'London',
      minPrice: 200000,
      maxPrice: 400000,
      available: true,
    };
    const result = filterProperties(mockProperties, filters);
    expect(result).toHaveLength(0);
  });

  test('should return empty array for non-array input', () => {
    expect(filterProperties(null, {})).toEqual([]);
    expect(filterProperties(undefined, {})).toEqual([]);
    expect(filterProperties('invalid', {})).toEqual([]);
  });

  test('should return all properties if filters is null', () => {
    const result = filterProperties(mockProperties, null);
    expect(result).toHaveLength(4);
  });
});

describe('sortProperties', () => {
  test('should sort by price ascending', () => {
    const result = sortProperties(mockProperties, 'price', 'asc');
    expect(result[0].price).toBe(250000);
    expect(result[result.length - 1].price).toBe(800000);
  });

  test('should sort by price descending', () => {
    const result = sortProperties(mockProperties, 'price', 'desc');
    expect(result[0].price).toBe(800000);
    expect(result[result.length - 1].price).toBe(250000);
  });

  test('should sort by bedrooms ascending', () => {
    const result = sortProperties(mockProperties, 'bedrooms', 'asc');
    expect(result[0].bedrooms).toBe(1);
    expect(result[result.length - 1].bedrooms).toBe(5);
  });

  test('should sort by bedrooms descending', () => {
    const result = sortProperties(mockProperties, 'bedrooms', 'desc');
    expect(result[0].bedrooms).toBe(5);
    expect(result[result.length - 1].bedrooms).toBe(1);
  });

  test('should sort by date ascending', () => {
    const result = sortProperties(mockProperties, 'date', 'asc');
    expect(result[0].id).toBe(4); // Oldest date
    expect(result[result.length - 1].id).toBe(3); // Newest date
  });

  test('should sort by date descending', () => {
    const result = sortProperties(mockProperties, 'date', 'desc');
    expect(result[0].id).toBe(3); // Newest date
    expect(result[result.length - 1].id).toBe(4); // Oldest date
  });

  test('should default to price sorting', () => {
    const result = sortProperties(mockProperties);
    expect(result[0].price).toBe(250000);
  });

  test('should return empty array for non-array input', () => {
    expect(sortProperties(null)).toEqual([]);
    expect(sortProperties(undefined)).toEqual([]);
  });

  test('should not mutate original array', () => {
    const original = [...mockProperties];
    sortProperties(mockProperties, 'price', 'desc');
    expect(mockProperties).toEqual(original);
  });
});

describe('searchByKeyword', () => {
  test('should search by title', () => {
    const result = searchByKeyword(mockProperties, 'Modern');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Modern Apartment');
  });

  test('should search by description', () => {
    const result = searchByKeyword(mockProperties, 'garden');
    expect(result).toHaveLength(1);
    expect(result[0].description).toContain('garden');
  });

  test('should search by location', () => {
    const result = searchByKeyword(mockProperties, 'manchester');
    expect(result).toHaveLength(1);
    expect(result[0].location).toBe('Manchester');
  });

  test('should be case insensitive', () => {
    const result1 = searchByKeyword(mockProperties, 'LONDON');
    const result2 = searchByKeyword(mockProperties, 'london');
    expect(result1).toEqual(result2);
    expect(result1).toHaveLength(2);
  });

  test('should return all properties for empty keyword', () => {
    expect(searchByKeyword(mockProperties, '')).toHaveLength(4);
    expect(searchByKeyword(mockProperties, '   ')).toHaveLength(4);
  });

  test('should return empty array when no matches', () => {
    const result = searchByKeyword(mockProperties, 'xyz123');
    expect(result).toHaveLength(0);
  });

  test('should return empty array for non-array input', () => {
    expect(searchByKeyword(null, 'test')).toEqual([]);
    expect(searchByKeyword(undefined, 'test')).toEqual([]);
  });

  test('should return all properties if keyword is null', () => {
    const result = searchByKeyword(mockProperties, null);
    expect(result).toHaveLength(4);
  });
});

describe('calculateAveragePrice', () => {
  test('should calculate average price correctly', () => {
    const avg = calculateAveragePrice(mockProperties);
    const expected = (500000 + 350000 + 250000 + 800000) / 4;
    expect(avg).toBe(Math.round(expected));
  });

  test('should return 0 for empty array', () => {
    expect(calculateAveragePrice([])).toBe(0);
  });

  test('should return 0 for non-array input', () => {
    expect(calculateAveragePrice(null)).toBe(0);
    expect(calculateAveragePrice(undefined)).toBe(0);
  });

  test('should ignore properties without valid price', () => {
    const props = [
      { price: 100000 },
      { price: 200000 },
      { price: null },
      { price: undefined },
    ];
    const avg = calculateAveragePrice(props);
    expect(avg).toBe(150000);
  });

  test('should return 0 if no valid prices', () => {
    const props = [{ price: null }, { price: undefined }];
    expect(calculateAveragePrice(props)).toBe(0);
  });
});

describe('getPropertyTypes', () => {
  test('should return unique property types', () => {
    const types = getPropertyTypes(mockProperties);
    expect(types).toHaveLength(2);
    expect(types).toContain('Apartment');
    expect(types).toContain('House');
  });

  test('should return empty array for empty input', () => {
    expect(getPropertyTypes([])).toEqual([]);
  });

  test('should return empty array for non-array input', () => {
    expect(getPropertyTypes(null)).toEqual([]);
    expect(getPropertyTypes(undefined)).toEqual([]);
  });

  test('should filter out null/undefined types', () => {
    const props = [
      { type: 'House' },
      { type: null },
      { type: 'Apartment' },
      { type: undefined },
    ];
    const types = getPropertyTypes(props);
    expect(types).toHaveLength(2);
  });
});

describe('formatPrice', () => {
  test('should format price with default currency', () => {
    expect(formatPrice(500000)).toBe('£500,000');
  });

  test('should format price with custom currency', () => {
    expect(formatPrice(500000, '$')).toBe('$500,000');
  });

  test('should handle zero price', () => {
    expect(formatPrice(0)).toBe('£0');
  });

  test('should return currency symbol with 0 for invalid input', () => {
    expect(formatPrice(null)).toBe('£0');
    expect(formatPrice(undefined)).toBe('£0');
    expect(formatPrice(NaN)).toBe('£0');
  });

  test('should format large numbers with commas', () => {
    expect(formatPrice(1234567)).toBe('£1,234,567');
  });

  test('should handle decimal numbers', () => {
    const result = formatPrice(123456.78);
    expect(result).toContain('123,456');
  });
});