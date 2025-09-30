import axiosInstance from "@/lib/axios";

export const questionsAPI = {
  // Get all questions with pagination and filters
  getAll: (params) => axiosInstance.get("/api/admin/questions", { params }),

  // Get single question
  getById: (questionId, campusName) =>
    axiosInstance.get(`/api/admin/questions/${questionId}/${campusName}`),

  // Create question
  create: (data) => axiosInstance.post("/api/admin/questions", data),

  // Update question
  update: (questionId, data, campusName) =>
    axiosInstance.put(`/api/admin/questions/${questionId}/${campusName}`, data),

  updateStatus: (questionId, data, campusName) =>
    axiosInstance.patch(
      `/api/admin/questions/status/${questionId}/${campusName}`,
      data
    ),

  // Delete question
  delete: (questionId, campusName) =>
    axiosInstance.delete(`/api/admin/questions/${questionId}/${campusName}`),

  getAuthors: () => axiosInstance.get("/api/admin/questions/authors"),
};
