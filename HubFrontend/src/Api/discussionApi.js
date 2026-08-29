import discussionAxiosInstance from "./discussionAxiosInstance";

export const getDiscussions = (projectType, projectId, page = 0, size = 10) =>
  discussionAxiosInstance.get(
    projectType === "GROUP"
      ? `/discussions/group-project/${projectId}`
      : `/discussions/project/${projectId}`,
    { params: { page, size } }
  );

export const createDiscussion = (projectType, projectId, content) =>
  discussionAxiosInstance.post(
    projectType === "GROUP"
      ? `/discussions/group-project/${projectId}`
      : `/discussions/project/${projectId}`,
    { content }
  );

export const getReplies = (discussionId, page = 0, size = 20) =>
  discussionAxiosInstance.get(`/discussions/${discussionId}/replies`, {
    params: { page, size },
  });

export const createReply = (discussionId, content) =>
  discussionAxiosInstance.post(`/discussions/${discussionId}/replies`, { content });

export const updateDiscussion = (discussionId, content) =>
  discussionAxiosInstance.put(`/discussions/${discussionId}`, { content });

export const deleteDiscussion = (discussionId) =>
  discussionAxiosInstance.delete(`/discussions/${discussionId}`);

export const updateReply = (replyId, content) =>
  discussionAxiosInstance.put(`/discussions/replies/${replyId}`, { content });

export const deleteReply = (replyId) =>
  discussionAxiosInstance.delete(`/discussions/replies/${replyId}`);

export const toggleDiscussionLike = (discussionId) =>
  discussionAxiosInstance.post(`/discussions/${discussionId}/like`);

export const toggleReplyLike = (replyId) =>
  discussionAxiosInstance.post(`/discussions/replies/${replyId}/like`);

export const reportDiscussion = (discussionId, reason) =>
  discussionAxiosInstance.post(`/discussions/${discussionId}/report`, { reason });

export const reportReply = (replyId, reason) =>
  discussionAxiosInstance.post(`/discussions/replies/${replyId}/report`, { reason });

export const getDiscussionCounts = (projectIds = [], groupProjectIds = []) =>
  discussionAxiosInstance.get("/discussions/counts", {
    params: {
      projectIds: projectIds.length ? projectIds.join(",") : undefined,
      groupProjectIds: groupProjectIds.length ? groupProjectIds.join(",") : undefined,
    },
  });
