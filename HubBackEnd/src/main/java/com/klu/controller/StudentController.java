package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.SocialLinksRequest;
import com.klu.model.Student;
import com.klu.repository.StudentRepo;
import com.klu.service.CurrentUserService;
import com.klu.service.implementation.StudentImple;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {
	
	@Autowired
	StudentImple studentService;
	
	@Autowired
	CurrentUserService currentUser;
	
	@Autowired
	StudentRepo studentRepo;
	
	/*@PostMapping("/create")
	public String create(@RequestParam String email,@RequestParam String name) {
		return studentService.CreateStudentByEmail(email, name);
	}*/
	@GetMapping("/getById/{id}")
	public Student getStudentById(@PathVariable long id) {
		return studentService.getStudentById(id);
	}
	@GetMapping("/getByEmail")
	public ResponseEntity<?> getStudent(@RequestParam String email) {
	    try {
	        return ResponseEntity.ok(
	            studentService.getStudentByEmail(email)
	        );
	    } catch (RuntimeException e) {
	        return ResponseEntity.status(404).body(e.getMessage());
	    }
	}
	
	@PutMapping("/socialLinks")
    public ResponseEntity<Student> updateSocialLinks(@RequestBody SocialLinksRequest request) {
		long studentId = currentUser.getCurrentStudent().getStudentId();
        Student updatedStudent = studentService.updateSocialLinks(studentId, request);
        return ResponseEntity.ok(updatedStudent);
    }
	
	@GetMapping("/exists/{studentId}")
	public ResponseEntity<Boolean> studentExists(@PathVariable Long studentId) {
	    return ResponseEntity.ok(studentRepo.existsById(studentId));
	}
	
	
}
