package com.klu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.Reviewer;

@Repository
public interface ReviewerRepo extends JpaRepository<Reviewer, Integer> {
    Optional<Reviewer> findByUserMail(String mail);
}
