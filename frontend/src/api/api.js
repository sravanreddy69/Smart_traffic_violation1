import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Since we have minimal auth with just roles, this interceptor could add a mock token if needed
// api.interceptors.request.use((config) => { ... });

export default api;
