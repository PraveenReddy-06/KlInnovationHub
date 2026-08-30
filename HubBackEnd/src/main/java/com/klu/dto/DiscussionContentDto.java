package com.klu.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionContentDto {

    @NotBlank(message = "Content is required")
    @Size(max = 300, message = "Content must not exceed 300 characters")
    private String content;
}
