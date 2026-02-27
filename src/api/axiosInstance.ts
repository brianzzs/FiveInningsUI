import axios from "axios";

const apiKey = import.meta.env.VITE_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

if (!apiKey) {
  console.warn("VITE_API_KEY is not defined. If your backend enforces API keys, requests may return 403.");
}

if (!apiUrl) {
  console.error("VITE_API_URL is not defined in your environment variables. API calls will fail.");
  throw new Error("VITE_API_URL is not defined. Application cannot function without it.");
}

const apiClient = axios.create({
  baseURL: apiUrl,
  // Keep defaults minimal to avoid unnecessary CORS preflights on GET requests.
  headers: {
    ...(apiKey ? { "X-API-Key": apiKey } : {}),
  },
});

apiClient.interceptors.request.use((config) => {
  const method = (config.method ?? "get").toLowerCase();

  if (apiKey) {
    config.headers = config.headers ?? {};
    config.headers["X-API-Key"] = apiKey;
  }

  // Only set JSON content-type for methods that typically send a body.
  if (["post", "put", "patch", "delete"].includes(method) && !config.headers?.["Content-Type"]) {
    config.headers = config.headers ?? {};
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response ? error.response.data : error.message;

    console.error("API call error:", message);

    if (status === 401) {
      console.error("Unauthorized request. Check API key and backend auth middleware.");
    }

    if (status === 403) {
      console.error(
        "Forbidden request (403). Verify VITE_API_KEY value and backend CORS/auth rules for your frontend origin."
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
