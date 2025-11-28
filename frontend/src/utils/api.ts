import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '', // Empty string allows proxy to work in dev
    withCredentials: true
});

export default api;
