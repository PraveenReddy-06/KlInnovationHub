package com.klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.klu.dto.DashboardStatsDTO;
import com.klu.service.implementation.DashboardStatsDtoService;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

	@Autowired
	private DashboardStatsDtoService statsService;
	
	@GetMapping("/stats")
	public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
	    return ResponseEntity.ok(statsService.getDashboardStats());
	}
}
