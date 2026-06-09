package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.Collaboration;

@Repository
public interface CollaborationRepo extends JpaRepository<Collaboration,Integer>{

	List<Collaboration> findByStudent_StudentId(Long studentId);
	
}
