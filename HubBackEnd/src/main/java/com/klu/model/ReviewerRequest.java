package com.klu.model;

import java.time.LocalDateTime;

import com.klu.mail.UserSignUp;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviewer_request")
public class ReviewerRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserSignUp user;

    private String department;

    private String designation;

    private String reason;

    @Enumerated(EnumType.STRING)
    private ReviewerRequestStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime reviewedAt;
}
