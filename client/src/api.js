import axios from "axios";

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? "http://localhost:5000/api" 
    : "https://kardetailing2.onrender.com/api",
  withCredentials: true,
});

export default api;
