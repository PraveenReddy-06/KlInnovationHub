package com.klu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klu.model.Reviewer;
import com.klu.model.ReviewerStatus;

@Repository
public interface ReviewerRepo extends JpaRepository<Reviewer, Integer> {
    Optional<Reviewer> findByUserMail(String mail);
    Optional<Reviewer> findByUserMailAndStatus(String mail, ReviewerStatus status);
}
