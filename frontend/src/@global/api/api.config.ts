import axios from "axios";

export const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    Accept: "application/json",
  },
});

export default api;
