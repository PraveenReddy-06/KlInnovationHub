package com.klu.model;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="GroupProject")
public class GroupProject {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int groupProjectId;
	
	private String project_name;
	private LocalDateTime submittedAt;
	
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
	
	@OneToMany(mappedBy="groupProject",cascade = CascadeType.ALL)
	@JsonManagedReference
	List<Student> studentList;
	
	

}
