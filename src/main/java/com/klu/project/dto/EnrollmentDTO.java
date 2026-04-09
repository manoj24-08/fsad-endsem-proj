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
public class EnrollmentDTO {

    private Long id;
    private Long userId;
    private String userName;
    private Long courseId;
    private String courseTitle;
    private Double progress;
    private String grade;
    private LocalDateTime enrolledAt;
}
