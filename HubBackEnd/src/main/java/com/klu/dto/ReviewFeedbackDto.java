package com.klu.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewFeedbackDto {

    @Size(max = 1000, message = "Feedback cannot exceed 1000 characters")
    private String feedback;
}
