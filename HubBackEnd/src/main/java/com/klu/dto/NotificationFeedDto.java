package com.klu.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationFeedDto {

    private List<NotificationDto> personal;
    private List<ActivityDto> global;
}