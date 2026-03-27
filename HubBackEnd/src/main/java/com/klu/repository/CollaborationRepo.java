package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.Collaboration;

@Repository
public interface CollaborationRepo extends JpaRepository<Collaboration,Integer>{
	
}
