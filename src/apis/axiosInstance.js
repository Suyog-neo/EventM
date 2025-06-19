import axios from "axios";
 
export const axiosInstance = axios.create({
    baseURL: 'http://172.21.0.206:8000',
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
