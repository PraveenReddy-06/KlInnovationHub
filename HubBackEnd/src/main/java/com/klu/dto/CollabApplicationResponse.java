package com.klu.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CollabApplicationResponse(
        @JsonProperty("collabApplication_id") Integer applicationId,
        String status,
        Team collaboration,
        Applicant student) {

    public record Team(@JsonProperty("collaboration_id") Integer collaborationId) {}

    public record Applicant(
            Long studentId,
            @JsonProperty("student_name") String studentName,
            String branch,
            Integer year) {}
}
