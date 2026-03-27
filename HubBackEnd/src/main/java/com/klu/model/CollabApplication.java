 package com.klu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="collabApplication")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CollabApplication {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer collabApplication_id;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="collaboration_id")
	private Collaboration collaboration;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="studentId")
	private Student student;

}
