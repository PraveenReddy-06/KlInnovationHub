package com.klu.repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klu.model.ProjectReview;
import com.klu.model.Reviewer;

@Repository
public interface ProjectReviewRepo extends JpaRepository<ProjectReview, Long> {
	List<ProjectReview> findByReviewerOrderByReviewedAtDesc(Reviewer reviewer);
	
	@Query("""
		    SELECT r.reviewer.user.name, COUNT(r.reviewId)
		    FROM ProjectReview r
		    GROUP BY r.reviewer.reviewerId, r.reviewer.user.name
		    ORDER BY COUNT(r.reviewId) DESC
		""")
	List<Object[]> findTopFacultyReviewers(Pageable pageable);
}
