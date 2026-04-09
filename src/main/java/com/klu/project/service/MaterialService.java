package com.klu.project.service;

import com.klu.project.dto.MaterialDTO;
import com.klu.project.entity.Material;
import com.klu.project.entity.Course;
import com.klu.project.exception.ResourceNotFoundException;
import com.klu.project.repository.MaterialRepository;
import com.klu.project.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;

    public MaterialDTO uploadMaterial(Long courseId, String title, String type, MultipartFile file) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", courseId));

        String fileUrl = fileStorageService.storeFile(file);

        Material material = Material.builder()
                .title(title)
                .fileUrl(fileUrl)
                .type(type)
                .course(course)
                .build();

        Material saved = materialRepository.save(material);
        return mapToDTO(saved);
    }

    public List<MaterialDTO> getMaterialsByCourseId(Long courseId) {
        return materialRepository.findByCourseId(courseId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private MaterialDTO mapToDTO(Material material) {
        return MaterialDTO.builder()
                .id(material.getId())
                .title(material.getTitle())
                .fileUrl(material.getFileUrl())
                .type(material.getType())
                .courseId(material.getCourse().getId())
                .courseTitle(material.getCourse().getTitle())
                .build();
    }
}
