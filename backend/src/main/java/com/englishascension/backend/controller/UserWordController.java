package com.englishascension.backend.controller;

import com.englishascension.backend.model.User;
import com.englishascension.backend.model.UserWord;
import com.englishascension.backend.repository.UserRepository;
import com.englishascension.backend.repository.UserWordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user-words")
public class UserWordController {

    private final UserRepository userRepository;
    private final UserWordRepository userWordRepository;

    public UserWordController(UserRepository userRepository, UserWordRepository userWordRepository) {
        this.userRepository = userRepository;
        this.userWordRepository = userWordRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @GetMapping
    public ResponseEntity<List<UserWord>> getAllUserWords() {
        User user = getAuthenticatedUser();
        List<UserWord> words = userWordRepository.findByUserId(user.getId());
        return ResponseEntity.ok(words);
    }

    @PostMapping
    public ResponseEntity<?> saveUserWord(@RequestBody Map<String, String> body) {
        User user = getAuthenticatedUser();
        String wordText = body.get("word");
        if (wordText == null || wordText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Từ vựng không được để trống."));
        }

        String partOfSpeech = body.getOrDefault("partOfSpeech", "");
        String definition = body.getOrDefault("definition", "");
        String phonetic = body.getOrDefault("phonetic", "");
        String notes = body.getOrDefault("notes", "");

        Optional<UserWord> existing = userWordRepository.findByUserIdAndWord(user.getId(), wordText.trim());
        UserWord userWord;

        if (existing.isPresent()) {
            userWord = existing.get();
            if (!partOfSpeech.isEmpty()) userWord.setPartOfSpeech(partOfSpeech);
            if (!definition.isEmpty()) userWord.setDefinition(definition);
            if (!phonetic.isEmpty()) userWord.setPhonetic(phonetic);
            userWord.setNotes(notes);
        } else {
            String savedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            userWord = UserWord.builder()
                    .user(user)
                    .word(wordText.trim())
                    .partOfSpeech(partOfSpeech)
                    .definition(definition)
                    .phonetic(phonetic)
                    .notes(notes)
                    .savedDate(savedDate)
                    .efactor(2.5)
                    .interval(1)
                    .repetitions(0)
                    .build();
        }

        UserWord saved = userWordRepository.save(userWord);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserWord(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        User user = getAuthenticatedUser();
        UserWord userWord = userWordRepository.findById(id).orElse(null);
        if (userWord == null || !userWord.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        if (body.containsKey("notes")) {
            userWord.setNotes((String) body.get("notes"));
        }
        if (body.containsKey("definition")) {
            userWord.setDefinition((String) body.get("definition"));
        }
        if (body.containsKey("partOfSpeech")) {
            userWord.setPartOfSpeech((String) body.get("partOfSpeech"));
        }
        if (body.containsKey("efactor")) {
            userWord.setEfactor(((Number) body.get("efactor")).doubleValue());
        }
        if (body.containsKey("interval")) {
            userWord.setInterval(((Number) body.get("interval")).intValue());
        }
        if (body.containsKey("repetitions")) {
            userWord.setRepetitions(((Number) body.get("repetitions")).intValue());
        }

        UserWord saved = userWordRepository.save(userWord);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUserWord(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        UserWord userWord = userWordRepository.findById(id).orElse(null);
        if (userWord == null || !userWord.getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }

        userWordRepository.delete(userWord);
        return ResponseEntity.ok(Map.of("message", "Đã xóa từ vựng thành công."));
    }

    @DeleteMapping("/word/{wordText}")
    public ResponseEntity<?> deleteUserWordByText(@PathVariable String wordText) {
        User user = getAuthenticatedUser();
        Optional<UserWord> userWord = userWordRepository.findByUserIdAndWord(user.getId(), wordText.trim());
        if (userWord.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userWordRepository.delete(userWord.get());
        return ResponseEntity.ok(Map.of("message", "Đã xóa từ vựng thành công."));
    }
}
