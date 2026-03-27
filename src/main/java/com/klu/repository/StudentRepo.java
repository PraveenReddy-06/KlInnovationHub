package com.klu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.Student;

@Repository
public interface StudentRepo extends JpaRepository<Student,Long>{

	Student findByStudentEmail(String studentEmail);
}
