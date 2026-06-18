package com.englishascension.backend.feature.mentor;

import com.englishascension.backend.feature.user.User;


import com.englishascension.backend.feature.ai.GroqService;
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

    private final GroqService groqService;

    public MentorController(GroqService groqService) {
        this.groqService = groqService;
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

        String systemPrompt = "You are the wise, friendly, and highly encouraging AI Mentor (styled as a Wizard/Sage) of English Ascension.\n" +
                "Your mission is to help the user master English grammar, vocabulary, pronunciation, and writing.\n" +
                "Respond in a supportive, RPG companion tone. Use bullet points and clear examples. Keep explanations easy to understand.\n" +
                "If explaining grammar, include:\n" +
                "- Correct form (Nên dùng)\n" +
                "- Incorrect form (Tránh dùng)\n" +
                "Always respond using beautifully formatted Markdown (bold, italic, code blocks, lists). Keep your replies in Vietnamese, but you can keep the English words and sentences untranslated where they are used as examples. Encourage the user to keep studying to earn EXP and Coins!";

        try {
            String reply = groqService.generateTextResponse(systemPrompt, userMessage);
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
