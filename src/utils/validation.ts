// Form validation and sanitization utilities

// Sanitize string input
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .slice(0, 500);
};

// Sanitize email
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase().slice(0, 254);
};

// Sanitize phone number
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\D/g, '').slice(0, 12);
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Validate Kenyan phone number
export const isValidKenyanPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  const regex = /^(254|0)(7[0-9]{8}|1[0-9]{8})$/;
  return regex.test(cleaned);
};

// Format phone number to 254 format
export const formatKenyanPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return '254' + cleaned;
  return cleaned;
};

// Validate required field
export const isRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Validate min length
export const minLength = (value: string, min: number): boolean => {
  return value.trim().length >= min;
};

// Validate max length
export const maxLength = (value: string, max: number): boolean => {
  return value.trim().length <= max;
};

// Form validation result
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Validate booking form
export const validateBookingForm = (data: {
  name: string;
  phone: string;
  device: string;
  service: string;
  notes?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!isRequired(data.name)) {
    errors.name = 'Name is required';
  } else if (!minLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!isRequired(data.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!isValidKenyanPhone(data.phone)) {
    errors.phone = 'Please enter a valid Kenyan phone number';
  }

  if (!isRequired(data.device)) {
    errors.device = 'Please select a device brand';
  }

  if (!isRequired(data.service)) {
    errors.service = 'Please select a service';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Validate contact form
export const validateContactForm = (data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!isRequired(data.name)) {
    errors.name = 'Name is required';
  } else if (!minLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!isRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!isRequired(data.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!isValidKenyanPhone(data.phone)) {
    errors.phone = 'Please enter a valid Kenyan phone number';
  }

  if (!isRequired(data.message)) {
    errors.message = 'Message is required';
  } else if (!minLength(data.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Generate order ID
export const generateOrderId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AMB-${timestamp}-${random}`;
};

// Generate booking confirmation number
export const generateConfirmationNumber = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};