import axios from 'axios';
const axiosTeacherInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers: {
        'X-API-KEY': 'x8Yz0ABRLa9cP7KYJ1TFojZUDqk4MPsxhNQvVGAs'
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

axiosTeacherInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (originalRequest.requiresAuth === false) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: () => resolve(axiosTeacherInstance(originalRequest)),
                        reject
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosTeacherInstance.post('/teachers/refresh'); // refresh token từ cookie
                processQueue(null);
                return axiosTeacherInstance(originalRequest); // thực hiện lại request gốc
            } catch (err) {
                processQueue(err);
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    });

export default axiosTeacherInstance;