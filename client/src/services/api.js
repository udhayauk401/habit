// Use the Vite proxy in local development.
// In production, prefer VITE_API_URL when provided, otherwise fall back to
// the current site origin so the deployed frontend can still resolve its API.
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return '/api';
  }

  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (configuredUrl) {
    const normalizedConfiguredUrl = configuredUrl.replace(/\/$/, '');
    return normalizedConfiguredUrl.endsWith('/api')
      ? normalizedConfiguredUrl
      : `${normalizedConfiguredUrl}/api`;
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return '/api';
};

const API_URL = getApiBaseUrl();

const buildUrl = (endpoint) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${normalizedEndpoint}`;
};

// Public endpoints that don't require authentication
const publicEndpoints = ['/auth/login', '/auth/register'];
const REQUEST_TIMEOUT_MS = 60000;
const REQUEST_RETRIES = 0;

const apiCall = async (endpoint, options = {}) => {
  const isPublic = publicEndpoints.includes(endpoint);

  let token = null;
  if (!isPublic) {
    token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found for protected endpoint:', endpoint);
    }
  }

  const urlsToTry = [buildUrl(endpoint)];
  console.log('API Call:', endpoint, 'Token:', token ? 'Present' : 'Not required for public endpoints');

  let lastError;

  const makeRequest = async (url) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const config = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
        ...(options.headers || {}),
      },
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type') || '';
      let data;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      }

      console.log('API Response for', endpoint, ':', response.status, data);

      if (!response.ok) {
        console.error('API Error:', response.status, data);
        throw new Error(data.message || 'API Error');
      }

      return data;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  for (let attempt = 0; attempt <= REQUEST_RETRIES; attempt += 1) {
    for (const url of urlsToTry) {
      try {
        return await makeRequest(url);
      } catch (error) {
        lastError = error;
        console.error('API Fetch Error:', url, error);
        break;
      }
    }

    if (lastError?.name !== 'AbortError') {
      break;
    }
  }

  if (lastError?.name === 'AbortError') {
    throw new Error('The backend is taking longer than expected. Please try again in a moment.');
  }

  throw lastError;
};

export const authAPI = {
  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (userData) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getMe: () => apiCall('/auth/me'),
};

export const habitsAPI = {
  getHabits: () => apiCall('/habits'),

  createHabit: (habitData) =>
    apiCall('/habits', {
      method: 'POST',
      body: JSON.stringify(habitData),
    }),

  deleteHabit: (id) =>
    apiCall(`/habits/${id}`, {
      method: 'DELETE',
    }),
};

export const attendanceAPI = {
  getByMonth: (habitId, year, month) =>
    apiCall(`/attendance/${habitId}/${year}/${month}`),

  toggle: (attendanceData) =>
    apiCall('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    }),

  getStats: (habitId, year, month) =>
    apiCall(`/attendance/stats/${habitId}/${year}/${month}`),
};

export const healthCheck = () => apiCall('/health');
