import axios from "axios";


const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL : apiUrl
})

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('jtoken');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },(error) =>{
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => response,
    error => {
        if(error.response?.status === 401){
            localStorage.clear();
        }
        return Promise.reject(error);
    }
)

export default api;