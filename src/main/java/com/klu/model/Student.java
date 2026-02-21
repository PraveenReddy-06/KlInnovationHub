package com.klu.model;

import jakarta.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="student")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
	
	@Id
	private int student_id;
	
	@Column(unique=true)
	@Email(message="Invalid Email Format")
	@Size(max=26)
	private String student_email;
	
	@OneToOne(mappedBy="student", cascade = CascadeType.ALL)
	private Project project;
	
	@ManyToOne
	@JoinColumn(name="group_project")
	private GroupProject groupProject;
	
	
	private Integer year;
	private String student_name;
	
	
}
