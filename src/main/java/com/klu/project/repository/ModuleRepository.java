package com.klu.project.repository;

import com.klu.project.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {

    List<Module> findByCourseIdOrderByOrderIndexAsc(Long courseId);
}
