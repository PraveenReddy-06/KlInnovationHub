package com.klu.service.implementation;

import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klu.repository.GroupProjectLikesRepo;
import com.klu.repository.ProjectLikesRepo;
import com.klu.model.Project;
import com.klu.model.Student;
import com.klu.model.GroupProject;
import com.klu.dto.LeaderboardDTO;

@Service
public class LeaderboardService {

    @Autowired
    private ProjectLikesRepo projectLikesRepo;

    @Autowired
    private GroupProjectLikesRepo groupProjectLikesRepo;

    public List<LeaderboardDTO> getLeaderboard() {
        List<LeaderboardDTO> result = new ArrayList<>();
        List<Project> soloProjects =projectLikesRepo.getAllProjectsByLikes();
        for(Project p : soloProjects){
            LeaderboardDTO dto = new LeaderboardDTO();
            dto.setType("SOLO");
            dto.setProjectName(p.getProjectName());
            dto.setLikeCount(p.getLikeCount());
            dto.setStudentName(p.getStudent().getStudent_name());
            dto.setStudentId(String.valueOf(p.getStudent().getStudentId()));
            dto.setBranch(p.getStudent().getBranch());
            dto.setGithubUrl(p.getGithubUrl());
            dto.setLiveUrl(p.getLiveUrl());
            result.add(dto);
        }
        List<GroupProject> groupProjects =groupProjectLikesRepo.getAllProjectsByLikes();

        for(GroupProject gp : groupProjects){
        	LeaderboardDTO dto = new LeaderboardDTO();
        	dto.setType("GROUP");
        	dto.setProjectName(gp.getProject_name());
        	dto.setLikeCount(gp.getLikeCount());
        	dto.setGithubUrl(gp.getGithubUrl());
        	dto.setLiveUrl(gp.getLiveUrl());
        	dto.setTeamLeadId(gp.getTeamLead().getStudentId());

        	List<String> members =gp.getStudentList() != null &&!gp.getStudentList().isEmpty()
        	        ? gp.getStudentList().stream().map(Student::getStudent_name).toList()
        	        : List.of(gp.getTeamLead().getStudent_name());
        	dto.setMembers(members);
        	dto.setTeamLead(gp.getTeamLead() != null? gp.getTeamLead().getStudent_name(): "N/A");

        	dto.setTeamSize(members.size());
            result.add(dto);
        }

        result.sort((a,b) ->Integer.compare(b.getLikeCount(),a.getLikeCount()));

        return result;
    }
}