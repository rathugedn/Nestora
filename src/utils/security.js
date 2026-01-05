// ===================================
// FILE 1: src/utils/security.js
// ===================================

/**
 * Encodes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to encode
 * @returns {string} - The encoded string
 */
export function encodeHTML(str) {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes user input by removing potentially dangerous characters
 * @param {string} input - The input to sanitize
 * @returns {string} - The sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
}

/**
 * Validates UK postcode format
 * @param {string} postcode - The postcode to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validatePostcode(postcode) {
  if (typeof postcode !== 'string') return false;
  
  // UK postcode regex pattern
  const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
  
  return postcodeRegex.test(postcode.trim());
}

/**
 * Validates if input is a valid number
 * @param {*} value - The value to validate
 * @returns {boolean} - True if valid number, false otherwise
 */
export function validateNumber(value) {
  if (value === null || value === undefined || value === '') return false;
  
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateEmail(email) {
  if (typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates phone number (UK format)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validatePhone(phone) {
  if (typeof phone !== 'string') return false;
  
  // Remove spaces and common separators
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // UK phone number: 10-11 digits, optionally starting with +44 or 0
  const phoneRegex = /^(\+44|0)?[1-9]\d{9,10}$/;
  
  return phoneRegex.test(cleaned);
}

