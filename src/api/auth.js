import axiosInstance from "@/lib/axios"

export const authAPI = {
  // User Authentication
  register: (data) => axiosInstance.post("/api/user/auth/register", data),
  login: (data) => axiosInstance.post("/api/user/auth/login", data),
  getCurrentUser: () => axiosInstance.get("/api/user/auth/me"),

  // Admin Authentication
  adminLogin: (data) => axiosInstance.post("/api/admin/auth/login", data),
  adminProfile: () => axiosInstance.get("/api/admin/auth/me"),
  adminProfileUpdate: (data) => axiosInstance.put("/api/admin/auth/me", data),
}