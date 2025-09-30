import axiosInstance from "@/lib/axios";

export const dashboardAPI = {
  getDashboardData: () => axiosInstance.get("/api/admin/dashboard"),
};
