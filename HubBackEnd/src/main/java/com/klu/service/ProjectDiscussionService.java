package com.klu.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.klu.dto.DiscussionContentDto;
import com.klu.dto.ProjectDiscussionDto;
import com.klu.dto.DiscussionReplyDto;

public interface ProjectDiscussionService {

    Page<ProjectDiscussionDto> getProjectDiscussions(Integer projectId, Pageable pageable);

    Page<ProjectDiscussionDto> getGroupProjectDiscussions(Integer groupProjectId, Pageable pageable);

    ProjectDiscussionDto createProjectDiscussion(Integer projectId, DiscussionContentDto request);

    ProjectDiscussionDto createGroupProjectDiscussion(Integer groupProjectId, DiscussionContentDto request);

    ProjectDiscussionDto updateDiscussion(Long discussionId, DiscussionContentDto request);

    void deleteDiscussion(Long discussionId);

    DiscussionReplyDto createReply(Long discussionId, DiscussionContentDto request);

    DiscussionReplyDto updateReply(Long replyId, DiscussionContentDto request);

    void deleteReply(Long replyId);
}
