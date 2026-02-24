package com.klu.service;

import com.klu.model.Student;

public interface StudentService {

	String CreateStudentByEmail(String email);
	
	Student getStudentById();
	Student getStudentByEmail();
	
}
