/**
 * Odyssey API Client
 * Centralized interface for Go backend (BFF) communication.
 */

// Configure base URL based on environment (development vs production)
const isLocal = window.location.hostname === 'localhost' || window.location.hostname.endsWith('.hlx.page');
const API_BASE_URL = isLocal ? 'http://localhost:8080/api/v1' : 'https://api.odyssey.com/api/v1';

/**
 * Generic fetch wrapper with error handling and JSON parsing.
 * @param {string} endpoint The API endpoint (e.g., '/quote/calculate')
 * @param {Object} options Fetch options
 * @returns {Promise<any>}
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

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
      throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    }

    // Some endpoints might return 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`[Odyssey API] Request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Calculates pricing quote via Go backend using Goroutines for parallel provider checks.
 * @param {Object} payload The quote details (dates, passengers, extras, etc.)
 * @returns {Promise<Object>} The calculated quote
 */
export async function calculateQuote(payload) {
  // En un entorno de desarrollo sin el backend de Go activo, simulamos la respuesta
  // para no bloquear la UI.
  if (isLocal) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const basePrice = 28900;
        const extrasCost = payload.extras?.length
          ? payload.extras.length * 480
          : 0;
        resolve({
          status: 'success',
          data: {
            total: basePrice + extrasCost,
            currency: 'EUR',
            breakdown: {
              base: basePrice,
              extras: extrasCost,
              taxes: (basePrice + extrasCost) * 0.21,
            },
            availability: true,
          },
        });
      }, 300); // simulate 300ms network delay
    });
  }

  return apiFetch('/quote/calculate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Subscribes user to newsletter
 * @param {string} email User's email
 * @returns {Promise<Object>}
 */
export async function subscribeNewsletter(email) {
  if (isLocal) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success', message: 'Suscrito correctamente' });
      }, 200);
    });
  }

  return apiFetch('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Searches for ports, destinations, and yachts
 * @param {string} query Search term
 * @returns {Promise<Object>}
 */
export async function search(query) {
  return apiFetch(`/search?q=${encodeURIComponent(query)}`);
}

/**
 * Fetches fleet inventory
 * @param {string} region Region filter
 * @returns {Promise<Object>}
 */
export async function getFleet(region) {
  if (isLocal) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          data: [
            {
              id: 'yacht-001',
              name: 'Aurelia Explorer',
              type: 'Catamaran',
              length: '65ft',
              passengers: 8,
              pricePerDay: 4500,
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
              availability: 'High',
            },
            {
              id: 'yacht-002',
              name: 'Sapphire Seas',
              type: 'Megayacht',
              length: '120ft',
              passengers: 12,
              pricePerDay: 12500,
              image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=2070&auto=format&fit=crop',
              availability: 'Low',
            },
            {
              id: 'yacht-003',
              name: 'Windward Spirit',
              type: 'Velero',
              length: '55ft',
              passengers: 6,
              pricePerDay: 2800,
              image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2044&auto=format&fit=crop',
              availability: 'Medium',
            },
            {
              id: 'yacht-004',
              name: 'Oceanis Pearl',
              type: 'Catamaran',
              length: '70ft',
              passengers: 10,
              pricePerDay: 6200,
              image: 'https://images.unsplash.com/photo-1588667610660-f43cce1121d4?q=80&w=2070&auto=format&fit=crop',
              availability: 'High',
            },
          ],
        });
      }, 600); // simulate 600ms network delay to see skeletons
    });
  }

  return apiFetch(`/fleet?region=${encodeURIComponent(region)}`);
}

/**
 * Fetches user's booking history (requires valid HttpOnly cookie session)
 * @returns {Promise<Object>}
 */
export async function getClientBookings() {
  return apiFetch('/client/bookings');
}

/**
 * Confirms a booking
 * @param {Object} payload Booking details
 * @returns {Promise<Object>}
 */
export async function confirmBooking(payload) {
  return apiFetch('/bookings/confirm', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
