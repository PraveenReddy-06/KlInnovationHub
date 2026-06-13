package com.klu.service;

import com.klu.dto.SocialLinksRequest;
import com.klu.model.Student;

public interface StudentService {

	String CreateStudentByEmail(String email,String name);
	
	Student getStudentById(long id);
	Student getStudentByEmail(String email);
	Student updateSocialLinks(Long studentId,SocialLinksRequest request);
	
}
