package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.GroupProject;
import com.klu.model.GroupProjectLikes;

@Repository
public interface GroupProjectLikesRepo extends JpaRepository<GroupProjectLikes,Integer>{

 List<GroupProject> findTop5ByOrderByLikesDesc();
}