package com.klu.project.service;

import com.klu.project.dto.UserDTO;
import com.klu.project.entity.User;
import com.klu.project.exception.ResourceNotFoundException;
import com.klu.project.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToDTO(user);
    }

    public UserDTO updateProfile(Long userId, UserDTO userDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (userDTO.getName() != null && !userDTO.getName().isBlank()) {
            user.setName(userDTO.getName());
        }
        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            // Check if the new email is already taken by another user
            userRepository.findByEmail(userDTO.getEmail()).ifPresent(existing -> {
                if (!existing.getId().equals(userId)) {
                    throw new IllegalArgumentException("Email already taken by another user");
                }
            });
            user.setEmail(userDTO.getEmail());
        }

        User updated = userRepository.save(user);
        return mapToDTO(updated);
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
