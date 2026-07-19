package com.klu.service;

import java.util.List;

import com.klu.dto.NotificationDto;
import com.klu.model.Student;

public interface NotificationService {

    void createNotification( Student recipient, Student actor, String notificationType, String referenceName);
    List<NotificationDto> getMyNotifications();
    long unreadCount();
    void markAsRead(Long notificationId);
	void markAllRead();
}