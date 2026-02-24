package com.klu.model;

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
	private int collabApplication_id;
	
	@ManyToOne
	@JoinColumn(name="collaboration_id")
	private Collaboration collaboration;
	
	@ManyToOne
	@JoinColumn(name="student_id")
	private Student student;

}
