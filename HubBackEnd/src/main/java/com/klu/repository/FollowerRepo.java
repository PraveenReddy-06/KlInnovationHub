package com.klu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klu.model.Follower;
import com.klu.model.Student;

import jakarta.transaction.Transactional;

public interface FollowerRepo extends JpaRepository<Follower, Long>{

    boolean existsByFollowerAndFollowing(Student follower,Student following);

    @Transactional
    void deleteByFollowerAndFollowing(  Student follower,   Student following);

    long countByFollowing(Student following);

    long countByFollower(Student follower);

    List<Follower> findByFollowing(Student following);

    List<Follower> findByFollower(Student follower);
}