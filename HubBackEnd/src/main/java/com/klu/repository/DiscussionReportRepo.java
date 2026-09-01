package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.DiscussionReport;
import com.klu.model.DiscussionReportStatus;

@Repository
public interface DiscussionReportRepo extends JpaRepository<DiscussionReport, Long> {

    boolean existsByDiscussion_DiscussionIdAndReporter_Id(Long discussionId, Integer reporterId);

    boolean existsByReply_ReplyIdAndReporter_Id(Long replyId, Integer reporterId);
    List<DiscussionReport> findByStatusOrderByCreatedAtDesc(DiscussionReportStatus status);

    void deleteByDiscussion_DiscussionId(Long discussionId);

    void deleteByReply_ReplyId(Long replyId);
}
