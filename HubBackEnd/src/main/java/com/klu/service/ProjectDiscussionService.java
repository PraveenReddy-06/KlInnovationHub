package com.klu.service;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.klu.dto.DiscussionContentDto;
import com.klu.dto.DiscussionReplyDto;
import com.klu.dto.DiscussionReportDto;
import com.klu.dto.ProjectDiscussionDto;

public interface ProjectDiscussionService {

    Page<ProjectDiscussionDto> getProjectDiscussions(Integer projectId, Pageable pageable);

    Page<ProjectDiscussionDto> getGroupProjectDiscussions(Integer groupProjectId, Pageable pageable);

    ProjectDiscussionDto createProjectDiscussion(Integer projectId, DiscussionContentDto request);

    ProjectDiscussionDto createGroupProjectDiscussion(Integer groupProjectId, DiscussionContentDto request);

    ProjectDiscussionDto updateDiscussion(Long discussionId, DiscussionContentDto request);

    void deleteDiscussion(Long discussionId);

    Page<DiscussionReplyDto> getReplies(Long discussionId, Pageable pageable);

    DiscussionReplyDto createReply(Long discussionId, DiscussionContentDto request);

    DiscussionReplyDto updateReply(Long replyId, DiscussionContentDto request);

    void deleteReply(Long replyId);

    long toggleDiscussionLike(Long discussionId);

    long toggleReplyLike(Long replyId);

    void reportDiscussion(Long discussionId, DiscussionReportDto request);

    void reportReply(Long replyId, DiscussionReportDto request);
    
    Map<String, Long> getDiscussionCounts(List<Integer> projectIds, List<Integer> groupProjectIds);
}
