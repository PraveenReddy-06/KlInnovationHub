package com.klu.dto;

public class ProjectLikeDto {
    private boolean liked;
    private int likeCount;

    public ProjectLikeDto(boolean liked, int likeCount) {
        this.liked = liked;
        this.likeCount = likeCount;
    }

    public boolean isLiked() { return liked; }
    public int getLikeCount() { return likeCount; }
}