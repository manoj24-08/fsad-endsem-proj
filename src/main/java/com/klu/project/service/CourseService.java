package com.klu.project.service;

import com.klu.project.dto.CourseDTO;
import com.klu.project.entity.Course;
import com.klu.project.entity.User;
import com.klu.project.exception.ResourceNotFoundException;
import com.klu.project.repository.CourseRepository;
import com.klu.project.repository.EnrollmentRepository;
import com.klu.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseDTO createCourse(CourseDTO courseDTO, Long instructorId) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", instructorId));

        Course course = Course.builder()
                .title(courseDTO.getTitle())
                .description(courseDTO.getDescription())
                .category(courseDTO.getCategory())
                .level(courseDTO.getLevel())
                .duration(courseDTO.getDuration())
                .published(false)
                .instructor(instructor)
                .build();

        Course saved = courseRepository.save(course);
        return mapToDTO(saved);
    }

    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> getPublishedCourses() {
        return courseRepository.findByPublishedTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return mapToDTO(course);
    }

    public CourseDTO updateCourse(Long id, CourseDTO courseDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        if (courseDTO.getTitle() != null) course.setTitle(courseDTO.getTitle());
        if (courseDTO.getDescription() != null) course.setDescription(courseDTO.getDescription());
        if (courseDTO.getCategory() != null) course.setCategory(courseDTO.getCategory());
        if (courseDTO.getLevel() != null) course.setLevel(courseDTO.getLevel());
        if (courseDTO.getDuration() != null) course.setDuration(courseDTO.getDuration());

        Course updated = courseRepository.save(course);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        courseRepository.delete(course);
    }

    public CourseDTO togglePublish(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        course.setPublished(!course.getPublished());
        Course updated = courseRepository.save(course);
        return mapToDTO(updated);
    }

    private CourseDTO mapToDTO(Course course) {
        long enrollmentCount = enrollmentRepository.countByCourseId(course.getId());
        return CourseDTO.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .category(course.getCategory())
                .level(course.getLevel())
                .duration(course.getDuration())
                .published(course.getPublished())
                .instructorId(course.getInstructor() != null ? course.getInstructor().getId() : null)
                .instructorName(course.getInstructor() != null ? course.getInstructor().getName() : null)
                .createdAt(course.getCreatedAt())
                .enrollmentCount(enrollmentCount)
                .build();
    }
}
