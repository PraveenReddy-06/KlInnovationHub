package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.ProjectReview;

@Repository
public interface ProjectReviewRepo extends JpaRepository<ProjectReview, Long> {
}
