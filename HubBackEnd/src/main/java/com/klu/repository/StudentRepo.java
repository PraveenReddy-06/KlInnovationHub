package com.klu.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import com.klu.model.Student;

import jakarta.persistence.LockModeType;

@Repository
public interface StudentRepo extends JpaRepository<Student,Long>{

	Student findByStudentEmail(String studentEmail);

	List<Student> findByInterestedDomain(String interestedDomain);

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	Optional<Student> findLockedByStudentId(Long studentId);
}
