package com.klu.model;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="project")
public class Project {
	
	@Id		
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private int project_id;
	
	private String project_name;
	
	@Pattern(
		    regexp = "^(https://)?(www\\.)?github\\.com/.*$",
		    message = "Must be a valid GitHub URL"
	)
	@Column(length=100, nullable = false)
	private String github_url;
	
	private String description;
	
	private String tech1;
	private String tech2;
	private String tech3;
	
	private int upvotes;
	
	@OneToOne
	@JoinColumn(name="student_id", nullable = false, unique = true)
	@JsonManagedReference
	private Student student;
	
	@OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
	private List<ProjectLikes> likes;
	
	
}
