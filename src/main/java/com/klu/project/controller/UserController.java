package com.klu.project.controller;

import com.klu.project.dto.ApiResponse;
import com.klu.project.dto.UserDTO;
import com.klu.project.entity.User;
import com.klu.project.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(@AuthenticationPrincipal User user) {
        UserDTO profile = userService.getUserProfile(user.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody UserDTO userDTO) {
        UserDTO updated = userService.updateProfile(user.getId(), userDTO);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
