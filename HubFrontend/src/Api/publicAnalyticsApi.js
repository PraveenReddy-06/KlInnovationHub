import axios from "axios";

const publicAnalyticsApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getPublicAnalytics = async () => {
  const response = await publicAnalyticsApi.get("/public/analytics");
  return response.data;
};
