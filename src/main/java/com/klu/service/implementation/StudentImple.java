package com.klu.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Student;
import com.klu.repository.StudentRepo;
import com.klu.service.StudentService;

@Service
public class StudentImple implements StudentService{

	@Autowired
	StudentRepo studentRepo; 
	
	
	@Override
	public String CreateStudentByEmail(String email,String name) {
		Student s = new Student();
		
		s.setStudent_id(Long.parseLong("email.substring(0,10)"));
		s.setYear(2000+Integer.parseInt("email.substring(0,1)"));
		s.setStudent_name(name);
		s.setStudentEmail(email);
		s.setBranch("cse");
		studentRepo.save(s);
		
		return "Student Created Sucessfully";
	}
	
	@Override
	public Student getStudentById(long id) {
		
		return studentRepo.findById(id).orElseThrow(() -> new RuntimeException("Student Not found"));
	}

	@Override
	public Student getStudentByEmail(String email) {

		return studentRepo.findByStudentEmail(email);
	}

}
