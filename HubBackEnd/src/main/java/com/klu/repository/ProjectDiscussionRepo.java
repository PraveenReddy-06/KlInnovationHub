package com.klu.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.klu.model.ProjectDiscussion;

@Repository
public interface ProjectDiscussionRepo extends JpaRepository<ProjectDiscussion, Long> {

    Page<ProjectDiscussion> findByProject_ProjectIdOrderByCreatedAtDesc(Integer projectId, Pageable pageable);

    Page<ProjectDiscussion> findByGroupProject_GroupProjectIdOrderByCreatedAtDesc(Integer groupProjectId, Pageable pageable);

    long countByProject_ProjectId(Integer projectId);

    long countByGroupProject_GroupProjectId(Integer groupProjectId);

    @Query("select d from ProjectDiscussion d where d.discussionId = :discussionId")
    ProjectDiscussion findDiscussion(@Param("discussionId") Long discussionId);
}
