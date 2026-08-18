import axios from "axios";

const reviewerAxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
});

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