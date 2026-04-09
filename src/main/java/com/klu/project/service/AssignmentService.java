package com.klu.project.service;

import com.klu.project.dto.AssignmentDTO;
import com.klu.project.entity.Assignment;
import com.klu.project.entity.Course;
import com.klu.project.exception.ResourceNotFoundException;
import com.klu.project.repository.AssignmentRepository;
import com.klu.project.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public AssignmentDTO createAssignment(AssignmentDTO assignmentDTO) {
        Course course = courseRepository.findById(assignmentDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", assignmentDTO.getCourseId()));

        Assignment assignment = Assignment.builder()
                .title(assignmentDTO.getTitle())
                .description(assignmentDTO.getDescription())
                .dueDate(assignmentDTO.getDueDate())
                .maxScore(assignmentDTO.getMaxScore())
                .course(course)
                .build();

        Assignment saved = assignmentRepository.save(assignment);
        return mapToDTO(saved);
    }

    public List<AssignmentDTO> getAssignmentsByCourseId(Long courseId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private AssignmentDTO mapToDTO(Assignment assignment) {
        return AssignmentDTO.builder()
                .id(assignment.getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .maxScore(assignment.getMaxScore())
                .courseId(assignment.getCourse().getId())
                .courseTitle(assignment.getCourse().getTitle())
                .build();
    }
}
