package com.klu.project.controller;

import com.klu.project.dto.ApiResponse;
import com.klu.project.dto.CourseDTO;
import com.klu.project.entity.User;
import com.klu.project.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // ==================== PUBLIC / AUTHENTICATED ENDPOINTS ====================

    @GetMapping("/api/courses")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> getAllCourses() {
        List<CourseDTO> courses = courseService.getAllCourses();
        return ResponseEntity.ok(ApiResponse.success("Courses fetched successfully", courses));
    }

    @GetMapping("/api/courses/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getCourseById(@PathVariable Long id) {
        CourseDTO course = courseService.getCourseById(id);
        return ResponseEntity.ok(ApiResponse.success("Course fetched successfully", course));
    }

    // ==================== ADMIN ENDPOINTS ====================

    @PostMapping("/api/admin/courses")
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(
            @RequestBody CourseDTO courseDTO,
            @AuthenticationPrincipal User user) {
        CourseDTO created = courseService.createCourse(courseDTO, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Course created successfully", created));
    }

    @PutMapping("/api/admin/courses/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseDTO courseDTO) {
        CourseDTO updated = courseService.updateCourse(id, courseDTO);
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updated));
    }

    @DeleteMapping("/api/admin/courses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully"));
    }

    @PutMapping("/api/admin/courses/{id}/publish")
    public ResponseEntity<ApiResponse<CourseDTO>> togglePublish(@PathVariable Long id) {
        CourseDTO course = courseService.togglePublish(id);
        String message = course.getPublished() ? "Course published successfully" : "Course unpublished successfully";
        return ResponseEntity.ok(ApiResponse.success(message, course));
    }
}
