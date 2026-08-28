import axios from "axios";

const discussionAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

discussionAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || localStorage.getItem("reviewerToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default discussionAxiosInstance;
