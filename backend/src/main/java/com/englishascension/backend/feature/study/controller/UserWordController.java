package com.englishascension.backend.feature.study.controller;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.study.entity.Flashcard;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.study.service.UserWordService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user-words")
public class UserWordController {

    private final UserRepository userRepository;
    private final UserWordService userWordService;

    public UserWordController(UserRepository userRepository, UserWordService userWordService) {
        this.userRepository = userRepository;
        this.userWordService = userWordService;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @GetMapping
    public ResponseEntity<List<Flashcard>> getAllUserWords() {
        User user = getAuthenticatedUser();
        List<Flashcard> words = userWordService.getAllUserWords(user);
        return ResponseEntity.ok(words);
    }

    @PostMapping
    public ResponseEntity<?> saveUserWord(@RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        try {
            Flashcard saved = userWordService.saveUserWord(body, user);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserWord(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        Flashcard saved = userWordService.updateUserWord(id, body, user);
        if (saved == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserWord(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        boolean deleted = userWordService.deleteUserWord(id, user);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("message", "Đã xóa từ vựng thành công."));
    }

    @DeleteMapping("/word/{wordText}")
    public ResponseEntity<?> deleteUserWordByText(@PathVariable String wordText) {
        User user = getAuthenticatedUser();
        boolean deleted = userWordService.deleteUserWordByText(wordText, user);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of("message", "Đã xóa từ vựng thành công."));
    }
}
