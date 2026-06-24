package com.englishascension.backend.feature.user.controller;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin REST controller for user management – HTTP layer only.
 * All business logic is delegated to {@link UserService}.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    /** GET /api/admin/users – Danh sách người dùng */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    /** PUT /api/admin/users/{id} – Cập nhật thông số học viên & vai trò */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                           @RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    /** DELETE /api/admin/users/{id} – Xóa tài khoản người dùng */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
