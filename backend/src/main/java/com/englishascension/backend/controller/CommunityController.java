package com.englishascension.backend.controller;

import com.englishascension.backend.model.ChatMessage;
import com.englishascension.backend.model.User;
import com.englishascension.backend.repository.ChatMessageRepository;
import com.englishascension.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    public CommunityController(UserRepository userRepository, ChatMessageRepository chatMessageRepository) {
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<User> users = userRepository.findAllByOrderByExpDesc();
        List<Map<String, Object>> entries = new ArrayList<>();
        
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            String name = u.getCharacterName() != null ? u.getCharacterName() : u.getEmail().split("@")[0];
            entries.add(Map.of(
                "rank", i + 1,
                "name", name,
                "level", u.getLevel(),
                "exp", u.getExp(),
                "streak", u.getStreak(),
                "email", u.getEmail()
            ));
        }
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/chat")
    public ResponseEntity<?> getChatMessages() {
        List<ChatMessage> messages = chatMessageRepository.findTop50ByOrderByCreatedAtDesc();
        // Reverse so that the oldest of the latest 50 is first, and newest is last (chronological order)
        List<ChatMessage> sortedMessages = new ArrayList<>(messages);
        Collections.reverse(sortedMessages);

        List<Map<String, Object>> response = sortedMessages.stream().map(m -> {
            String name = m.getUser().getCharacterName() != null ? m.getUser().getCharacterName() : m.getUser().getEmail().split("@")[0];
            return Map.<String, Object>of(
                "senderName", name,
                "senderEmail", m.getUser().getEmail(),
                "content", m.getContent(),
                "createdAt", m.getCreatedAt().toString()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> postChatMessage(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Content cannot be empty"));
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        ChatMessage message = ChatMessage.builder()
                .user(user)
                .content(content)
                .build();

        chatMessageRepository.save(message);

        String name = user.getCharacterName() != null ? user.getCharacterName() : user.getEmail().split("@")[0];
        return ResponseEntity.ok(Map.of(
            "senderName", name,
            "senderEmail", user.getEmail(),
            "content", message.getContent(),
            "createdAt", message.getCreatedAt().toString()
        ));
    }
}
