package com.klu.project.service;

import com.klu.project.dto.SubmissionDTO;
import com.klu.project.entity.Assignment;
import com.klu.project.entity.Submission;
import com.klu.project.entity.User;
import com.klu.project.enums.SubmissionStatus;
import com.klu.project.exception.ResourceNotFoundException;
import com.klu.project.repository.AssignmentRepository;
import com.klu.project.repository.SubmissionRepository;
import com.klu.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public SubmissionDTO submitAssignment(Long assignmentId, Long studentId, MultipartFile file) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment", "id", assignmentId));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", studentId));

        String fileUrl = (file != null && !file.isEmpty()) ? fileStorageService.storeFile(file) : null;

        Submission submission = Submission.builder()
                .assignment(assignment)
                .student(student)
                .fileUrl(fileUrl)
                .status(SubmissionStatus.SUBMITTED)
                .build();

        Submission saved = submissionRepository.save(submission);
        return mapToDTO(saved);
    }

    public List<SubmissionDTO> getAllSubmissions() {
        return submissionRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<SubmissionDTO> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public SubmissionDTO gradeSubmission(Long submissionId, Integer score, String feedback) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission", "id", submissionId));

        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setStatus(SubmissionStatus.GRADED);

        Submission updated = submissionRepository.save(submission);
        return mapToDTO(updated);
    }

    private SubmissionDTO mapToDTO(Submission submission) {
        return SubmissionDTO.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .assignmentTitle(submission.getAssignment().getTitle())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getName())
                .fileUrl(submission.getFileUrl())
                .score(submission.getScore())
                .feedback(submission.getFeedback())
                .status(submission.getStatus().name())
                .submittedAt(submission.getSubmittedAt())
                .build();
    }
}
