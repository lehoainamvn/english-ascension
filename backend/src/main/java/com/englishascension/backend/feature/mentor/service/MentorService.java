package com.englishascension.backend.feature.mentor.service;

import com.englishascension.backend.feature.ai.service.GroqService;
import org.springframework.stereotype.Service;

@Service
public class MentorService {

    private final GroqService groqService;

    public MentorService(GroqService groqService) {
        this.groqService = groqService;
    }

    public String askMentor(String userMessage) {
        String systemPrompt = "You are the wise, friendly, and highly encouraging AI Mentor (styled as a Wizard/Sage) of English Ascension.\n" +
                "Your mission is to help the user master English grammar, vocabulary, pronunciation, and writing.\n" +
                "Respond in a supportive, RPG companion tone. Use bullet points and clear examples. Keep explanations easy to understand.\n" +
                "If explaining grammar, include:\n" +
                "- Correct form (Nên dùng)\n" +
                "- Incorrect form (Tránh dùng)\n" +
                "Always respond using beautifully formatted Markdown (bold, italic, code blocks, lists). Keep your replies in Vietnamese, but you can keep the English words and sentences untranslated where they are used as examples. Encourage the user to keep studying to earn EXP and Coins!";

        return groqService.generateTextResponse(systemPrompt, userMessage);
    }
}
