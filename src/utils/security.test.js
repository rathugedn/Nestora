// ===================================
// FILE 2: src/utils/security.test.js
// ===================================

import { 
  encodeHTML, 
  sanitizeInput, 
  validatePostcode, 
  validateNumber,
  validateEmail,
  validatePhone 
} from './security';

describe('encodeHTML', () => {
  test('should encode HTML special characters', () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;';
    expect(encodeHTML(input)).toBe(expected);
  });

  test('should encode ampersand', () => {
    expect(encodeHTML('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  test('should encode single quotes', () => {
    expect(encodeHTML("It's working")).toBe('It&#x27;s working');
  });

  test('should return empty string for non-string input', () => {
    expect(encodeHTML(null)).toBe('');
    expect(encodeHTML(undefined)).toBe('');
    expect(encodeHTML(123)).toBe('');
  });

  test('should handle empty string', () => {
    expect(encodeHTML('')).toBe('');
  });
});

describe('sanitizeInput', () => {
  test('should remove script tags', () => {
    const input = 'Hello <script>alert("XSS")</script> World';
    const result = sanitizeInput(input);
    expect(result).not.toContain('<script>');
    expect(result).toBe('Hello  World');
  });

  test('should remove event handlers', () => {
    const input = '<div onclick="alert()">Click me</div>';
    const result = sanitizeInput(input);
    expect(result).not.toContain('onclick');
  });

  test('should remove javascript: protocol', () => {
    const input = '<a href="javascript:alert()">Link</a>';
    const result = sanitizeInput(input);
    expect(result).not.toContain('javascript:');
  });

  test('should trim whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello');
  });

  test('should return empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });

  test('should handle clean input', () => {
    const input = 'This is a clean string';
    expect(sanitizeInput(input)).toBe(input);
  });
});

describe('validatePostcode', () => {
  test('should validate correct UK postcodes', () => {
    expect(validatePostcode('SW1A 1AA')).toBe(true);
    expect(validatePostcode('M1 1AE')).toBe(true);
    expect(validatePostcode('B33 8TH')).toBe(true);
    expect(validatePostcode('CR2 6XH')).toBe(true);
    expect(validatePostcode('DN55 1PT')).toBe(true);
  });

  test('should validate postcodes without space', () => {
    expect(validatePostcode('SW1A1AA')).toBe(true);
    expect(validatePostcode('M11AE')).toBe(true);
  });

  test('should handle lowercase postcodes', () => {
    expect(validatePostcode('sw1a 1aa')).toBe(true);
    expect(validatePostcode('m1 1ae')).toBe(true);
  });

  test('should reject invalid postcodes', () => {
    expect(validatePostcode('INVALID')).toBe(false);
    expect(validatePostcode('12345')).toBe(false);
    expect(validatePostcode('ABC')).toBe(false);
    expect(validatePostcode('')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validatePostcode(null)).toBe(false);
    expect(validatePostcode(undefined)).toBe(false);
    expect(validatePostcode(123)).toBe(false);
  });
});

describe('validateNumber', () => {
  test('should validate valid numbers', () => {
    expect(validateNumber(123)).toBe(true);
    expect(validateNumber(0)).toBe(true);
    expect(validateNumber(-45.67)).toBe(true);
    expect(validateNumber('123')).toBe(true);
    expect(validateNumber('45.67')).toBe(true);
  });

  test('should reject invalid numbers', () => {
    expect(validateNumber('abc')).toBe(false);
    expect(validateNumber('12abc')).toBe(false);
    expect(validateNumber(NaN)).toBe(false);
    expect(validateNumber(Infinity)).toBe(false);
    expect(validateNumber(-Infinity)).toBe(false);
  });

  test('should reject null, undefined, and empty string', () => {
    expect(validateNumber(null)).toBe(false);
    expect(validateNumber(undefined)).toBe(false);
    expect(validateNumber('')).toBe(false);
  });
});

describe('validateEmail', () => {
  test('should validate correct email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('first+last@test.com')).toBe(true);
  });

  test('should reject invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateEmail('@invalid.com')).toBe(false);
    expect(validateEmail('invalid@.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(123)).toBe(false);
  });
});

describe('validatePhone', () => {
  test('should validate UK phone numbers', () => {
    expect(validatePhone('07123456789')).toBe(true);
    expect(validatePhone('07123 456789')).toBe(true);
    expect(validatePhone('+447123456789')).toBe(true);
    expect(validatePhone('020 7123 4567')).toBe(true);
  });

  test('should handle phone numbers with separators', () => {
    expect(validatePhone('07123-456-789')).toBe(true);
    expect(validatePhone('(020) 7123 4567')).toBe(true);
  });

  test('should reject invalid phone numbers', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
    expect(validatePhone('')).toBe(false);
  });

  test('should return false for non-string input', () => {
    expect(validatePhone(null)).toBe(false);
    expect(validatePhone(undefined)).toBe(false);
    expect(validatePhone(123)).toBe(false);
  });
});