const API_BASE_URL = 'http://localhost:8080/api';
const API_ENDPOINTS = {
  getAlertsByUserId: (userId) => `${API_BASE_URL}/getAlertsByUserId/${userId}`,
  getBonds: () => `${API_BASE_URL}/bonds`,
  createAlerts: () => `${API_BASE_URL}/createAlerts`
};

export default API_ENDPOINTS;
