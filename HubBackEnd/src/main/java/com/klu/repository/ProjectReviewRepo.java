package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.ProjectReview;
import com.klu.model.Reviewer;

@Repository
public interface ProjectReviewRepo extends JpaRepository<ProjectReview, Long> {
	List<ProjectReview> findByReviewerOrderByReviewedAtDesc(Reviewer reviewer);
}
