import axiosInstance from "@/lib/axios"

export const membersAPI = {
  // Get all members with pagination and filters
  getAll: (params) => 
    axiosInstance.get("/api/admin/users", { params }),

  getById: (userId) =>
    axiosInstance.get(`/api/admin/users/${userId}`),

  // Create member
  create: (data) => 
    axiosInstance.post("/api/admin/users", data),

  // Update member
  update: (userId, data) => 
    axiosInstance.put(`/api/admin/users/${userId}`, data),

  // Delete member
  delete: (userId) => 
    axiosInstance.delete(`/api/admin/users/${userId}`),
} 