package com.klu.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationDto {

    private Long id;
    private Long actorId;
    private String actorName;
    private String actorAvatar;
    private String notificationType;
    private String referenceName;
    private Boolean isRead;
    private LocalDateTime createdAt;
}