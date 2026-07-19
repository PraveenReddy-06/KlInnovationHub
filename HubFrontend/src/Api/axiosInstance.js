import axios from "axios"

const axiosInstance = axios.create({baseURL: import.meta.env.VITE_API_URL})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if(token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isLoggingOut = false;
axiosInstance.interceptors.response.use(
    response => response,
    error => {

        const isAuthPage =window.location.pathname === "/login" || window.location.pathname === "/signup";
        if(!isLoggingOut && error.response?.status === 401 && !isAuthPage) {
            isLoggingOut=true;
            alert(" Your session has expired.Please login again to continue.");
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

