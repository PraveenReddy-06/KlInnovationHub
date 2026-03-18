package com.klu.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

	@Id
	private Long studentId;

	@Column(unique = true)
	@Email(message = "Invalid Email Format")
	@Size(max = 26)
	private String studentEmail;

	@JsonIgnore
	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	List<Project> projectList;

	@JsonIgnore
	@OneToMany(mappedBy="teamLead", cascade=CascadeType.ALL)
	List<GroupProject> groupProjectLead;
	
	
	@JsonIgnore
	@ManyToMany(mappedBy = "studentList")
	List<GroupProject> groupProjects;

	@JsonIgnore
	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	List<Collaboration> collaborationList;

	@JsonIgnore
	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	List<CollabApplication> collabApplicationList;

	@JsonIgnore
	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	private List<ProjectLikes> likedProjects;

	private Integer year;
	private String branch;
	private String student_name;

}
