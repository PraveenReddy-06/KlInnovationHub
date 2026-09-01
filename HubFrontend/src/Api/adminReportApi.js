import adminAxiosInstance from "./adminAxiosInstance";

export const getPendingReports = async () => {
    const response = await adminAxiosInstance.get("/admin/reports");
    return response.data;
};

export const ignoreReport = async (reportId) => {
    const response = await adminAxiosInstance.post(
        `/admin/reports/${reportId}/ignore`
    );

    return response.data;
};

export const deleteReportedContent = async (reportId) => {
    const response = await adminAxiosInstance.delete(
        `/admin/reports/${reportId}/content`
    );

    return response.data;
};