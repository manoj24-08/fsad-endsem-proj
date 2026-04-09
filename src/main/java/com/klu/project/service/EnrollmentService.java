package com.klu.project.service;

import com.klu.project.dto.EnrollmentDTO;
import com.klu.project.entity.Course;
import com.klu.project.entity.Enrollment;
import com.klu.project.entity.User;
import com.klu.project.exception.ResourceNotFoundException;
import com.klu.project.repository.CourseRepository;
import com.klu.project.repository.EnrollmentRepository;
import com.klu.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentDTO enrollInCourse(Long userId, Long courseId) {
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new IllegalArgumentException("You are already enrolled in this course");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .progress(0.0)
                .build();

        Enrollment saved = enrollmentRepository.save(enrollment);
        return mapToDTO(saved);
    }

    public List<EnrollmentDTO> getStudentEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EnrollmentDTO mapToDTO(Enrollment enrollment) {
        return EnrollmentDTO.builder()
                .id(enrollment.getId())
                .userId(enrollment.getUser().getId())
                .userName(enrollment.getUser().getName())
                .courseId(enrollment.getCourse().getId())
                .courseTitle(enrollment.getCourse().getTitle())
                .progress(enrollment.getProgress())
                .grade(enrollment.getGrade())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }
}
