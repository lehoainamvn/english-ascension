package com.englishascension.backend.feature.study.service;

import com.englishascension.backend.feature.study.entity.Flashcard;
import com.englishascension.backend.feature.study.repository.FlashcardRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class UserWordService {

    private final UserRepository userRepository;
    private final FlashcardRepository flashcardRepository;

    public UserWordService(UserRepository userRepository, FlashcardRepository flashcardRepository) {
        this.userRepository = userRepository;
        this.flashcardRepository = flashcardRepository;
    }

    public List<Flashcard> getAllUserWords(User user) {
        return flashcardRepository.findByUserId(user.getId());
    }

    public Flashcard saveUserWord(Map<String, String> body, User user) {
        String wordText = body.get("word");
        if (wordText == null || wordText.trim().isEmpty()) {
            throw new IllegalArgumentException("Từ vựng không được để trống.");
        }

        String partOfSpeech = body.getOrDefault("partOfSpeech", "");
        String definition = body.getOrDefault("definition", "");
        String phonetic = body.getOrDefault("phonetic", "");
        String notes = body.getOrDefault("notes", "");

        Optional<Flashcard> existing = flashcardRepository.findByUserIdAndWord(user.getId(), wordText.trim());
        Flashcard userWord;

        if (existing.isPresent()) {
            userWord = existing.get();
            if (!partOfSpeech.isEmpty()) userWord.setPartOfSpeech(partOfSpeech);
            if (!definition.isEmpty()) userWord.setDefinition(definition);
            if (!phonetic.isEmpty()) userWord.setPhonetic(phonetic);
            userWord.setNotes(notes);
        } else {
            String savedDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            userWord = Flashcard.builder()
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

        return flashcardRepository.save(userWord);
    }

    public Flashcard updateUserWord(Long id, Map<String, Object> body, User user) {
        Flashcard userWord = flashcardRepository.findById(id).orElse(null);
        if (userWord == null || userWord.getUser() == null || !userWord.getUser().getId().equals(user.getId())) {
            return null;
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

        return flashcardRepository.save(userWord);
    }

    public boolean deleteUserWord(Long id, User user) {
        Flashcard userWord = flashcardRepository.findById(id).orElse(null);
        if (userWord == null || userWord.getUser() == null || !userWord.getUser().getId().equals(user.getId())) {
            return false;
        }

        flashcardRepository.delete(userWord);
        return true;
    }

    public boolean deleteUserWordByText(String wordText, User user) {
        Optional<Flashcard> userWord = flashcardRepository.findByUserIdAndWord(user.getId(), wordText.trim());
        if (userWord.isEmpty()) {
            return false;
        }

        flashcardRepository.delete(userWord.get());
        return true;
    }
}
