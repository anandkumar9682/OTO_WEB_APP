import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isStaging = import.meta.env.MODE === "staging";

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      if (isStaging) {
        console.log("[axiosInstance] Attaching token:", token);
      }
    } else {
      if (isStaging) {
        console.warn("[axiosInstance] No token found in localStorage");
      }
    }

    if (isStaging) {
      console.groupCollapsed(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
      console.log("Headers:", config.headers);
      if (config.params) console.log("Params:", config.params);
      if (config.data) console.log("Body:", config.data);
      console.groupEnd();
    }

    return config;
  },
  (error) => {
    if (isStaging) {
      console.error("[axiosInstance] Request error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (isStaging) {
      console.groupCollapsed(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`);
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.groupEnd();
    }
    return response;
  },
  (error) => {
    if (isStaging) {
      if (error.response) {
        console.groupCollapsed(`[API Error Response] ${error.response.config.method.toUpperCase()} ${error.response.config.url}`);
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        console.groupEnd();
      } else if (error.request) {
        console.error("[axiosInstance] No response received:", error.request);
      } else {
        console.error("[axiosInstance] Request setup error:", error.message);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
