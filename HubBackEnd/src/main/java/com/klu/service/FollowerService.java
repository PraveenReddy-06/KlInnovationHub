package com.klu.service;

import java.util.List;

import com.klu.dto.FollowUserDto;

public interface FollowerService {

    String follow(Long followingId);

    String unfollow(Long followingId);

    long followersCount(Long studentId);

    long followingCount(Long studentId);

    List<FollowUserDto> followers(Long studentId);

    List<FollowUserDto> following(Long studentId);

    boolean isFollowing(Long followingId);
}