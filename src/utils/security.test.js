import { encodeHTML, sanitizeInput, validatePostcode, validateNumber } from './security';

describe('Security Utilities', () => {
  test('encodeHTML should encode special characters', () => {
    const malicious = '<script>alert("XSS")</script>';
    const encoded = encodeHTML(malicious);
    expect(encoded).not.toContain('<script>');
    expect(encoded).toContain('&lt;script&gt;');
  });

  test('sanitizeInput should remove script tags', () => {
    const input = 'Hello <script>alert("bad")</script> World';
    const sanitized = sanitizeInput(input);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('Hello  World');
  });

  test('validatePostcode should accept valid UK postcodes', () => {
    expect(validatePostcode('BR1')).toBe(true);
    expect(validatePostcode('NW10')).toBe(true);
    expect(validatePostcode('invalid')).toBe(false);
  });

  test('validateNumber should reject negative numbers', () => {
    expect(validateNumber('100')).toBe(true);
    expect(validateNumber('-50')).toBe(false);
    expect(validateNumber('abc')).toBe(false);
  });
});