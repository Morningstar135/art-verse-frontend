/**
 * Validates an email address.
 * Returns an error string if invalid, or null if valid.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

/**
 * Validates a password (minimum 8 characters).
 * Returns an error string if invalid, or null if valid.
 */
export function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  return null;
}

/**
 * Validates a pincode (exactly 6 digits).
 * Returns an error string if invalid, or null if valid.
 */
export function validatePincode(pincode) {
  if (!pincode || !pincode.trim()) {
    return 'Pincode is required';
  }
  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(pincode.trim())) {
    return 'Pincode must be exactly 6 digits';
  }
  return null;
}

/**
 * Validates a phone number (exactly 10 digits).
 * Returns an error string if invalid, or null if valid.
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Phone number is required';
  }
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone.trim())) {
    return 'Phone number must be exactly 10 digits';
  }
  return null;
}

/**
 * Checks that a value is non-empty.
 * Returns an error string if empty, or null if valid.
 */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
}
