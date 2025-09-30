import axiosInstance from "@/lib/axios"

export const uploadAPI = {
  // Upload image
  upload: (formData) => 
    axiosInstance.post("/api/admin/upload/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete image
  delete: (fileName) => 
    axiosInstance.delete(`/api/admin/upload/delete/${fileName}`),
} 