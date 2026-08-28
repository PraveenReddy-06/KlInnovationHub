package com.klu.model;

import java.time.LocalDateTime;

import com.klu.mail.UserSignUp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "discussion_report")
public class DiscussionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "discussion_id")
    private ProjectDiscussion discussion;

    @ManyToOne
    @JoinColumn(name = "reply_id")
    private DiscussionReply reply;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private UserSignUp reporter;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
