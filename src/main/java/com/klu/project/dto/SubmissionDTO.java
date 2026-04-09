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
public class SubmissionDTO {

    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private Long studentId;
    private String studentName;
    private String fileUrl;
    private Integer score;
    private String feedback;
    private String status;
    private LocalDateTime submittedAt;
}
