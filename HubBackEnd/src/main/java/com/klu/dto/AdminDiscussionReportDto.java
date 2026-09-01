package com.klu.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDiscussionReportDto {

    private Long reportId;
    private String type;
    private Long contentId;
    private String content;
    private String authorName;
    private String authorEmail;
    private String reporterName;
    private String reporterEmail;
    private String reason;

    private LocalDateTime createdAt;
}