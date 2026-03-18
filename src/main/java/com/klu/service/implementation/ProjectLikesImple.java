package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.Project;
import com.klu.model.ProjectLikes;
import com.klu.model.Student;
import com.klu.repository.ProjectLikesRepo;
import com.klu.repository.ProjectRepo;
import com.klu.repository.StudentRepo;
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
	
	
	@Override
	public List<Project> getTopProjects() {		
		return likesRepo.getTopProjects();
	}

	@Transactional
	@Override
	public String toggleLike(Long studentId,Integer projectId) {
		
		if(likesRepo.existsByStudent_StudentIdAndProject_ProjectId(studentId,projectId)) {
			likesRepo.deleteByStudent_StudentIdAndProject_ProjectId(studentId,projectId);
			return "Project Unliked";
		}
		
		Student student = studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        Project project = projectRepo.findById(projectId).orElseThrow(() -> new RuntimeException("Project not found"));
        ProjectLikes like = new ProjectLikes();
        like.setStudent(student);
        like.setProject(project);
        likesRepo.save(like);
        return "Project liked";
	}	
	
	
}
