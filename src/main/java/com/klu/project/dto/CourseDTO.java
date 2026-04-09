package com.klu.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {

    private Long id;
    private String title;
    private String description;
    private String category;
    private String level;
    private String duration;
    private Boolean published;
    private Long instructorId;
    private String instructorName;
    private LocalDateTime createdAt;
    private Long enrollmentCount;
}
