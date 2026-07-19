package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.NotificationDto;

import com.klu.service.NotificationService;

@RestController
@RequestMapping("/notification")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<NotificationDto> getNotifications() {
        return notificationService.getMyNotifications();
    }

    @GetMapping("/unreadCount")
    public long unreadCount() {
        return notificationService.unreadCount();
    }

    @PutMapping("/read/{id}")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }
    
    @PutMapping("/readAll")
    public void markAllRead() {
        notificationService.markAllRead();
    }
}
