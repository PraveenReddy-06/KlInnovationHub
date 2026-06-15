package com.klu.dto;

import java.util.List;
import lombok.Data;

@Data
public class LeaderboardDTO {

    private String type;

    private String projectName;

    private int likeCount;

    private String studentName;
    private String studentId;
    private String branch;

    private List<String> members;

    private String teamLead;
    private Long teamLeadId;
    private Integer teamSize;
    private String githubUrl;
    private String liveUrl;
}