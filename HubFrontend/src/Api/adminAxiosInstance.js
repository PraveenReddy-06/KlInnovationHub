import axios from "axios";

const adminAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

adminAxiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isLoggingOut = false;

adminAxiosInstance.interceptors.response.use(
    (response) => response,

    (error) => {
        const isAdminLoginPage =
            window.location.pathname === "/admin/login";

        const hasAdminToken =
            !!localStorage.getItem("adminToken");

        if (
            !isLoggingOut &&
            hasAdminToken &&
            error.response?.status === 401 &&
            !isAdminLoginPage
        ) {
            isLoggingOut = true;

            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            window.location.href = "/admin/login";
        }

        return Promise.reject(error);
    }
);

export default adminAxiosInstance;