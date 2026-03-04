package com.klu.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

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
	private Long student_id;

	@Column(unique = true)
	@Email(message = "Invalid Email Format")
	@Size(max = 26)
	private String studentEmail;

	@OneToOne(mappedBy = "student", cascade = CascadeType.ALL)
	@JsonBackReference
	private Project project;

	@ManyToOne
	@JoinColumn(name = "group_project_id")
	@JsonBackReference
	private GroupProject groupProject;

	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	List<Collaboration> collaborationList;

	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	List<CollabApplication> collabApplicationList;

	@OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
	private List<ProjectLikes> likedProjects;

	private Integer year;
	private String branch;
	private String student_name;

}
