package com.englishascension.backend.feature.auth.controller;

import com.englishascension.backend.feature.auth.dto.AuthResponse;
import com.englishascension.backend.feature.auth.dto.ChangePasswordRequest;
import com.englishascension.backend.feature.auth.dto.ForgotPasswordRequest;
import com.englishascension.backend.feature.auth.dto.GoogleLoginRequest;
import com.englishascension.backend.feature.auth.dto.LoginRequest;
import com.englishascension.backend.feature.auth.dto.MessageResponse;
import com.englishascension.backend.feature.auth.dto.RegisterRequest;
import com.englishascension.backend.feature.auth.dto.ResetPasswordRequest;
import com.englishascension.backend.feature.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Auth REST controller – HTTP layer only.
 * All business logic is delegated to {@link AuthService}.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/ping")
    public ResponseEntity<MessageResponse> ping() {
        return ResponseEntity.ok(new MessageResponse("Pong"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(new MessageResponse("Đổi mật khẩu thành công!"));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(new MessageResponse(
                "Mã khôi phục đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(new MessageResponse(
                "Khôi phục mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới."));
    }
}
