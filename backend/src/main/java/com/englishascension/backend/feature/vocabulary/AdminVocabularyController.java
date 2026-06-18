package com.englishascension.backend.feature.vocabulary;

import com.englishascension.backend.feature.roadmap.LearningModule;
import com.englishascension.backend.feature.roadmap.LearningModuleRepository;
import com.englishascension.backend.feature.study.Flashcard;
import com.englishascension.backend.feature.study.FlashcardRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/vocabulary")
@PreAuthorize("hasRole('ADMIN')")
public class AdminVocabularyController {

    private final LearningModuleRepository topicRepository;
    private final FlashcardRepository wordRepository;

    public AdminVocabularyController(LearningModuleRepository topicRepository, FlashcardRepository wordRepository) {
        this.topicRepository = topicRepository;
        this.wordRepository = wordRepository;
    }

    /** GET /api/admin/vocabulary/topics - Lấy danh sách các chủ đề từ vựng */
    @GetMapping("/topics")
    public ResponseEntity<List<LearningModule>> getTopics() {
        // Chủ đề từ vựng là các module có category khác null
        List<LearningModule> topics = topicRepository.findByCategoryIsNotNull();
        return ResponseEntity.ok(topics);
    }

    /** POST /api/admin/vocabulary/topics - Tạo chủ đề từ vựng mới */
    @PostMapping("/topics")
    public ResponseEntity<LearningModule> createTopic(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String category = request.get("category");
        String description = request.get("description");

        LearningModule topic = LearningModule.builder()
                .title(title)
                .category(category != null ? category : "VOCABULARY")
                .description(description != null ? description : "")
                .orderIndex(0) // mặc định
                .status("LOCKED")
                .build();

        LearningModule saved = topicRepository.save(topic);
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/vocabulary/topics/{id} - Cập nhật chủ đề từ vựng */
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

    /** DELETE /api/admin/vocabulary/topics/{id} - Xóa chủ đề từ vựng */
    @DeleteMapping("/topics/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        LearningModule topic = topicRepository.findById(id).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        // Xóa tất cả từ vựng liên quan trước
        List<Flashcard> words = wordRepository.findByModuleId(id);
        wordRepository.deleteAll(words);

        topicRepository.delete(topic);
        return ResponseEntity.ok(Map.of("message", "Deleted topic and its words successfully"));
    }

    /** GET /api/admin/vocabulary/topics/{topicId}/words - Lấy từ vựng thuộc chủ đề */
    @GetMapping("/topics/{topicId}/words")
    public ResponseEntity<List<Flashcard>> getTopicWords(@PathVariable Long topicId) {
        List<Flashcard> words = wordRepository.findByModuleId(topicId);
        return ResponseEntity.ok(words);
    }

    /** POST /api/admin/vocabulary/topics/{topicId}/words - Thêm từ vựng vào chủ đề */
    @PostMapping("/topics/{topicId}/words")
    public ResponseEntity<Flashcard> createWord(@PathVariable Long topicId, @RequestBody Map<String, String> request) {
        LearningModule topic = topicRepository.findById(topicId).orElse(null);
        if (topic == null) {
            return ResponseEntity.notFound().build();
        }

        Flashcard word = Flashcard.builder()
                .module(topic)
                .word(request.get("word"))
                .partOfSpeech(request.get("partOfSpeech"))
                .phonetic(request.get("phonetic"))
                .definition(request.get("definition"))
                .exampleSentence(request.get("exampleSentence"))
                .exampleTranslation(request.get("exampleTranslation"))
                .build();

        Flashcard saved = wordRepository.save(word);
        return ResponseEntity.ok(saved);
    }

    /** PUT /api/admin/vocabulary/words/{wordId} - Cập nhật từ vựng */
    @PutMapping("/words/{wordId}")
    public ResponseEntity<Flashcard> updateWord(@PathVariable Long wordId, @RequestBody Map<String, String> request) {
        Flashcard word = wordRepository.findById(wordId).orElse(null);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.containsKey("word")) word.setWord(request.get("word"));
        if (request.containsKey("partOfSpeech")) word.setPartOfSpeech(request.get("partOfSpeech"));
        if (request.containsKey("phonetic")) word.setPhonetic(request.get("phonetic"));
        if (request.containsKey("definition")) word.setDefinition(request.get("definition"));
        if (request.containsKey("exampleSentence")) word.setExampleSentence(request.get("exampleSentence"));
        if (request.containsKey("exampleTranslation")) word.setExampleTranslation(request.get("exampleTranslation"));

        Flashcard updated = wordRepository.save(word);
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/admin/vocabulary/words/{wordId} - Xóa từ vựng */
    @DeleteMapping("/words/{wordId}")
    public ResponseEntity<?> deleteWord(@PathVariable Long wordId) {
        Flashcard word = wordRepository.findById(wordId).orElse(null);
        if (word == null) {
            return ResponseEntity.notFound().build();
        }

        wordRepository.delete(word);
        return ResponseEntity.ok(Map.of("message", "Word deleted successfully"));
    }
}
