package com.klu.model;
import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="project")
public class Project {
	
	@Id		
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Integer projectId;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="studentId", nullable = false)
	private Student student;
	
	@JsonIgnore
	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
	private List<ProjectLikes> likes;
	
	@Transient
	public int getLikeCount() {
	    return likes == null ? 0 : likes.size();
	}
	
	private String projectName;
	private LocalDateTime submittedAt;
	
	@Pattern(
		    regexp = "^(https://)?(www\\.)?github\\.com/.*$",
		    message = "Must be a valid GitHub URL"
	)
	@Column(length=100, nullable = false)
	private String githubUrl;
	
	 @Column(columnDefinition = "TEXT")
	private String description;
	
	private String tech1;
	private String tech2;
	private String tech3;
	
}
