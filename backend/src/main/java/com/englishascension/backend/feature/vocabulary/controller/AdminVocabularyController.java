package com.englishascension.backend.feature.vocabulary.controller;

import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import com.englishascension.backend.feature.roadmap.repository.LearningModuleRepository;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.vocabulary.entity.VocabularyWord;
import com.englishascension.backend.feature.vocabulary.repository.VocabularyWordRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/vocabulary")
@PreAuthorize("hasRole('ADMIN')")
public class AdminVocabularyController {

    private final LearningModuleRepository topicRepository;
    private final LessonRepository lessonRepository;
    private final VocabularyWordRepository wordRepository;

    public AdminVocabularyController(LearningModuleRepository topicRepository,
                                     LessonRepository lessonRepository,
                                     VocabularyWordRepository wordRepository) {
        this.topicRepository = topicRepository;
        this.lessonRepository = lessonRepository;
        this.wordRepository = wordRepository;
    }

    @GetMapping("/topics")
    public ResponseEntity<List<LearningModule>> getTopics() {
        List<LearningModule> topics = topicRepository.findByCategoryIsNotNull();
        return ResponseEntity.ok(topics);
    }

    @PostMapping("/topics")
    public ResponseEntity<LearningModule> createTopic(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String category = request.get("category");
        String description = request.get("description");

        LearningModule topic = LearningModule.builder()
                .title(title)
                .category(category != null ? category : "VOCABULARY")
                .description(description != null ? description : "")
                .orderIndex(0)
                .status("LOCKED")
                .build();

        LearningModule saved = topicRepository.save(topic);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/topics/{id}")
    public ResponseEntity<LearningModule> updateTopic(@PathVariable Long id, @RequestBody Map<String, String> request) {
        LearningModule topic = topicRepository.findById(id).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("title")) topic.setTitle(request.get("title"));
        if (request.containsKey("category")) topic.setCategory(request.get("category"));
        if (request.containsKey("description")) topic.setDescription(request.get("description"));

        LearningModule updated = topicRepository.save(topic);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/topics/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        LearningModule topic = topicRepository.findById(id).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        List<Lesson> lessons = lessonRepository.findByModuleId(id);
        for (Lesson l : lessons) {
            List<VocabularyWord> words = wordRepository.findByLessonId(l.getId());
            wordRepository.deleteAll(words);
        }

        topicRepository.delete(topic);
        return ResponseEntity.ok(Map.of("message", "Deleted topic and its words successfully"));
    }

    @GetMapping("/topics/{topicId}/words")
    public ResponseEntity<List<VocabularyWord>> getTopicWords(@PathVariable Long topicId) {
        List<Lesson> lessons = lessonRepository.findByModuleId(topicId);
        List<VocabularyWord> words = new ArrayList<>();
        for (Lesson l : lessons) {
            words.addAll(wordRepository.findByLessonId(l.getId()));
        }
        return ResponseEntity.ok(words);
    }

    @PostMapping("/topics/{topicId}/words")
    public ResponseEntity<VocabularyWord> createWord(@PathVariable Long topicId, @RequestBody Map<String, String> request) {
        LearningModule topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        Lesson lesson;
        List<Lesson> lessons = lessonRepository.findByModuleId(topicId);
        if (lessons.isEmpty()) {
            lesson = Lesson.builder()
                    .title(topic.getTitle())
                    .slug("vocab-topic-" + topicId)
                    .type(LessonType.VOCABULARY)
                    .level("A1")
                    .module(topic)
                    .build();
            lesson = lessonRepository.save(lesson);
        } else {
            lesson = lessons.get(0);
        }

        VocabularyWord word = VocabularyWord.builder()
                .lesson(lesson)
                .word(request.get("word"))
                .partOfSpeech(request.get("partOfSpeech"))
                .phonetic(request.get("phonetic"))
                .definition(request.get("definition"))
                .exampleSentence(request.get("exampleSentence"))
                .exampleTranslation(request.get("exampleTranslation"))
                .build();

        VocabularyWord saved = wordRepository.save(word);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/words/{wordId}")
    public ResponseEntity<VocabularyWord> updateWord(@PathVariable Long wordId, @RequestBody Map<String, String> request) {
        VocabularyWord word = wordRepository.findById(wordId).orElse(null);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("word")) word.setWord(request.get("word"));
        if (request.containsKey("partOfSpeech")) word.setPartOfSpeech(request.get("partOfSpeech"));
        if (request.containsKey("phonetic")) word.setPhonetic(request.get("phonetic"));
        if (request.containsKey("definition")) word.setDefinition(request.get("definition"));
        if (request.containsKey("exampleSentence")) word.setExampleSentence(request.get("exampleSentence"));
        if (request.containsKey("exampleTranslation")) word.setExampleTranslation(request.get("exampleTranslation"));

        VocabularyWord updated = wordRepository.save(word);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/words/{wordId}")
    public ResponseEntity<?> deleteWord(@PathVariable Long wordId) {
        VocabularyWord word = wordRepository.findById(wordId).orElse(null);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }

        wordRepository.delete(word);
        return ResponseEntity.ok(Map.of("message", "Word deleted successfully"));
    }
}
