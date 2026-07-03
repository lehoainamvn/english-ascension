package com.englishascension.backend;

import com.englishascension.backend.feature.ai.service.GroqService;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.vocabulary.repository.VocabularyWordRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@Autowired
	private GroqService groqService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private VocabularyWordRepository vocabularyWordRepository;

	@Test
	void contextLoads() {
	}

	@Test
	void testPrintDatabaseState() {
		System.out.println("=== DIAGNOSING USERS ===");
		userRepository.findAll().forEach(u -> {
			System.out.println("User ID: " + u.getId() + " | Email: " + u.getEmail());
		});

		System.out.println("=== DIAGNOSING VOCABULARY WORDS ===");
		vocabularyWordRepository.findAll().forEach(w -> {
			System.out.println("Word ID: " + w.getId() + " | Word: " + w.getWord() + " | Lesson ID: " + w.getLesson().getId());
		});
	}
}
