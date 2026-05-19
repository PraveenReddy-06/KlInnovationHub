package com.klu.model;

import java.time.LocalDateTime;
import jakarta.persistence.JoinColumn;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	/*private LocalDateTime submittedAt;*/
	
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
	
	@Transient
	public int getLikeCount() {
	    return likes == null ? 0 : likes.size();
	}
	

	@ManyToOne
	@JoinColumn(name="teamLead")
	private Student teamLead;
	
	private String choice;
	private String tech1;
	private String tech2;
	private String tech3;

}
