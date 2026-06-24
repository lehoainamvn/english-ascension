package com.englishascension.backend.feature.community.controller;

import com.englishascension.backend.feature.community.service.CommunityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/community")
public class CommunityController {

    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        List<Map<String, Object>> entries = communityService.getLeaderboard();
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/chat")
    public ResponseEntity<?> getChatMessages() {
        List<Map<String, Object>> response = communityService.getChatMessages();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/chat")
    public ResponseEntity<?> postChatMessage(@RequestBody Map<String, String> body) {
        String content = body.get("content");
        if (content == null || content.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Content cannot be empty"));
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Map<String, Object> response = communityService.postChatMessage(content, email);
        return ResponseEntity.ok(response);
    }
}
