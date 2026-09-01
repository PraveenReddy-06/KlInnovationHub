package com.klu.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.dto.AdminDiscussionReportDto;
import com.klu.service.implementation.AdminDiscussionReportService;

@RestController
@RequestMapping("/admin/reports")
public class AdminDiscussionReportController {

    @Autowired
    private AdminDiscussionReportService reportService;

    @GetMapping
    public ResponseEntity<List<AdminDiscussionReportDto>> getPendingReports() {
        return ResponseEntity.ok(
                reportService.getPendingReports()
        );
    }

    @PostMapping("/{reportId}/ignore")
    public ResponseEntity<String> ignoreReport(@PathVariable Long reportId) {
        return ResponseEntity.ok(
                reportService.ignoreReport(reportId)
        );
    }

    @DeleteMapping("/{reportId}/content")
    public ResponseEntity<String> deleteReportedContent(@PathVariable Long reportId) {
        return ResponseEntity.ok(
                reportService.deleteReportedContent(reportId)
        );
    }
}