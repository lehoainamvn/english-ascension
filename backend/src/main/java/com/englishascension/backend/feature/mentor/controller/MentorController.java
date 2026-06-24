package com.englishascension.backend.feature.mentor.controller;

import com.englishascension.backend.feature.mentor.service.MentorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/mentor")
public class MentorController {

    private static final Logger log = LoggerFactory.getLogger(MentorController.class);

    private final MentorService mentorService;

    public MentorController(MentorService mentorService) {
        this.mentorService = mentorService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> requestBody) {
        String userMessage = requestBody.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("error", "Nội dung câu hỏi không được để trống.");
            return ResponseEntity.badRequest().body(err);
        }

        log.info("User asking AI Mentor: {}", userMessage);

        try {
            String reply = mentorService.askMentor(userMessage);
            Map<String, String> response = new HashMap<>();
            response.put("reply", reply);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Lỗi khi trò chuyện với AI Mentor", e);
            Map<String, String> err = new HashMap<>();
            err.put("error", "AI Mentor đang bận, vui lòng thử lại sau. Chi tiết: " + e.getMessage());
            return ResponseEntity.internalServerError().body(err);
        }
    }
}
