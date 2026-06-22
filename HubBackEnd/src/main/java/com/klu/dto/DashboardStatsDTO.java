package com.klu.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
	

    private long projects;
    private long students;
    private long collaborations;
    private long likes;
}