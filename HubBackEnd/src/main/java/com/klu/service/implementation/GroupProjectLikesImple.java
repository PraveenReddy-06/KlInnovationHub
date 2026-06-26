package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.GroupProjectLikeDto;
import com.klu.model.GroupProject;
import com.klu.model.GroupProjectLikes;
import com.klu.model.Project;
import com.klu.model.Student;
import com.klu.repository.GroupProjectLikesRepo;
import com.klu.repository.GroupProjectRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.ActivityService;
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
	 
	@Autowired
	ActivityService activityService;
	 
	 @Override
	 public List<GroupProject> getTopGroupProjects() {	  
	   return groupProjectLikesRepo.getTopGroupProjects();
	 }

	 @Transactional
	 @Override
	 public GroupProjectLikeDto toggleLike(Long studentId, Integer groupProjectId) {
		boolean liked;
		 if(groupProjectLikesRepo.existsByStudent_StudentIdAndGroupProject_GroupProjectId(studentId,groupProjectId)) {
			 groupProjectLikesRepo.deleteByStudent_StudentIdAndGroupProject_GroupProjectId(studentId,groupProjectId);
			 liked = false;
		 } else {
			 Student s= studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student Not Found"));
			 GroupProject p= groupPRepo.findById(groupProjectId).orElseThrow(() -> new RuntimeException("Project Not Found"));
			 
			 GroupProjectLikes like = new GroupProjectLikes();
			 like.setStudent(s);
			 like.setGroupProject(p);
			 groupProjectLikesRepo.save(like);
			 activityService.createActivity(s,"GROUP_PROJECT_LIKED",p.getProject_name());
			 
			 liked=true;
		 }
		 int likeCount = (int)groupProjectLikesRepo.countByGroupProject_GroupProjectId(groupProjectId);	 
		 
		 return new GroupProjectLikeDto(liked,likeCount);
		
	 }

	 public List<GroupProject> getTop8Projects() {
		 return groupProjectLikesRepo.getTop8Projects();
	 }
}