package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.DiscussionLike;

@Repository
public interface DiscussionLikeRepo extends JpaRepository<DiscussionLike, Long> {

    boolean existsByDiscussion_DiscussionIdAndAuthor_Id(Long discussionId, Integer authorId);

    void deleteByDiscussion_DiscussionIdAndAuthor_Id(Long discussionId, Integer authorId);

    void deleteByDiscussion_DiscussionId(Long discussionId);

    long countByDiscussion_DiscussionId(Long discussionId);
}
