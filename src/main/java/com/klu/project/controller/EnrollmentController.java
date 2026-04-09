package com.klu.project.controller;

import com.klu.project.dto.ApiResponse;
import com.klu.project.dto.EnrollmentDTO;
import com.klu.project.entity.User;
import com.klu.project.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/api/courses/{id}/enroll")
    public ResponseEntity<ApiResponse<EnrollmentDTO>> enroll(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        EnrollmentDTO enrollment = enrollmentService.enrollInCourse(user.getId(), id);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Enrolled successfully", enrollment));
    }

    @GetMapping("/api/student/enrollments")
    public ResponseEntity<ApiResponse<List<EnrollmentDTO>>> getMyEnrollments(
            @AuthenticationPrincipal User user) {
        List<EnrollmentDTO> enrollments = enrollmentService.getStudentEnrollments(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Enrollments fetched successfully", enrollments));
    }
}
