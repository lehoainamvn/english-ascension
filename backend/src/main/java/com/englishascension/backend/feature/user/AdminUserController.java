package com.englishascension.backend.feature.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;

    public AdminUserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** GET /api/admin/users - Danh sách người dùng */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    /** PUT /api/admin/users/{id} - Cập nhật thông số học viên & vai trò (Role) */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("exp")) user.setExp((Integer) request.get("exp"));
        if (request.containsKey("level")) user.setLevel((Integer) request.get("level"));
        if (request.containsKey("coins")) user.setCoins((Integer) request.get("coins"));
        if (request.containsKey("characterTitle")) user.setCharacterTitle((String) request.get("characterTitle"));
        
        if (request.containsKey("role")) {
            String roleStr = (String) request.get("role");
            try {
                Role role = Role.valueOf(roleStr);
                user.setRole(role);
            } catch (IllegalArgumentException ignored) {}
        }

        User updated = userRepository.save(user);
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/admin/users/{id} - Xóa tài khoản người dùng */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Không cho phép tự xóa tài khoản của chính mình (admin đang đăng nhập)
        // (Đây là biện pháp bảo mật căn bản)
        
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
