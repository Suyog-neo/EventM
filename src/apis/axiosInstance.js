import axios from "axios";
import IP_ADD from "./ip";
export const axiosInstance = axios.create({
    baseURL: IP_ADD,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth');
        if (token) {
            const parsedToken = JSON.parse(token);
            config.headers.Authorization = `Bearer ${parsedToken.access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
