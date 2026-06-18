package com.englishascension.backend.feature.auth;

import com.englishascension.backend.feature.auth.AuthResponse;
import com.englishascension.backend.feature.auth.LoginRequest;
import com.englishascension.backend.feature.auth.MessageResponse;
import com.englishascension.backend.feature.auth.ChangePasswordRequest;
import com.englishascension.backend.feature.auth.RegisterRequest;
import com.englishascension.backend.feature.auth.ForgotPasswordRequest;
import com.englishascension.backend.feature.auth.ResetPasswordRequest;
import com.englishascension.backend.feature.auth.GoogleLoginRequest;
import com.englishascension.backend.feature.user.Role;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.user.UserRepository;
import com.englishascension.backend.security.JwtTokenProvider;
import com.englishascension.backend.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @org.springframework.beans.factory.annotation.Value("${google.client.id}")
    private String googleClientId;

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwtUtils;
    private final JavaMailSender mailSender;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtTokenProvider jwtUtils, JavaMailSender mailSender) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.mailSender = mailSender;
    }

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(new MessageResponse("Pong"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(loginRequest.getEmail());

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        boolean hasCharacter = user.getCharacterName() != null;

        return ResponseEntity.ok(new AuthResponse(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                role,
                hasCharacter
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = User.builder()
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getName().equals("anonymousUser")) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Error: Unauthorized!"));
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found with email: " + email));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Mật khẩu hiện tại không chính xác!"));
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Đổi mật khẩu thành công!"));
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getIdToken();
            
            // Fetch token payload from Google
            Map<String, Object> payload = restTemplate.getForObject(tokenInfoUrl, Map.class);
            if (payload == null || payload.containsKey("error_description")) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Token Google không hợp lệ!"));
            }

            // Verify Client ID (Audience check)
            String aud = (String) payload.get("aud");
            if (!googleClientId.equals(aud)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Token Google không đúng Client ID của hệ thống!"));
            }

            String email = (String) payload.get("email");
            if (email == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Không lấy được Email từ Google!"));
            }

            // Find user or register new user
            User user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = User.builder()
                        .email(email)
                        .password(encoder.encode(UUID.randomUUID().toString()))
                        .role(Role.ROLE_USER)
                        .active(true)
                        .build();
                userRepository.save(user);
            }

            // Generate JWT Token
            String jwt = jwtUtils.generateToken(email);

            boolean hasCharacter = user.getCharacterName() != null;

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getId(),
                    user.getEmail(),
                    user.getRole().name(),
                    hasCharacter
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Error: Có lỗi xảy ra khi xác thực Google: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email không tồn tại trong hệ thống!"));
        }

        // Generate 6-digit code
        String code = String.format("%06d", new Random().nextInt(1000000));
        user.setResetToken(code);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send Email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("naml75803@gmail.com");
            message.setTo(user.getEmail());
            message.setSubject("Mã khôi phục mật khẩu - English Ascension");
            message.setText("Chào bạn,\n\nBạn đã yêu cầu khôi phục mật khẩu trên English Ascension.\n\nMã OTP của bạn là: " 
                            + code + "\n\nMã này có hiệu lực trong vòng 15 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\nTrân trọng,\nĐội ngũ English Ascension.");
            mailSender.send(message);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new MessageResponse("Error: Không thể gửi email. Lỗi: " + e.getMessage()));
        }

        return ResponseEntity.ok(new MessageResponse("Mã khôi phục đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken()).orElse(null);

        if (user == null || user.getResetTokenExpiry() == null || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Mã khôi phục không hợp lệ hoặc đã hết hạn!"));
        }

        // Reset password
        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Khôi phục mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới."));
    }
}
