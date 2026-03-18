package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.GroupProject;
import com.klu.model.GroupProjectLikes;
import com.klu.model.Student;
import com.klu.repository.GroupProjectLikesRepo;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.GroupProjectLikesService;

import jakarta.transaction.Transactional;

@Service
public class GroupProjectLikesImple implements GroupProjectLikesService{
 
	 @Autowired
	 GroupProjectLikesRepo groupProjectLikesRepo;
	 	 
	 @Autowired
	 StudentRepo studentRepo;
	 
	 @Autowired
	 GroupProjectRepo groupPRepo;
	 
	 @Override
	 public List<GroupProject> getTopGroupProjects() {	  
	   return groupProjectLikesRepo.getTopGroupProjects();
	 }

	 @Transactional
	 @Override
	 public String toggleLike(Long studentId, Integer groupProjectId) {
		
		 if(groupProjectLikesRepo.existsByStudent_StudentIdAndGroupProject_GroupProjectId(studentId,groupProjectId)) {
			 groupProjectLikesRepo.deleteByStudent_StudentIdAndGroupProject_GroupProjectId(studentId,groupProjectId);
			 return "GroupProject UnLiked";
		 }
		 
		 GroupProjectLikes gp = new GroupProjectLikes();
		 Student s= studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student Not Found"));
		 GroupProject p= groupPRepo.findById(groupProjectId).orElseThrow(() -> new RuntimeException("Project Not Found"));
		 
		 gp.setStudent(s);
		 gp.setGroupProject(p);
		 groupProjectLikesRepo.save(gp);
		 
		 return "GroupProject Liked";
		
	 }
}