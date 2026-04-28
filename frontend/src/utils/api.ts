import axios from "axios";

const baseApi = "https://autosms.onrender.com/api";

export const api = axios.create({
  baseURL: baseApi,
  headers: {
    "Content-Type": "application/json",
  },
});

// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response.status === 401) {
//             localStorage.removeItem("token");
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     }
// )
