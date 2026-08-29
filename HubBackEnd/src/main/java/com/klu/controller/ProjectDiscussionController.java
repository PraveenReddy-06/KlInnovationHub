package com.klu.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.DiscussionContentDto;
import com.klu.dto.DiscussionReplyDto;
import com.klu.dto.DiscussionReportDto;
import com.klu.dto.ProjectDiscussionDto;
import com.klu.service.ProjectDiscussionService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/discussions")
public class ProjectDiscussionController {

    @Autowired
    private ProjectDiscussionService discussionService;

    @GetMapping("/project/{projectId}")
    public Page<ProjectDiscussionDto> getProjectDiscussions(
            @PathVariable Integer projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return discussionService.getProjectDiscussions(projectId, buildPageable(page, size, Sort.Direction.DESC));
    }

    @GetMapping("/group-project/{groupProjectId}")
    public Page<ProjectDiscussionDto> getGroupProjectDiscussions(
            @PathVariable Integer groupProjectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return discussionService.getGroupProjectDiscussions(groupProjectId, buildPageable(page, size, Sort.Direction.DESC));
    }

    @GetMapping("/{discussionId}/replies")
    public Page<DiscussionReplyDto> getReplies(
            @PathVariable Long discussionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return discussionService.getReplies(discussionId, buildPageable(page, size, Sort.Direction.ASC));
    }

    @PostMapping("/project/{projectId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDiscussionDto createProjectDiscussion(
            @PathVariable Integer projectId,
            @Valid @RequestBody DiscussionContentDto request) {
        return discussionService.createProjectDiscussion(projectId, request);
    }

    @PostMapping("/group-project/{groupProjectId}")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDiscussionDto createGroupProjectDiscussion(
            @PathVariable Integer groupProjectId,
            @Valid @RequestBody DiscussionContentDto request) {
        return discussionService.createGroupProjectDiscussion(groupProjectId, request);
    }

    @PutMapping("/{discussionId}")
    public ProjectDiscussionDto updateDiscussion(
            @PathVariable Long discussionId,
            @Valid @RequestBody DiscussionContentDto request) {
        return discussionService.updateDiscussion(discussionId, request);
    }

    @DeleteMapping("/{discussionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDiscussion(@PathVariable Long discussionId) {
        discussionService.deleteDiscussion(discussionId);
    }

    @PostMapping("/{discussionId}/replies")
    @ResponseStatus(HttpStatus.CREATED)
    public DiscussionReplyDto createReply(
            @PathVariable Long discussionId,
            @Valid @RequestBody DiscussionContentDto request) {
        return discussionService.createReply(discussionId, request);
    }

    @PutMapping("/replies/{replyId}")
    public DiscussionReplyDto updateReply(
            @PathVariable Long replyId,
            @Valid @RequestBody DiscussionContentDto request) {
        return discussionService.updateReply(replyId, request);
    }

    @DeleteMapping("/replies/{replyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReply(@PathVariable Long replyId) {
        discussionService.deleteReply(replyId);
    }

    @PostMapping("/{discussionId}/like")
    public long toggleDiscussionLike(@PathVariable Long discussionId) {
        return discussionService.toggleDiscussionLike(discussionId);
    }

    @PostMapping("/replies/{replyId}/like")
    public long toggleReplyLike(@PathVariable Long replyId) {
        return discussionService.toggleReplyLike(replyId);
    }

    @PostMapping("/{discussionId}/report")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reportDiscussion(
            @PathVariable Long discussionId,
            @Valid @RequestBody DiscussionReportDto request) {
        discussionService.reportDiscussion(discussionId, request);
    }

    @PostMapping("/replies/{replyId}/report")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reportReply(
            @PathVariable Long replyId,
            @Valid @RequestBody DiscussionReportDto request) {
        discussionService.reportReply(replyId, request);
    }
    
    @GetMapping("/counts")
    public Map<String, Long> getDiscussionCounts(
            @RequestParam(required = false) List<Integer> projectIds,
            @RequestParam(required = false) List<Integer> groupProjectIds) {
        return discussionService.getDiscussionCounts(projectIds, groupProjectIds);
    }

    private Pageable buildPageable(int page, int size, Sort.Direction direction) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 50);
        return PageRequest.of(safePage, safeSize, Sort.by(direction, "createdAt"));
    }
}
