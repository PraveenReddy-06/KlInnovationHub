package com.klu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "followers",  uniqueConstraints = @UniqueConstraint( columnNames = {"follower_id","following_id"}))
@Data
public class Follower {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "follower_id", nullable = false)
    private Student follower;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "following_id", nullable = false)
    private Student following;
}