package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.ReplyLike;

@Repository
public interface ReplyLikeRepo extends JpaRepository<ReplyLike, Long> {

    boolean existsByReply_ReplyIdAndAuthor_Id(Long replyId, Integer authorId);

    void deleteByReply_ReplyIdAndAuthor_Id(Long replyId, Integer authorId);

    long countByReply_ReplyId(Long replyId);
}
