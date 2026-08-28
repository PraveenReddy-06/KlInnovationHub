package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.DiscussionReport;

@Repository
public interface DiscussionReportRepo extends JpaRepository<DiscussionReport, Long> {

    boolean existsByDiscussion_DiscussionIdAndReporter_Id(Long discussionId, Integer reporterId);

    boolean existsByReply_ReplyIdAndReporter_Id(Long replyId, Integer reporterId);

    void deleteByDiscussion_DiscussionId(Long discussionId);

    void deleteByReply_ReplyId(Long replyId);
}
