package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klu.model.Student;
import com.klu.service.implementation.StudentImple;

@RestController
@RequestMapping("/student")
public class StudentController {
	
	@Autowired
	StudentImple studentService;
	
	@PostMapping("/create")
	public String create(@RequestParam String email,@RequestParam String name) {
		return studentService.CreateStudentByEmail(email, name);
	}
	@GetMapping("/getById/{id}")
	public Student getStudentById(@PathVariable long id) {
		return studentService.getStudentById(id);
	}
	@GetMapping("/getByEmail/{email}")
	public Student getStudentByEmail(@PathVariable String email) {
		return studentService.getStudentByEmail(email);
	
	}
	
}
