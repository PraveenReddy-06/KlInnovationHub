package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Collaboration;
import com.klu.model.Student;
import com.klu.repository.CollaborationRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.CollaborationService;

@Service
public class CollaborationImple implements CollaborationService{

	@Autowired 
	CollaborationRepo collaborationRepo;
	
	@Autowired
	StudentRepo studentRepo;
	
	@Override
	public String CreateTeam(Collaboration collab, Long studentId) {
	    Student student = studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
	    collab.setStudent(student);
	    collaborationRepo.save(collab);
	    return "Collaboration Posted Successfully";
	}

	@Override
	public List<Collaboration> getAllCollaboration() {
		return collaborationRepo.findAll();
	}
}
