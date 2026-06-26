package com.klu.service.implementation;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.NotificationDto;
import com.klu.model.Notification;
import com.klu.model.Student;
import com.klu.repository.NotificationRepo;
import com.klu.service.CurrentUserService;
import com.klu.service.NotificationService;

@Service
public class NotificationImple implements NotificationService {

    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private CurrentUserService currentUser;

    
    @Override
    public void createNotification(Student recipient, Student actor, String notificationType,String referenceName) {

        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setNotificationType(notificationType);
        notification.setReferenceName(referenceName);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepo.save(notification);
    }

    @Override
    public List<NotificationDto>getMyNotifications() {
        Student current =currentUser.getCurrentStudent();
        return notificationRepo.findTop20ByRecipientOrderByCreatedAtDesc(current).stream()
                .map(n -> new NotificationDto(
                        n.getId(),
                        n.getActor().getStudentId(),
                        n.getActor().getStudent_name(),
                        n.getActor().getAvatarUrl(),
                        n.getNotificationType(),
                        n.getReferenceName(),
                        n.getIsRead(),
                        n.getCreatedAt()
                )).collect(Collectors.toList());
    }


    @Override
    public long unreadCount() {
        Student current = currentUser.getCurrentStudent();
        return notificationRepo.countByRecipientAndIsReadFalse(current);
    }

    @Override
    public void markAsRead(Long notificationId) {

        Notification notification =notificationRepo.findById(notificationId) .orElseThrow();
        if (!notification.getRecipient().getStudentId().equals(currentUser.getCurrentStudent().getStudentId())) {
            throw new RuntimeException( "Not authorized");
        }
        notification.setIsRead(true);
        notificationRepo.save(notification);
    }
    
    @Override
    public void markAllRead() {
        Student current = currentUser.getCurrentStudent();
        List<Notification> notifications =notificationRepo.findByRecipient(current);
        notifications.forEach(n -> n.setIsRead(true));
        notificationRepo.saveAll(notifications);
    }
}