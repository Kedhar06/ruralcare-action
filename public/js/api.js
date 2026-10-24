/**
 * Central API Client for RuralCare Action
 */

const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (window.appState && window.appState.token) {
      headers['Authorization'] = `Bearer ${window.appState.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 && window.appState && window.appState.token) {
          window.appState.logout();
          if (window.Toast) {
            window.Toast.warning('Your session has expired. Please log in again.');
          }
        }
        const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
        const err = new Error(errorMsg);
        err.status = response.status;
        err.details = data.details;
        throw err;
      }

      return data;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  },

  // Auth
  auth: {
    login: (identifier, password, expectedRole) =>
      API.request('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password, expectedRole }) }),
    register: (userData) =>
      API.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () =>
      API.request('/auth/me'),
    demoLogin: (role) =>
      API.request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
    forgotPassword: (phone) =>
      API.request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ phone }) }),
    resetPassword: (phone, otp, newPassword) =>
      API.request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ phone, otp, newPassword }) }),
  },

  // Facilities
  facilities: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/facilities${qs ? '?' + qs : ''}`);
    },
    get: (id) => API.request(`/facilities/${id}`),
  },

  // Doctors
  doctors: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/doctors${qs ? '?' + qs : ''}`);
    },
    get: (id) => API.request(`/doctors/${id}`),
  },

  // Appointments
  appointments: {
    create: (data) =>
      API.request('/appointments', { method: 'POST', body: JSON.stringify(data) }),
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/appointments${qs ? '?' + qs : ''}`);
    },
    get: (id) => API.request(`/appointments/${id}`),
    updateStatus: (id, data) =>
      API.request(`/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
    cancel: (id, reason) =>
      API.request(`/appointments/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  },

  // Health Records
  healthRecords: {
    create: (data) =>
      API.request('/health-records', { method: 'POST', body: JSON.stringify(data) }),
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/health-records${qs ? '?' + qs : ''}`);
    },
    get: (id) => API.request(`/health-records/${id}`),
    getPatients: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/health-records/patients${qs ? '?' + qs : ''}`);
    },
  },

  // Referrals
  referrals: {
    create: (data) =>
      API.request('/referrals', { method: 'POST', body: JSON.stringify(data) }),
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/referrals${qs ? '?' + qs : ''}`);
    },
    updateStatus: (id, status, notes) =>
      API.request(`/referrals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, action_notes: notes }) }),
  },

  // Reminders
  reminders: {
    create: (data) =>
      API.request('/reminders', { method: 'POST', body: JSON.stringify(data) }),
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/reminders${qs ? '?' + qs : ''}`);
    },
    updateStatus: (id, status) =>
      API.request(`/reminders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },

  // Resources
  resources: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return API.request(`/resources${qs ? '?' + qs : ''}`);
    },
    get: (id) => API.request(`/resources/${id}`),
  },

  // Notifications
  notifications: {
    list: () => API.request('/notifications'),
    markRead: (id) => API.request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => API.request('/notifications/read-all', { method: 'POST' }),
  },

  // AI Navigator
  ai: {
    navigate: (query, lang) =>
      API.request('/ai/navigate', { method: 'POST', body: JSON.stringify({ query, lang }) }),
  },
};

window.API = API;

