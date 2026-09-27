package com.klu.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewFeedbackDto {

    @Size(max = 250, message = "Feedback cannot exceed 250 characters")
    private String feedback;
}
