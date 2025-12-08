import axios from "axios";
import cookies from "js-cookie";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:3030/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = cookies.get("refreshToken");
        const response = await axios.post(
          "http://localhost:3030/api/auth/refresh",
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        cookies.set("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        cookies.remove("accessToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
