package com.klu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.ReviewerRequest;
import com.klu.model.ReviewerRequestStatus;

@Repository
public interface ReviewerRequestRepo extends JpaRepository<ReviewerRequest, Integer> {
    Optional<ReviewerRequest> findTopByUserIdOrderByCreatedAtDesc(Integer userId);
    List<ReviewerRequest> findByStatusOrderByCreatedAtDesc(ReviewerRequestStatus status);
}
