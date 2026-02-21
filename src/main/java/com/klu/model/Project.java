package com.klu.model;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
	
	private int likes;
	private int upvotes;
	
	@OneToOne
	@JoinColumn(name="student_id")
	private Student student;
	
	
}
