package com.klu.dto;

public class GroupProjectLikeDto {

	private boolean liked;
	private int likeCount;
	
	public GroupProjectLikeDto(boolean liked, int likeCount) {
	    this.liked = liked;
	    this.likeCount = likeCount;
	}
	
	public boolean isLiked() { return liked; }
	public int getLikeCount() { return likeCount; }
}