import axios from 'axios';

const appURL = import.meta.env.VITE_APP_URL;
const apiKey = import.meta.env.VITE_API_KEY;

const axiosStudentInstance = axios.create({
    baseURL: appURL,
    headers: {
        'X-API-KEY': apiKey
    },
    withCredentials: true,
})

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

axiosStudentInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        const excludedUrls = ['/students/login', '/students/refresh'];
        const shouldSkip = excludedUrls.some(url => originalRequest.url?.includes(url));

        if (originalRequest.requiresAuth === false || shouldSkip) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(axiosStudentInstance(originalRequest)),
                        reject
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosStudentInstance.post('/auth/refresh'); // refresh token từ cookie
                processQueue(null);
                return axiosStudentInstance(originalRequest); // thực hiện lại request gốc
            } catch (err) {
                processQueue(err);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    });
export default axiosStudentInstance;