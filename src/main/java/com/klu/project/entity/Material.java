package com.klu.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "file_url")
    private String fileUrl;

    private String type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
