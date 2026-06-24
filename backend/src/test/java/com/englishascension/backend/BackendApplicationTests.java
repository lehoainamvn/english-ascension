package com.englishascension.backend;

import com.englishascension.backend.feature.ai.service.GroqService;
import com.englishascension.backend.feature.user.repository.UserRepository;
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
	private com.englishascension.backend.feature.study.repository.FlashcardRepository flashcardRepository;


	@Test
	void contextLoads() {
	}

	@Test
	void testPrintDatabaseState() {
		System.out.println("=== DIAGNOSING USERS ===");
		userRepository.findAll().forEach(u -> {
			System.out.println("User ID: " + u.getId() + " | Email: " + u.getEmail());
		});

		System.out.println("=== DIAGNOSING USER FLASHCARDS ===");
		flashcardRepository.findAll().forEach(fc -> {
			if (fc.getUser() != null) {
				System.out.println("Flashcard ID: " + fc.getId() + " | Word: " + fc.getWord() + " | Owner User ID: " + fc.getUser().getId());
			}
		});
	}
}
