/**
 * Odyssey API Client
 * Centralized interface for Go backend (BFF) communication.
 */

// Configure base URL based on environment (development vs production)

// Go BFF URL (Local Development)
const BFF_URL = 'http://localhost:8080/api/v1';

/**
 * Gets the JWT auth token from localStorage
 * @returns {string|null}
 */
export function getAuthToken() {
  return localStorage.getItem('odyssey_jwt');
}

/**
 * Sets the JWT auth token in localStorage
 * @param {string} token
 */
export function setAuthToken(token) {
  localStorage.setItem('odyssey_jwt', token);
}

/**
 * Removes the JWT auth token
 */
export function clearAuthToken() {
  localStorage.removeItem('odyssey_jwt');
}

/**
 * Generic fetch wrapper with error handling and JSON parsing.
 * @param {string} url The full URL
 * @param {Object} options Fetch options
 * @returns {Promise<any>}
 */
async function fetchWrapper(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const token = getAuthToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[Odyssey API] Request failed for ${url}:`, error);
    throw error;
  }
}

/**
 * Register a new user
 * @param {Object} payload { email, password, name }
 * @returns {Promise<Object>}
 */
export async function register(payload) {
  return fetchWrapper(`${BFF_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login user
 * @param {Object} payload { email, password }
 * @returns {Promise<Object>}
 */
export async function login(payload) {
  return fetchWrapper(`${BFF_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Get authenticated user profile
 * @returns {Promise<Object>}
 */
export async function getClientProfile() {
  return fetchWrapper(`${BFF_URL}/client/profile`);
}

/**
 * Fetch dynamic fleet data
 * @param {string} region
 * @returns {Promise<Array>} List of yachts
 */
export async function getFleet(region) {
  try {
    const response = await fetch(`${BFF_URL}/fleet?region=${encodeURIComponent(region)}`);
    if (!response.ok) throw new Error('Network error fetching fleet');
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error in getFleet:', error);
    return [];
  }
}

/**
 * Calculate pricing quote
 * @param {Object} payload
 * @returns {Promise<Object>} Pricing details
 */
export async function calculateQuote(payload) {
  try {
    const response = await fetch(`${BFF_URL}/quote/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Network error calculating quote');
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error('Error in calculateQuote:', error);
    return null;
  }
}

/**
 * Subscribe to newsletter
 * @param {string} email
 * @returns {Promise<boolean>} Success status
 */
export async function subscribeNewsletter(email) {
  try {
    const response = await fetch(`${BFF_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return response.ok;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return false;
  }
}

/**
 * Searches for ports, destinations, and yachts
 * @param {string} query Search term
 * @returns {Promise<Object>}
 */
export async function search(query) {
  return fetchWrapper(`${BFF_URL}/search?q=${encodeURIComponent(query)}`);
}

/**
 * Fetches user's booking history (requires valid HttpOnly cookie session)
 * @returns {Promise<Object>}
 */
export async function getClientBookings() {
  return fetchWrapper(`${BFF_URL}/client/bookings`);
}

/**
 * Confirms a booking
 * @param {Object} payload Booking details
 * @returns {Promise<Object>}
 */
export async function confirmBooking(payload) {
  return fetchWrapper(`${BFF_URL}/bookings/confirm`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
