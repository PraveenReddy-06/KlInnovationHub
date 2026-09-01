package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klu.dto.AdminDiscussionReportDto;
import com.klu.model.DiscussionReport;
import com.klu.model.DiscussionReportStatus;
import com.klu.model.DiscussionReply;
import com.klu.model.ProjectDiscussion;
import com.klu.repository.DiscussionReplyRepo;
import com.klu.repository.DiscussionReportRepo;
import com.klu.repository.ProjectDiscussionRepo;

@Service
@Transactional
public class AdminDiscussionReportService {

    @Autowired
    private DiscussionReportRepo reportRepo;
    @Autowired
    private ProjectDiscussionRepo discussionRepo;
    @Autowired
    private DiscussionReplyRepo replyRepo;

    @Transactional(readOnly = true)
    public List<AdminDiscussionReportDto> getPendingReports() {
        return reportRepo
                .findByStatusOrderByCreatedAtDesc(DiscussionReportStatus.PENDING)
                .stream().map(this::toDto).toList();
    }

    public String ignoreReport(Long reportId) {
        DiscussionReport report = getReport(reportId);
        if (report.getStatus() != DiscussionReportStatus.PENDING) {
            return "This report has already been processed";
        }
        report.setStatus(DiscussionReportStatus.IGNORED);
        reportRepo.save(report);
        return "Report ignored successfully";
    }

    public String deleteReportedContent(Long reportId) {
        DiscussionReport report = getReport(reportId);
        if (report.getStatus() != DiscussionReportStatus.PENDING) {
            return "This report has already been processed";
        }
        if (report.getDiscussion() != null) {
            ProjectDiscussion discussion = report.getDiscussion();
            discussionRepo.delete(discussion);
            report.setDiscussion(null);
            report.setStatus(DiscussionReportStatus.ACTIONED);
            reportRepo.save(report);
            return "Discussion deleted successfully";
        }
        if (report.getReply() != null) {
            DiscussionReply reply = report.getReply();
            replyRepo.delete(reply);
            report.setReply(null);
            report.setStatus(DiscussionReportStatus.ACTIONED);
            reportRepo.save(report);
            return "Reply deleted successfully";
        }
        throw new RuntimeException("Reported content not found");
    }

    private DiscussionReport getReport(Long reportId) {
        return reportRepo.findById(reportId).orElseThrow(() ->
                        new RuntimeException("Report not found"));
    }

    private AdminDiscussionReportDto toDto(DiscussionReport report) {
        if (report.getDiscussion() != null) {
            ProjectDiscussion discussion = report.getDiscussion();
            return new AdminDiscussionReportDto(
                    report.getReportId(),
                    "DISCUSSION",
                    discussion.getDiscussionId(),
                    discussion.getContent(),
                    discussion.getAuthor().getName(),
                    discussion.getAuthor().getMail(),
                    report.getReporter().getName(),
                    report.getReporter().getMail(),
                    report.getReason(),
                    report.getCreatedAt()
            );
        }
        if (report.getReply() != null) {
            DiscussionReply reply = report.getReply();
            return new AdminDiscussionReportDto(
                    report.getReportId(),
                    "REPLY",
                    reply.getReplyId(),
                    reply.getContent(),
                    reply.getAuthor().getName(),
                    reply.getAuthor().getMail(),
                    report.getReporter().getName(),
                    report.getReporter().getMail(),
                    report.getReason(),
                    report.getCreatedAt()
            );
        }
        throw new RuntimeException("Report has no reported content");
    }
}