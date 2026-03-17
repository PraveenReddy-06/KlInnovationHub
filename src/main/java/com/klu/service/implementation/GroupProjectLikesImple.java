package com.klu.service.implementation;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.model.GroupProject;
import com.klu.repository.GroupProjectLikesRepo;
import com.klu.service.GroupProjectLikesService;

@Service
public class GroupProjectLikesImple implements GroupProjectLikesService{
 
 @Autowired
 GroupProjectLikesRepo GroupProjectLikesRepo;
 
 @Override
 public List<GroupProject> getTopGroupProjects() {
  
  return GroupProjectLikesRepo.findTop5ByOrderByLikesDesc();
 }
}