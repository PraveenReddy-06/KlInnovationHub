package com.klu.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="collaboration")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Collaboration {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int collaboration_id;
	
	@ManyToOne
	@JoinColumn(name="studentId", nullable = false)
	private Student student;
	
	@OneToMany(mappedBy="collaboration",cascade = CascadeType.ALL)
	List<CollabApplication> collabApplications;
	
	private String name;
	
	private String ProblemStatement;
	private String description;
	
	private int teamSize;
	
	private String skill1;
	private String skill2;
	private String skill3;
	
	private boolean status;
	
}
