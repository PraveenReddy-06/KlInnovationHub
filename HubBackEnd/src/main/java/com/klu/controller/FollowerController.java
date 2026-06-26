package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.klu.dto.FollowUserDto;
import com.klu.service.FollowerService;

@RestController
@RequestMapping("/followers")
@CrossOrigin(origins = "http://localhost:5173")
public class FollowerController {

    @Autowired
    private FollowerService followerService;

    @PostMapping("/follow/{studentId}")
    public String follow(@PathVariable Long studentId) {
        return followerService.follow(studentId);
    }

    @DeleteMapping("/unfollow/{studentId}")
    public String unfollow(@PathVariable Long studentId) {
        return followerService.unfollow(studentId);
    }

    @GetMapping("/count/{studentId}")
    public long followersCount( @PathVariable Long studentId) {
        return followerService.followersCount(studentId);
    }

    @GetMapping("/followingCount/{studentId}")
    public long followingCount(@PathVariable Long studentId) {
        return followerService.followingCount(studentId);
    }

    @GetMapping("/list/{studentId}")
    public List<FollowUserDto> followers(@PathVariable Long studentId ) {
        return followerService.followers(studentId);
    }

    @GetMapping("/following/{studentId}")
    public List<FollowUserDto> following(@PathVariable Long studentId) {
        return followerService.following(studentId);
    }

    @GetMapping("/isFollowing/{studentId}")
    public boolean isFollowing( @PathVariable Long studentId) {
        return followerService.isFollowing(studentId);
    }
}