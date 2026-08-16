package com.klu.model;

import com.klu.mail.UserSignUp;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviewer")
public class Reviewer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer reviewerId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserSignUp user;

    private String department;

    private String designation;

    @Enumerated(EnumType.STRING)
    private ReviewerStatus status;
}
