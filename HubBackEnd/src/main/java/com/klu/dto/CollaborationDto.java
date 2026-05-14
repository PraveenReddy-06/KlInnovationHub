package com.klu.dto;

import com.klu.model.Student;

import lombok.Data;

@Data
public class CollaborationDto {

	private Student student;
	private String name;
	
	private String problemStatement;
	private String description;
	
	private Integer teamSize;
	
	private String skill1;
	private String skill2;
	private String skill3;
	
	private Boolean status;
}
