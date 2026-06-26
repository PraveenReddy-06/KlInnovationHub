package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.Notification;
import com.klu.model.Student;

public interface NotificationRepo extends JpaRepository<Notification, Long> {

    List<Notification>
    findTop20ByRecipientOrderByCreatedAtDesc(Student recipient);

    long countByRecipientAndIsReadFalse(Student recipient);
}