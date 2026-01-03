/**
 * Security Utilities
 */

export const encodeHTML = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

export const validatePostcode = (postcode) => {
  const postcodePattern = /^[A-Z]{1,2}[0-9]{1,2}$/i;
  return postcodePattern.test(postcode);
};

export const validateNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};