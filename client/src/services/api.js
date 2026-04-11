import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:3000/api/admin",
  withCredentials: true,
});

API.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

// ✅ SIMPLE + CLEAN
export const loginAdmin = (data) => API.post("/login", data);
export const verifyOTP = (data) => API.post("/verify-otp", data);
export const getProfile = () => API.get("/profile");
export const logoutAdmin = () => API.get("/logout");

// ================= PRODUCTS =================

export const addProduct = (formData) =>
  API.post("/add-product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, formData) => {
  API.put(`/update-product/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = (id) => API.delete(`/delete-product/${id}`);

export const getProducts = () => API.get("/products");

export default API;
