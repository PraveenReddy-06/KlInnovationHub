package com.klu.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscussionReplyDto {

    private Long replyId;
    private String authorName;
    private String authorRole;
    @Size(max = 300, message = "Reply content cannot exceed 300 characters")
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long likeCount;
    private boolean likedByCurrentUser;
    private boolean editableByCurrentUser;
}
