package com.klu.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.dto.FollowUserDto;
import com.klu.model.Follower;
import com.klu.model.Student;
import com.klu.repository.FollowerRepo;
import com.klu.repository.StudentRepo;
import com.klu.service.CurrentUserService;
import com.klu.service.FollowerService;

@Service
public class FollowerImple implements FollowerService {

    @Autowired
    private FollowerRepo followerRepo;

    @Autowired
    private StudentRepo studentRepo;

    @Autowired
    private CurrentUserService currentUser;

    @Override
    public String follow(Long followingId) {
        Student follower = currentUser.getCurrentStudent();
        Student following = studentRepo.findById(followingId).orElseThrow(() -> new RuntimeException("Student not found"));
        if(follower.getStudentId().equals(followingId)) {
            throw new RuntimeException("You cannot follow yourself");
        }
        if(followerRepo.existsByFollowerAndFollowing(follower, following)) {
            throw new RuntimeException("Already following");
        }
        Follower relation = new Follower();
        relation.setFollower(follower);
        relation.setFollowing(following);
        followerRepo.save(relation);
        return "Followed successfully";
    }

    @Override
    public String unfollow(Long followingId) {
        Student follower = currentUser.getCurrentStudent();
        Student following = studentRepo.findById(followingId).orElseThrow(() -> new RuntimeException("Student not found"));
        followerRepo.deleteByFollowerAndFollowing(follower,following);
        return "Unfollowed successfully";
    }

    @Override
    public long followersCount(Long studentId) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        return followerRepo.countByFollowing(student);
    }

    @Override
    public long followingCount(Long studentId) {
        Student student = studentRepo.findById(studentId) .orElseThrow();
        return followerRepo.countByFollower(student);
    }

    @Override
    public boolean isFollowing(Long followingId) {
        Student follower = currentUser.getCurrentStudent();
        Student following = studentRepo.findById(followingId) .orElseThrow();
        return followerRepo.existsByFollowerAndFollowing(follower, following);
    }

    @Override
    public List<FollowUserDto> followers(Long studentId) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        return followerRepo.findByFollowing(student)
                .stream()
                .map(f -> new FollowUserDto(
                        f.getFollower().getStudentId(),
                        f.getFollower().getStudent_name(),
                        f.getFollower().getAvatarUrl(),
                        f.getFollower().getBranch(),
                        f.getFollower().getYear()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public List<FollowUserDto> following(Long studentId) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        return followerRepo.findByFollower(student)
                .stream()
                .map(f -> new FollowUserDto(
                        f.getFollowing().getStudentId(),
                        f.getFollowing().getStudent_name(),
                        f.getFollowing().getAvatarUrl(),
                        f.getFollowing().getBranch(),
                        f.getFollower().getYear()
                ))
                .collect(Collectors.toList());
    }
}