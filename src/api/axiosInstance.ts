import axios from 'axios';

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

if (!apiKey) {
  console.error("VITE_API_KEY is not defined in your environment variables. API calls might fail.");
}
if (!apiUrl) {
  console.error("VITE_API_URL is not defined in your environment variables. API calls will fail.");
   throw new Error("VITE_API_URL is not defined. Application cannot function without it.");
}


const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    ...(apiKey ? { 'X-API-Key': apiKey } : {}),
  },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API call error:', error.response ? error.response.data : error.message);
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized request. Check API Key.");
    }
    return Promise.reject(error);
  }
);


export default apiClient; 