package com.klu.service.implementation;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.dto.DiscussionContentDto;
import com.klu.dto.DiscussionReplyDto;
import com.klu.dto.DiscussionReportDto;
import com.klu.dto.ProjectDiscussionDto;
import com.klu.mail.UserSignUp;
import com.klu.mail.UserSignUpRepository;
import com.klu.model.DiscussionLike;
import com.klu.model.DiscussionReply;
import com.klu.model.DiscussionReport;
import com.klu.model.GroupProject;
import com.klu.model.Project;
import com.klu.model.ProjectDiscussion;
import com.klu.model.ProjectStatus;
import com.klu.model.ReplyLike;
import com.klu.repository.DiscussionLikeRepo;
import com.klu.repository.DiscussionReplyRepo;
import com.klu.repository.DiscussionReportRepo;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.ProjectDiscussionRepo;
import com.klu.repository.ProjectRepo;
import com.klu.repository.ReplyLikeRepo;
import com.klu.service.ProjectDiscussionService;

@Service
@Transactional
public class ProjectDiscussionImple implements ProjectDiscussionService {

    @Autowired private ProjectDiscussionRepo discussionRepo;
    @Autowired private DiscussionReplyRepo replyRepo;
    @Autowired private DiscussionLikeRepo discussionLikeRepo;
    @Autowired private ReplyLikeRepo replyLikeRepo;
    @Autowired private DiscussionReportRepo reportRepo;
    @Autowired private ProjectRepo projectRepo;
    @Autowired private GroupProjectRepo groupProjectRepo;
    @Autowired private UserSignUpRepository userSignUpRepo;

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectDiscussionDto> getProjectDiscussions(Integer projectId, Pageable pageable) {
        ensureApprovedProject(projectId);
        return discussionRepo.findByProject_ProjectIdOrderByCreatedAtDesc(projectId, pageable).map(this::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProjectDiscussionDto> getGroupProjectDiscussions(Integer groupProjectId, Pageable pageable) {
        ensureApprovedGroupProject(groupProjectId);
        return discussionRepo.findByGroupProject_GroupProjectIdOrderByCreatedAtDesc(groupProjectId, pageable).map(this::toDto);
    }

    @Override
    public ProjectDiscussionDto createProjectDiscussion(Integer projectId, DiscussionContentDto request) {
        return saveDiscussion(ensureApprovedProject(projectId), null, request);
    }

    @Override
    public ProjectDiscussionDto createGroupProjectDiscussion(Integer groupProjectId, DiscussionContentDto request) {
        return saveDiscussion(null, ensureApprovedGroupProject(groupProjectId), request);
    }

    private ProjectDiscussionDto saveDiscussion(Project project, GroupProject groupProject, DiscussionContentDto request) {
        ProjectDiscussion discussion = new ProjectDiscussion();
        discussion.setProject(project);
        discussion.setGroupProject(groupProject);
        discussion.setAuthor(getCurrentAccount());
        discussion.setContent(request.getContent().trim());
        discussion.setCreatedAt(LocalDateTime.now());
        discussion.setUpdatedAt(LocalDateTime.now());
        return toDto(discussionRepo.save(discussion));
    }

    @Override
    public ProjectDiscussionDto updateDiscussion(Long discussionId, DiscussionContentDto request) {
        ProjectDiscussion discussion = getDiscussion(discussionId);
        ensureDiscussionProjectIsApproved(discussion);
        ensureAuthor(discussion.getAuthor());
        discussion.setContent(request.getContent().trim());
        discussion.setUpdatedAt(LocalDateTime.now());
        return toDto(discussionRepo.save(discussion));
    }

    @Override
    public void deleteDiscussion(Long discussionId) {
        ProjectDiscussion discussion = getDiscussion(discussionId);
        ensureDiscussionProjectIsApproved(discussion);
        ensureAuthor(discussion.getAuthor());
        replyLikeRepo.deleteAll(replyLikeRepo.findAll().stream().filter(like -> like.getReply().getDiscussion().getDiscussionId().equals(discussionId)).toList());
        replyRepo.deleteAll(replyRepo.findByDiscussion_DiscussionIdOrderByCreatedAtAsc(discussionId));
        discussionLikeRepo.deleteAll(discussionLikeRepo.findAll().stream().filter(like -> like.getDiscussion().getDiscussionId().equals(discussionId)).toList());
        reportRepo.deleteAll(reportRepo.findAll().stream().filter(report -> report.getDiscussion() != null && report.getDiscussion().getDiscussionId().equals(discussionId)).toList());
        discussionRepo.delete(discussion);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DiscussionReplyDto> getReplies(Long discussionId, Pageable pageable) {
        ProjectDiscussion discussion = getDiscussion(discussionId);
        ensureDiscussionProjectIsApproved(discussion);
        var replies = replyRepo.findByDiscussion_DiscussionIdOrderByCreatedAtAsc(discussionId);
        var page = replies.stream().skip(pageable.getOffset()).limit(pageable.getPageSize()).map(this::toReplyDto).toList();
        return new org.springframework.data.domain.PageImpl<>(page, pageable, replies.size());
    }

    @Override
    public DiscussionReplyDto createReply(Long discussionId, DiscussionContentDto request) {
        ProjectDiscussion discussion = getDiscussion(discussionId);
        ensureDiscussionProjectIsApproved(discussion);
        DiscussionReply reply = new DiscussionReply();
        reply.setDiscussion(discussion);
        reply.setAuthor(getCurrentAccount());
        reply.setContent(request.getContent().trim());
        reply.setCreatedAt(LocalDateTime.now());
        reply.setUpdatedAt(LocalDateTime.now());
        return toReplyDto(replyRepo.save(reply));
    }

    @Override
    public DiscussionReplyDto updateReply(Long replyId, DiscussionContentDto request) {
        DiscussionReply reply = replyRepo.findById(replyId).orElseThrow(() -> new RuntimeException("Reply not found"));
        ensureDiscussionProjectIsApproved(reply.getDiscussion());
        ensureAuthor(reply.getAuthor());
        reply.setContent(request.getContent().trim());
        reply.setUpdatedAt(LocalDateTime.now());
        return toReplyDto(replyRepo.save(reply));
    }

    @Override
    public void deleteReply(Long replyId) {
        DiscussionReply reply = replyRepo.findById(replyId).orElseThrow(() -> new RuntimeException("Reply not found"));
        ensureDiscussionProjectIsApproved(reply.getDiscussion());
        ensureAuthor(reply.getAuthor());
        replyLikeRepo.deleteAll(replyLikeRepo.findAll().stream().filter(like -> like.getReply().getReplyId().equals(replyId)).toList());
        reportRepo.deleteAll(reportRepo.findAll().stream().filter(report -> report.getReply() != null && report.getReply().getReplyId().equals(replyId)).toList());
        replyRepo.delete(reply);
    }

    @Override
    public long toggleDiscussionLike(Long discussionId) {
        ProjectDiscussion discussion = getDiscussion(discussionId);
        ensureDiscussionProjectIsApproved(discussion);
        UserSignUp current = getCurrentAccount();
        if (discussionLikeRepo.existsByDiscussion_DiscussionIdAndAuthor_Id(discussionId, current.getId())) {
            discussionLikeRepo.deleteByDiscussion_DiscussionIdAndAuthor_Id(discussionId, current.getId());
        } else {
            DiscussionLike like = new DiscussionLike();
            like.setDiscussion(discussion);
            like.setAuthor(current);
            discussionLikeRepo.save(like);
        }
        return discussionLikeRepo.countByDiscussion_DiscussionId(discussionId);
    }

    @Override
    public long toggleReplyLike(Long replyId) {
        DiscussionReply reply = replyRepo.findById(replyId).orElseThrow(() -> new RuntimeException("Reply not found"));
        ensureDiscussionProjectIsApproved(reply.getDiscussion());
        UserSignUp current = getCurrentAccount();
        if (replyLikeRepo.existsByReply_ReplyIdAndAuthor_Id(replyId, current.getId())) {
            replyLikeRepo.deleteByReply_ReplyIdAndAuthor_Id(replyId, current.getId());
        } else {
            ReplyLike like = new ReplyLike();
            like.setReply(reply);
            like.setAuthor(current);
            replyLikeRepo.save(like);
        }
        return replyLikeRepo.countByReply_ReplyId(replyId);
    }

    @Override
    public void reportDiscussion(Long discussionId, DiscussionReportDto request) {
        ProjectDiscussion discussion = getDiscussion(discussionId);
        ensureDiscussionProjectIsApproved(discussion);
        UserSignUp current = getCurrentAccount();
        if (reportRepo.existsByDiscussion_DiscussionIdAndReporter_Id(discussionId, current.getId())) throw new RuntimeException("You have already reported this discussion");
        DiscussionReport report = new DiscussionReport();
        report.setDiscussion(discussion);
        report.setReporter(current);
        report.setReason(request.getReason().trim());
        report.setCreatedAt(LocalDateTime.now());
        reportRepo.save(report);
    }

    @Override
    public void reportReply(Long replyId, DiscussionReportDto request) {
        DiscussionReply reply = replyRepo.findById(replyId).orElseThrow(() -> new RuntimeException("Reply not found"));
        ensureDiscussionProjectIsApproved(reply.getDiscussion());
        UserSignUp current = getCurrentAccount();
        if (reportRepo.existsByReply_ReplyIdAndReporter_Id(replyId, current.getId())) throw new RuntimeException("You have already reported this reply");
        DiscussionReport report = new DiscussionReport();
        report.setReply(reply);
        report.setReporter(current);
        report.setReason(request.getReason().trim());
        report.setCreatedAt(LocalDateTime.now());
        reportRepo.save(report);
    }

    private ProjectDiscussion getDiscussion(Long discussionId) {
        return discussionRepo.findById(discussionId).orElseThrow(() -> new RuntimeException("Discussion not found"));
    }

    private Project ensureApprovedProject(Integer projectId) {
        Project project = projectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        if (project.getStatus() != ProjectStatus.APPROVED) throw new RuntimeException("Discussion is available only for approved projects");
        return project;
    }

    private GroupProject ensureApprovedGroupProject(Integer groupProjectId) {
        GroupProject project = groupProjectRepo.findById(groupProjectId).orElseThrow(() -> new RuntimeException("Group project not found"));
        if (project.getStatus() != ProjectStatus.APPROVED) throw new RuntimeException("Discussion is available only for approved projects");
        return project;
    }

    private void ensureDiscussionProjectIsApproved(ProjectDiscussion discussion) {
        if (discussion.getProject() != null) {
            ensureApprovedProject(discussion.getProject().getProjectId());
            return;
        }
        if (discussion.getGroupProject() != null) {
            ensureApprovedGroupProject(discussion.getGroupProject().getGroupProjectId());
            return;
        }
        throw new RuntimeException("Discussion is not linked to a project");
    }

    private UserSignUp getCurrentAccount() {
        UserSignUp account = getCurrentAccountOrNull();
        if (account == null) throw new RuntimeException("User is not authenticated");
        return account;
    }

    private UserSignUp getCurrentAccountOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || auth.getName().isBlank() || "anonymousUser".equals(auth.getName())) return null;
        return userSignUpRepo.findByMail(auth.getName()).orElse(null);
    }

    private boolean isCurrentAuthor(UserSignUp author) {
        UserSignUp current = getCurrentAccountOrNull();
        return current != null && author.getId().equals(current.getId());
    }

    private void ensureAuthor(UserSignUp author) {
        if (!isCurrentAuthor(author)) throw new RuntimeException("Not authorized");
    }

    private ProjectDiscussionDto toDto(ProjectDiscussion discussion) {
        UserSignUp current = getCurrentAccountOrNull();
        Integer currentId = current == null ? null : current.getId();
        return new ProjectDiscussionDto(
                discussion.getDiscussionId(),
                discussion.getAuthor().getName(),
                discussion.getAuthor().getRole(),
                discussion.getContent(),
                discussion.getCreatedAt(),
                discussion.getUpdatedAt(),
                replyRepo.countByDiscussion_DiscussionId(discussion.getDiscussionId()),
                discussionLikeRepo.countByDiscussion_DiscussionId(discussion.getDiscussionId()),
                currentId != null && discussionLikeRepo.existsByDiscussion_DiscussionIdAndAuthor_Id(discussion.getDiscussionId(), currentId),
                isCurrentAuthor(discussion.getAuthor()));
    }

    private DiscussionReplyDto toReplyDto(DiscussionReply reply) {
        UserSignUp current = getCurrentAccountOrNull();
        Integer currentId = current == null ? null : current.getId();
        return new DiscussionReplyDto(
                reply.getReplyId(),
                reply.getAuthor().getName(),
                reply.getAuthor().getRole(),
                reply.getContent(),
                reply.getCreatedAt(),
                reply.getUpdatedAt(),
                replyLikeRepo.countByReply_ReplyId(reply.getReplyId()),
                currentId != null && replyLikeRepo.existsByReply_ReplyIdAndAuthor_Id(reply.getReplyId(), currentId),
                isCurrentAuthor(reply.getAuthor()));
    }
}
