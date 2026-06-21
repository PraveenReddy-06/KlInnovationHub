package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.CollabApplication;
import com.klu.model.Collaboration;
import com.klu.model.Student;
import com.klu.repository.CollabApplicationRepo;
import com.klu.repository.CollaborationRepo;
import com.klu.service.CollabApplicationService;
import com.klu.service.CurrentUserService;

@Service
public class CollabApplicationImple implements CollabApplicationService {

	@Autowired
	CollabApplicationRepo collabApplicationRepo;
	
	@Autowired 
	CurrentUserService currentUser;
	
	@Autowired
	CollaborationRepo collaborationRepo;
	
	@Override
	public String createCollabApplication(Integer collaborationId) {
	    Student currentStudent =currentUser.getCurrentStudent();
	    Collaboration collaboration =collaborationRepo.findById(collaborationId).orElseThrow( () -> new RuntimeException( "Team not found"));

	    CollabApplication app = new CollabApplication();

	    app.setCollaboration(collaboration);
	    app.setStudent(currentStudent);
	    app.setStatus("PENDING");

	    collabApplicationRepo.save(app);

	    return "Application Submitted";
	}

	@Override
	public List<CollabApplication> getAllCollabApplications() {
		return collabApplicationRepo.findAll();
	}

	@Override
	public List<CollabApplication> getMyApplications(Long studentId) {
		return collabApplicationRepo.findByStudent_StudentId(studentId);
	}	
	
	@Override
    public String updateApplicationStatus(Integer applicationId, String status) {
        CollabApplication app = collabApplicationRepo.findById(applicationId).orElseThrow(() -> new RuntimeException("Application not found"));
        long currentUserId =currentUser.getCurrentStudent().getStudentId();
        long teamOwnerId =app.getCollaboration().getStudent().getStudentId();
        if (teamOwnerId != currentUserId) {
            throw new RuntimeException("Not authorized");
        }
        app.setStatus(status.toUpperCase());
        collabApplicationRepo.save(app);
        return "Application status updated to " + status.toUpperCase();
    }

}
