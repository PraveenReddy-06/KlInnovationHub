package com.klu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionReportDto {

    @NotBlank(message = "Report reason is required")
    @Size(max = 500, message = "Report reason must not exceed 500 characters")
    private String reason;
}
