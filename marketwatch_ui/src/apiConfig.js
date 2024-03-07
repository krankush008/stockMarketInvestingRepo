const API_BASE_URL = 'http://ec2-3-25-98-101.ap-southeast-2.compute.amazonaws.com/api';
const API_ENDPOINTS = {
  getAlertsByUserId: (userId) => `${API_BASE_URL}/getAlertsByUserId/${userId}`,
  getBonds: () => `${API_BASE_URL}/bonds`,
  createAlerts: () => `${API_BASE_URL}/createAlerts`
};

export default API_ENDPOINTS;
