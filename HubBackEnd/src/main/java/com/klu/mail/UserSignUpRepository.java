package com.klu.mail;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSignUpRepository extends JpaRepository<UserSignUp,Integer>{

	Optional<UserSignUp> findByMail(String mail);
}
