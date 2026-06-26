package com.klu.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "notification")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    private Student recipient;

    @ManyToOne
    @JoinColumn(name = "actor_id", nullable = false)
    private Student actor;
    private String notificationType;
    private String referenceName;
    private Boolean isRead = false;
    private LocalDateTime createdAt;
}