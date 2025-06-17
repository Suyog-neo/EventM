import axios from "axios";
 
export const axiosInstance = axios.create({
    baseURL: 'http://172.21.0.170:8000',
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})
 
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);