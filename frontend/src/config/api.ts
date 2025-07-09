import axios from "axios";

const appURL = import.meta.env.VITE_APP_URL;
const apiKey = import.meta.env.VITE_API_KEY;

export const api = axios.create({
    baseURL: appURL,
    headers: {
        'X-API-KEY': apiKey
    },
    withCredentials: true,
})

