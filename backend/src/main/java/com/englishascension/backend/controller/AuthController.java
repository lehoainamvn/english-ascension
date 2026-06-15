package com.englishascension.backend.controller;

import com.englishascension.backend.dto.AuthResponse;
import com.englishascension.backend.dto.LoginRequest;
import com.englishascension.backend.dto.MessageResponse;
import com.englishascension.backend.dto.ChangePasswordRequest;
import com.englishascension.backend.dto.RegisterRequest;
import com.englishascension.backend.model.Role;
import com.englishascension.backend.model.User;
import com.englishascension.backend.repository.UserRepository;
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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder encoder, JwtTokenProvider jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
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
}
