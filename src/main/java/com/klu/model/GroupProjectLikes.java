package com.klu.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;

@Entity
@Table(
    name = "GroupProject_likes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"studentId", "project_id"})
)
@Data
public class GroupProjectLikes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private Integer likes=0;
    
    @ManyToOne
    @JoinColumn(name = "studentId", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private GroupProject groupProject;
       
}