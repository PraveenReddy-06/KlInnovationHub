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
    (error) => {return Promise.reject(error);}
);

let isLoggingOut = false;

reviewerAxiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthPage =
            window.location.pathname === "/login" ||
            window.location.pathname === "/reviewer/forgot-password";
        const hadToken =
            !!localStorage.getItem("reviewerToken");
        if (
            !isLoggingOut &&
            hadToken &&
            error.response?.status === 401 &&
            !isAuthPage
        ) {
            isLoggingOut = true;
            alert(
                "Your session has expired. Please login again to continue."
            );
            localStorage.removeItem("reviewerToken");
            localStorage.removeItem("reviewer");
            localStorage.removeItem("reviewerId");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default reviewerAxiosInstance;