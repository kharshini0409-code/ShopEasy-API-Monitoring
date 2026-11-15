
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json"
  }
});

// Automatically attach JWT token to API requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("Request URL:", config.url);
    console.log("Request method:", config.method);
    console.log("Token attached:", Boolean(token));

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default api;
