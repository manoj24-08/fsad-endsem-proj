package com.klu.project.controller;

import com.klu.project.dto.ApiResponse;
import com.klu.project.dto.AssignmentDTO;
import com.klu.project.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping("/api/admin/assignments")
    public ResponseEntity<ApiResponse<AssignmentDTO>> createAssignment(@RequestBody AssignmentDTO assignmentDTO) {
        AssignmentDTO created = assignmentService.createAssignment(assignmentDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Assignment created successfully", created));
    }

    @GetMapping("/api/courses/{id}/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentDTO>>> getAssignments(@PathVariable Long id) {
        List<AssignmentDTO> assignments = assignmentService.getAssignmentsByCourseId(id);
        return ResponseEntity.ok(ApiResponse.success("Assignments fetched successfully", assignments));
    }
}
