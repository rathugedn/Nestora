// Encode HTML special characters to prevent XSS
export function encodeHTML(input) {
  if (typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Sanitize user input
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';

  let sanitized = input;

  // Remove <script> tags
  sanitized = sanitized.replace(/<script.*?>.*?<\/script>/gi, '');

  // Remove inline event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/ on\w+=".*?"/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Trim whitespace
  return sanitized.trim();
}

// Validate UK postcode
export function validatePostcode(postcode) {
  if (typeof postcode !== 'string') return false;

  const value = postcode.trim().toUpperCase();

  const ukPostcodeRegex =
    /^(GIR ?0AA|[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})$/;

  return ukPostcodeRegex.test(value);
}

// Validate number (number or numeric string)
export function validateNumber(value) {
  if (value === null || value === undefined || value === '') return false;

  const num = Number(value);

  return Number.isFinite(num);
}

// Validate email address
export function validateEmail(email) {
  if (typeof email !== 'string') return false;

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}

// Validate UK phone number
export function validatePhone(phone) {
  if (typeof phone !== 'string') return false;

  const cleaned = phone.replace(/[\s\-()]/g, '');

  const ukPhoneRegex =
    /^(?:\+44|0)\d{9,10}$/;

  return ukPhoneRegex.test(cleaned);
}
