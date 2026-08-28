package com.klu.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.DiscussionReply;

@Repository
public interface DiscussionReplyRepo extends JpaRepository<DiscussionReply, Long> {

    Page<DiscussionReply> findByDiscussion_DiscussionIdOrderByCreatedAtAsc(Long discussionId, Pageable pageable);

    long countByDiscussion_DiscussionId(Long discussionId);

    void deleteByDiscussion_DiscussionId(Long discussionId);
}
