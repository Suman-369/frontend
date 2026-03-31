import axios from "axios";

const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle 401
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // Redirect to login - role check in ProtectedRoute/App
        const role = localStorage.getItem("role");
        const from = role === "staff" ? "staff" : "student";
        window.location.href = `/login?from=${from}`;
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const authApi = createApiInstance("http://localhost:3000/api/auth");
const roomApi = createApiInstance("http://localhost:3002/api/staff");
const complaintApi = createApiInstance("http://localhost:3003/api");

export { authApi, roomApi, complaintApi };
export default authApi;

