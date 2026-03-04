package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.CollabApplication;

@Repository
public interface CollabApplicationRepo extends JpaRepository<CollabApplication,Integer>{

}
