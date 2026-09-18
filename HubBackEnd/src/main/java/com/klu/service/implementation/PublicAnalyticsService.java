package com.klu.service.implementation;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.PublicAnalyticsDto;
import com.klu.model.ProjectStatus;
import com.klu.repository.GroupProjectLikesRepo;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.ProjectLikesRepo;
import com.klu.repository.ProjectRepo;
import com.klu.repository.ReviewerRepo;
import com.klu.repository.StudentRepo;

@Service
public class PublicAnalyticsService {

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private ProjectRepo projectRepo;

    @Autowired
    private GroupProjectRepo groupProjectRepo;

    @Autowired
    private ReviewerRepo reviewerRepo;

    @Autowired
    private ProjectLikesRepo projectLikesRepo;

    @Autowired
    private GroupProjectLikesRepo groupProjectLikesRepo;

    public PublicAnalyticsDto getAnalytics() {
        long soloProjects = projectRepo.count();
        long groupProjects = groupProjectRepo.count();

        long approvedSolo = projectRepo.countByStatus(ProjectStatus.APPROVED);
        long approvedGroup = groupProjectRepo.countByStatus(ProjectStatus.APPROVED);

        long pendingSolo = projectRepo.countByStatus(ProjectStatus.PENDING_REVIEW);
        long pendingGroup = groupProjectRepo.countByStatus(ProjectStatus.PENDING_REVIEW);

        long rejectedSolo = projectRepo.countByStatus(ProjectStatus.REJECTED);
        long rejectedGroup = groupProjectRepo.countByStatus(ProjectStatus.REJECTED);

        return new PublicAnalyticsDto(
                studentRepo.count(),
                soloProjects + groupProjects,
                soloProjects,
                groupProjects,
                approvedSolo + approvedGroup,
                pendingSolo + pendingGroup,
                rejectedSolo + rejectedGroup,
                reviewerRepo.count(),
                projectLikesRepo.count() + groupProjectLikesRepo.count(),
                buildDomainCounts()
        );
    }

    private Map<String, Long> buildDomainCounts() {
        Map<String, Long> counts = new LinkedHashMap<>();

        projectRepo.countApprovedByChoice().forEach(row ->
                addDomainCount(counts, row[0], row[1]));

        groupProjectRepo.countApprovedByChoice().forEach(row ->
                addDomainCount(counts, row[0], row[1]));

        return counts;
    }

    private void addDomainCount(Map<String, Long> counts, Object choice, Object count) {
        String domain = choice == null || choice.toString().isBlank()
                ? "Other"
                : choice.toString();

        long value = ((Number) count).longValue();
        counts.merge(domain, value, Long::sum);
    }
}
