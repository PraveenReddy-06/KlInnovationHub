package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Collaboration;
import com.klu.model.Student;
import com.klu.repository.CollaborationRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.CollaborationService;
import com.klu.service.CurrentUserService;

@Service
public class CollaborationImple implements CollaborationService{

	@Autowired 
	CollaborationRepo collaborationRepo;
	
	@Autowired
	StudentRepo studentRepo;
	
	@Autowired
	CurrentUserService currentUser;
	
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
	
	@Override
	public List<Collaboration> getMyTeams(Long studentId){
	    return collaborationRepo.findByStudent_StudentId(studentId);
	}
	
	@Override
	public void deleteTeam(Integer collaborationId) {
	    Collaboration collaboration = collaborationRepo.findById(collaborationId).orElseThrow(() -> new RuntimeException("Team not found"));
	    long currentUserId =currentUser.getCurrentStudent().getStudentId();
	        if (collaboration.getStudent().getStudentId()!= currentUserId) {
	            throw new RuntimeException(
	                "Not authorized"
	            );
	        }
	    collaborationRepo.delete(collaboration);
	}
}
