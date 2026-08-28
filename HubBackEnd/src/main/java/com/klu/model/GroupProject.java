package com.klu.model;

import jakarta.persistence.JoinColumn;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Formula;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="groupProject")
public class GroupProject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer groupProjectId;

    private String project_name;

    @ManyToMany
    @JoinTable(name = "group_project_students",joinColumns = @JoinColumn(name = "group_project_id"),inverseJoinColumns = @JoinColumn(name = "student_id"))
    List<Student> studentList;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Pattern(regexp = "^(https://)?(www\\.)?github\\.com/.*$", message = "Must be a valid GitHub URL")
    @Column(length=100, nullable = false)
    private String githubUrl;
    private String liveUrl;

    @OneToMany(mappedBy = "groupProject", cascade = CascadeType.ALL)
    private List<GroupProjectLikes> likes;

    @JsonIgnore
    @OneToMany(mappedBy = "groupProject", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectDiscussion> discussions;

    @Transient
    public int getLikeCount() { return likes == null ? 0 : likes.size(); }

    @Formula("(select count(*) from project_discussion pd where pd.group_project_id = groupProjectId)")
    private long discussionCount;

    @ManyToOne
    @JoinColumn(name="teamLead")
    private Student teamLead;

    private String choice;
    private String tech1;
    private String tech2;
    private String tech3;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "enum('PENDING_REVIEW','APPROVED','REJECTED') default 'APPROVED'")
    private ProjectStatus status;
}
