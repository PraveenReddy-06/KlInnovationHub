package com.klu.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
	private Integer collaboration_id;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="studentId", nullable = false)
	private Student student;
	
	@JsonIgnore
	@OneToMany(mappedBy="collaboration",cascade = CascadeType.ALL)
	List<CollabApplication> collabApplications;
	
	private String name;
	
	private String problemStatement;
	private String description;
	
	private Integer teamSize;
	
	private String skill1;
	private String skill2;
	private String skill3;
	
	private Boolean status;
	
}
