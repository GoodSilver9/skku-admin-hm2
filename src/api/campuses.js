import axiosInstance from "@/lib/axios";

export const campusesAPI = {
  // Get all campuses with pagination and filters
  getAll: (params) => axiosInstance.get("/api/admin/campuses", { params }),

  // Get single campus
  getById: (campusId) => axiosInstance.get(`/api/admin/campuses/${campusId}`),

  // Create campus
  create: (data) => axiosInstance.post("/api/admin/campuses", data),

  // Update campus
  update: (campusId, data) =>
    axiosInstance.put(`/api/admin/campuses/${campusId}`, data),

  // Delete campus
  delete: (campusId) => axiosInstance.delete(`/api/admin/campuses/${campusId}`),

  // Set default campus
  setDefault: (campusId) =>
    axiosInstance.patch(`/api/admin/campuses/${campusId}/set-default`),

  // Get campus statistics
  getStats: () => axiosInstance.get("/api/admin/campuses/stats"),

  // Check campus collection existence
  checkCollection: (campusId) =>
    axiosInstance.get(`/api/admin/campuses/${campusId}/collection`),
};
