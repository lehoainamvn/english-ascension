package com.englishascension.backend.feature.study.service;

import com.englishascension.backend.feature.study.entity.ReviewHistory;
import com.englishascension.backend.feature.study.repository.ReviewHistoryRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.vocabulary.entity.PersonalWord;
import com.englishascension.backend.feature.vocabulary.repository.PersonalWordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@Transactional
public class UserWordService {

    private final UserRepository userRepository;
    private final PersonalWordRepository personalWordRepository;
    private final ReviewHistoryRepository reviewHistoryRepository;
    private final com.englishascension.backend.feature.user.repository.UserVocabularyStateRepository userVocabularyStateRepository;

    public UserWordService(UserRepository userRepository, 
                           PersonalWordRepository personalWordRepository,
                           ReviewHistoryRepository reviewHistoryRepository,
                           com.englishascension.backend.feature.user.repository.UserVocabularyStateRepository userVocabularyStateRepository) {
        this.userRepository = userRepository;
        this.personalWordRepository = personalWordRepository;
        this.reviewHistoryRepository = reviewHistoryRepository;
        this.userVocabularyStateRepository = userVocabularyStateRepository;
    }

    public List<Map<String, Object>> getAllUserWords(User user) {
        // Auto-sync completed system vocabulary words to personal notebook
        List<com.englishascension.backend.feature.user.entity.UserVocabularyState> systemLearned = userVocabularyStateRepository.findByUserId(user.getId());
        List<PersonalWord> personalWords = personalWordRepository.findByUserId(user.getId());
        java.util.Set<String> personalWordTexts = personalWords.stream()
                .map(w -> w.getWord().trim().toLowerCase())
                .collect(java.util.stream.Collectors.toSet());
                
        boolean newAdded = false;
        for (com.englishascension.backend.feature.user.entity.UserVocabularyState state : systemLearned) {
            if ("COMPLETED".equals(state.getStatus()) && state.getVocabularyWord() != null) {
                com.englishascension.backend.feature.vocabulary.entity.VocabularyWord sysWord = state.getVocabularyWord();
                String sysWordText = sysWord.getWord().trim().toLowerCase();
                if (!personalWordTexts.contains(sysWordText)) {
                    PersonalWord userWord = PersonalWord.builder()
                            .user(user)
                            .word(sysWord.getWord().trim())
                            .partOfSpeech(sysWord.getPartOfSpeech())
                            .definition(sysWord.getDefinition())
                            .phonetic(sysWord.getPhonetic())
                            .exampleSentence(sysWord.getExampleSentence())
                            .build();
                    userWord = personalWordRepository.save(userWord);

                    ReviewHistory review = ReviewHistory.builder()
                            .user(user)
                            .personalWord(userWord)
                            .efactor(2.5)
                            .interval(1)
                            .repetitions(0)
                            .nextReviewDate(LocalDateTime.now().plusDays(1))
                            .build();
                    reviewHistoryRepository.save(review);
                    personalWordTexts.add(sysWordText);
                    newAdded = true;
                }
            }
        }
        
        if (newAdded) {
            personalWords = personalWordRepository.findByUserId(user.getId());
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (PersonalWord lc : personalWords) {
            ReviewHistory review = reviewHistoryRepository.findByUserIdAndPersonalWordId(user.getId(), lc.getId()).orElse(null);
            list.add(mapWordToResponse(lc, review));
        }
        return list;
    }

    public Map<String, Object> saveUserWord(Map<String, String> body, User user) {
        String wordText = body.get("word");
        if (wordText == null || wordText.trim().isEmpty()) {
            throw new IllegalArgumentException("Từ vựng không được để trống.");
        }

        String partOfSpeech = body.getOrDefault("partOfSpeech", "");
        String definition = body.getOrDefault("definition", "");
        String phonetic = body.getOrDefault("phonetic", "");
        String notes = body.getOrDefault("notes", "");

        List<PersonalWord> existing = personalWordRepository.findByUserId(user.getId());
        PersonalWord userWord = existing.stream()
                .filter(lc -> wordText.trim().equalsIgnoreCase(lc.getWord()))
                .findFirst().orElse(null);

        ReviewHistory review;

        if (userWord != null) {
            if (!partOfSpeech.isEmpty()) userWord.setPartOfSpeech(partOfSpeech);
            if (!definition.isEmpty()) userWord.setDefinition(definition);
            if (!phonetic.isEmpty()) userWord.setPhonetic(phonetic);
            userWord.setExampleSentence(notes);
            final PersonalWord savedWord = personalWordRepository.save(userWord);
            
            review = reviewHistoryRepository.findByUserIdAndPersonalWordId(user.getId(), savedWord.getId())
                    .orElseGet(() -> ReviewHistory.builder()
                            .user(user)
                            .personalWord(savedWord)
                            .efactor(2.5)
                            .interval(1)
                            .repetitions(0)
                            .nextReviewDate(LocalDateTime.now().plusDays(1)) // default next review date
                            .build());
        } else {
            userWord = PersonalWord.builder()
                    .user(user)
                    .word(wordText.trim())
                    .partOfSpeech(partOfSpeech)
                    .definition(definition)
                    .phonetic(phonetic)
                    .exampleSentence(notes)
                    .build();
            userWord = personalWordRepository.save(userWord);

            review = ReviewHistory.builder()
                    .user(user)
                    .personalWord(userWord)
                    .efactor(2.5)
                    .interval(1)
                    .repetitions(0)
                    .nextReviewDate(LocalDateTime.now().plusDays(1))
                    .build();
            review = reviewHistoryRepository.save(review);
        }

        return mapWordToResponse(userWord, review);
    }

    public Map<String, Object> updateUserWord(Long id, Map<String, Object> body, User user) {
        final PersonalWord userWord = personalWordRepository.findById(id).orElse(null);
        if (userWord == null || userWord.getUser() == null || !userWord.getUser().getId().equals(user.getId())) {
            return null;
        }

        if (body.containsKey("notes")) {
            userWord.setExampleSentence((String) body.get("notes"));
        }
        if (body.containsKey("definition")) {
            userWord.setDefinition((String) body.get("definition"));
        }
        if (body.containsKey("partOfSpeech")) {
            userWord.setPartOfSpeech((String) body.get("partOfSpeech"));
        }
        personalWordRepository.save(userWord);

        ReviewHistory review = reviewHistoryRepository.findByUserIdAndPersonalWordId(user.getId(), userWord.getId())
                .orElseGet(() -> ReviewHistory.builder().user(user).personalWord(userWord).build());

        if (body.containsKey("efactor")) {
            review.setEfactor(((Number) body.get("efactor")).doubleValue());
        }
        if (body.containsKey("interval")) {
            review.setInterval(((Number) body.get("interval")).intValue());
        }
        if (body.containsKey("repetitions")) {
            review.setRepetitions(((Number) body.get("repetitions")).intValue());
        }
        reviewHistoryRepository.save(review);

        return mapWordToResponse(userWord, review);
    }

    public boolean deleteUserWord(Long id, User user) {
        PersonalWord userWord = personalWordRepository.findById(id).orElse(null);
        if (userWord == null || userWord.getUser() == null || !userWord.getUser().getId().equals(user.getId())) {
            return false;
        }
        personalWordRepository.delete(userWord);
        return true;
    }

    public boolean deleteUserWordByText(String wordText, User user) {
        List<PersonalWord> existing = personalWordRepository.findByUserId(user.getId());
        PersonalWord userWord = existing.stream()
                .filter(lc -> wordText.trim().equalsIgnoreCase(lc.getWord()))
                .findFirst().orElse(null);

        if (userWord == null) {
            return false;
        }

        personalWordRepository.delete(userWord);
        return true;
    }

    private Map<String, Object> mapWordToResponse(PersonalWord lc, ReviewHistory review) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", lc.getId());
        map.put("word", lc.getWord());
        map.put("partOfSpeech", lc.getPartOfSpeech());
        map.put("phonetic", lc.getPhonetic());
        map.put("definition", lc.getDefinition());
        map.put("notes", lc.getExampleSentence() != null ? lc.getExampleSentence() : "");
        map.put("savedDate", lc.getCreatedAt() != null ? lc.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        
        map.put("efactor", review != null && review.getEfactor() != null ? review.getEfactor() : 2.5);
        map.put("interval", review != null && review.getInterval() != null ? review.getInterval() : 1);
        map.put("repetitions", review != null && review.getRepetitions() != null ? review.getRepetitions() : 0);
        return map;
    }
}
