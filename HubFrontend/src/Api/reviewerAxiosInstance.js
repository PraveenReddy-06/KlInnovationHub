import axios from "axios";

const reviewerAxiosInstance = axios.create({baseURL: import.meta.env.VITE_API_URL});

reviewerAxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("reviewerToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default reviewerAxiosInstance;