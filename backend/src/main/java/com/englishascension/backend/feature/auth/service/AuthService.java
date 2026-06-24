package com.englishascension.backend.feature.auth.service;

import com.englishascension.backend.feature.auth.dto.*;
import com.englishascension.backend.feature.user.entity.Role;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.security.JwtTokenProvider;
import com.englishascension.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

/**
 * Business logic for all authentication operations.
 * The controller delegates all work here.
 */
@Service
public class AuthService {

    @Value("${google.client.id}")
    private String googleClientId;

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwtUtils;
    private final JavaMailSender mailSender;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       PasswordEncoder encoder,
                       JwtTokenProvider jwtUtils,
                       JavaMailSender mailSender) {
        this.authenticationManager = authenticationManager;
        this.userRepository        = userRepository;
        this.encoder               = encoder;
        this.jwtUtils              = jwtUtils;
        this.mailSender            = mailSender;
    }

    // ------------------------------------------------------------------
    // Login
    // ------------------------------------------------------------------

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateToken(request.getEmail());

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        boolean hasCharacter = user.getCharacterName() != null;

        return new AuthResponse(jwt, userDetails.getId(), userDetails.getEmail(), role, hasCharacter);
    }

    // ------------------------------------------------------------------
    // Register
    // ------------------------------------------------------------------

    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        userRepository.save(user);
    }

    // ------------------------------------------------------------------
    // Change password
    // ------------------------------------------------------------------

    public void changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getName())) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (!encoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Error: Mật khẩu hiện tại không chính xác!");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // ------------------------------------------------------------------
    // Google login
    // ------------------------------------------------------------------

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        RestTemplate restTemplate = new RestTemplate();
        String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + request.getIdToken();

        @SuppressWarnings("unchecked")
        Map<String, Object> payload = restTemplate.getForObject(tokenInfoUrl, Map.class);
        if (payload == null || payload.containsKey("error_description")) {
            throw new IllegalArgumentException("Error: Token Google không hợp lệ!");
        }

        String aud = (String) payload.get("aud");
        if (!googleClientId.equals(aud)) {
            throw new IllegalArgumentException("Error: Token Google không đúng Client ID của hệ thống!");
        }

        String email = (String) payload.get("email");
        if (email == null) {
            throw new IllegalArgumentException("Error: Không lấy được Email từ Google!");
        }

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

        String jwt = jwtUtils.generateToken(email);
        boolean hasCharacter = user.getCharacterName() != null;

        return new AuthResponse(jwt, user.getId(), user.getEmail(), user.getRole().name(), hasCharacter);
    }

    // ------------------------------------------------------------------
    // Forgot password
    // ------------------------------------------------------------------

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            throw new IllegalArgumentException("Error: Email không tồn tại trong hệ thống!");
        }

        String code = String.format("%06d", new Random().nextInt(1_000_000));
        user.setResetToken(code);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("naml75803@gmail.com");
        message.setTo(user.getEmail());
        message.setSubject("Mã khôi phục mật khẩu - English Ascension");
        message.setText(
                "Chào bạn,\n\nBạn đã yêu cầu khôi phục mật khẩu trên English Ascension.\n\n"
                + "Mã OTP của bạn là: " + code
                + "\n\nMã này có hiệu lực trong vòng 15 phút. "
                + "Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\nTrân trọng,\nĐội ngũ English Ascension.");
        mailSender.send(message);
    }

    // ------------------------------------------------------------------
    // Reset password
    // ------------------------------------------------------------------

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken()).orElse(null);

        if (user == null || user.getResetTokenExpiry() == null
                || LocalDateTime.now().isAfter(user.getResetTokenExpiry())) {
            throw new IllegalArgumentException("Error: Mã khôi phục không hợp lệ hoặc đã hết hạn!");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}
