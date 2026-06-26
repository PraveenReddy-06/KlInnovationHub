package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.ProjectLikeDto;
import com.klu.model.Project;
import com.klu.model.ProjectLikes;
import com.klu.model.Student;
import com.klu.repository.ProjectLikesRepo;
import com.klu.repository.ProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.ActivityService;
import com.klu.service.NotificationService;
import com.klu.service.ProjectLikesServic;

import jakarta.transaction.Transactional;

@Service
public class ProjectLikesImple implements ProjectLikesServic{

	@Autowired
	ProjectLikesRepo likesRepo;
	
	@Autowired
	StudentRepo studentRepo;
	
	@Autowired
	ProjectRepo projectRepo;
	
	@Autowired
	ActivityService activityService;
	
	@Autowired
	NotificationService notificationService;
	
	@Override
	public List<Project> getTopProjects() {		
		return likesRepo.getTopProjects();
	}

	@Transactional
	@Override
	public ProjectLikeDto toggleLike(Long studentId, Integer projectId) {
	    boolean liked;
	    if (likesRepo.existsByStudent_StudentIdAndProject_ProjectId(studentId, projectId)) {
	        likesRepo.deleteByStudent_StudentIdAndProject_ProjectId(studentId, projectId);
	        liked = false;
	    } else {
	        Student student = studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
	        Project project = projectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));

	        ProjectLikes like = new ProjectLikes();
	        like.setStudent(student);
	        like.setProject(project);
	        likesRepo.save(like);
	        if(!project.getStudent().getStudentId().equals(student.getStudentId())) {
	            notificationService.createNotification( project.getStudent(), student,"PROJECT_LIKED",project.getProjectName());
	        }
	        activityService.createActivity(student,"PROJECT_LIKED",project.getProjectName());

	        liked = true;
	    }

	    int likeCount = (int)likesRepo.countByProject_ProjectId(projectId);

	    return new ProjectLikeDto(liked, likeCount);
	}

	public List<Project> getTop3Projects() {
		return likesRepo.getTop3Projects();
	}

	public List<Project> getTop8Projects() {
		return likesRepo.getTop8Projects();
	}
	
}
