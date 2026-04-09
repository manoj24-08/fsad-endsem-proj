package com.klu.project.controller;

import com.klu.project.dto.ApiResponse;
import com.klu.project.dto.SubmissionDTO;
import com.klu.project.entity.User;
import com.klu.project.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/api/student/submissions")
    public ResponseEntity<ApiResponse<SubmissionDTO>> submitAssignment(
            @RequestParam("assignmentId") Long assignmentId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal User user) {
        SubmissionDTO submission = submissionService.submitAssignment(assignmentId, user.getId(), file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment submitted successfully", submission));
    }

    @GetMapping("/api/admin/submissions")
    public ResponseEntity<ApiResponse<List<SubmissionDTO>>> getAllSubmissions() {
        List<SubmissionDTO> submissions = submissionService.getAllSubmissions();
        return ResponseEntity.ok(ApiResponse.success("Submissions fetched successfully", submissions));
    }

    @PutMapping("/api/admin/submissions/{id}/grade")
    public ResponseEntity<ApiResponse<SubmissionDTO>> gradeSubmission(
            @PathVariable Long id,
            @RequestBody Map<String, Object> gradeData) {
        Integer score = (Integer) gradeData.get("score");
        String feedback = (String) gradeData.get("feedback");
        SubmissionDTO graded = submissionService.gradeSubmission(id, score, feedback);
        return ResponseEntity.ok(ApiResponse.success("Submission graded successfully", graded));
    }
}
