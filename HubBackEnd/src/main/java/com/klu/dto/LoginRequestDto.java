package com.klu.dto;

import com.klu.model.Student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginRequestDto {
	
	private String message;
	private Student student;
	private Long studentId;
	private String email;
	
}
