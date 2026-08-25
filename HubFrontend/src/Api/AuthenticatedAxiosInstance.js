import axios from "axios";

const authenticatedAxiosInstance = axios.create({baseURL: import.meta.env.VITE_API_URL});

authenticatedAxiosInstance.interceptors.request.use(
    (config) => {
        const studentToken = localStorage.getItem("token");
        const reviewerToken = localStorage.getItem("reviewerToken");
        const token = studentToken || reviewerToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default authenticatedAxiosInstance;