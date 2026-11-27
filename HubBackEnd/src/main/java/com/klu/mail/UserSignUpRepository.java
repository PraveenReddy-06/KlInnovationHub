package com.klu.mail;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import org.springframework.stereotype.Repository;

@Repository
public interface UserSignUpRepository extends JpaRepository<UserSignUp,Integer>{

	Optional<UserSignUp> findByMail(String mail);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select account from UserSignUp account where account.mail = :mail")
    Optional<UserSignUp> findByMailForUpdate(@Param("mail") String mail);
}
