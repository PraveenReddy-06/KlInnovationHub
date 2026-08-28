package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.DiscussionReply;

@Repository
public interface DiscussionReplyRepo extends JpaRepository<DiscussionReply, Long> {

    List<DiscussionReply> findByDiscussion_DiscussionIdOrderByCreatedAtAsc(Long discussionId);

    long countByDiscussion_DiscussionId(Long discussionId);
}
