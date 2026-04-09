package com.klu.project.controller;

import com.klu.project.dto.ApiResponse;
import com.klu.project.dto.MaterialDTO;
import com.klu.project.service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping("/api/admin/materials/upload")
    public ResponseEntity<ApiResponse<MaterialDTO>> uploadMaterial(
            @RequestParam("courseId") Long courseId,
            @RequestParam("title") String title,
            @RequestParam(value = "type", defaultValue = "document") String type,
            @RequestParam("file") MultipartFile file) {
        MaterialDTO material = materialService.uploadMaterial(courseId, title, type, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Material uploaded successfully", material));
    }

    @GetMapping("/api/courses/{id}/materials")
    public ResponseEntity<ApiResponse<List<MaterialDTO>>> getMaterials(@PathVariable Long id) {
        List<MaterialDTO> materials = materialService.getMaterialsByCourseId(id);
        return ResponseEntity.ok(ApiResponse.success("Materials fetched successfully", materials));
    }
}
