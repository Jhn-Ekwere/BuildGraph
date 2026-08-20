import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchProjects = async () => {
  const response = await api.get('/projects');
  return response.data;
};

export const fetchProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createEstimate = async (estimateData) => {
  const response = await api.post('/estimates', estimateData);
  return response.data;
};

export const submitActualCost = async (costData) => {
  const response = await api.post('/costs', costData);
  return response.data;
};

export const fetchCostStats = async () => {
  const response = await api.get('/costs/stats');
  return response.data;
};

export const fetchMaterialsByLocation = async (location) => {
  const response = await api.get(`/costs/materials?location=${encodeURIComponent(location)}`);
  return response.data;
};

export default api;
