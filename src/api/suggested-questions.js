import axiosInstance from "@/lib/axios";

export const suggestedQuestionsAPI = {
  getAll: async (params) => {
    const response = await axiosInstance.get("/api/admin/suggested-questions", { params })
    return response
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/api/admin/suggested-questions/${id}`)
    return response
  },

  create: async (data) => {
    const response = await axiosInstance.post("/api/admin/suggested-questions", data)
    return response
  },

  update: async (id, data) => {
    const response = await axiosInstance.put(`/api/admin/suggested-questions/${id}`, data)
    return response
  },

  updateStatus: async (id, isActive) => {
    const response = await axiosInstance.patch(`/api/admin/suggested-questions/status/${id}`, { isActive })
    return response
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/api/admin/suggested-questions/${id}`)
    return response
  }
} 