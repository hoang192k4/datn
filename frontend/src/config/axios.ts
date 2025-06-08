import axios from 'axios';
const axiosTnstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers: {
        'X-API-KEY': 'x8Yz0ABRLa9cP7KYJ1TFojZUDqk4MPsxhNQvVGAs'
    }
})

export default axiosTnstance;