package com.klu.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {

    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer maxScore;
    private Long courseId;
    private String courseTitle;
}
