package com.englishascension.backend.feature.document.controller;

import com.englishascension.backend.feature.document.entity.UserDocument;
import com.englishascension.backend.feature.document.entity.DocumentFlashcard;
import com.englishascension.backend.feature.document.entity.DocumentQuestion;
import com.englishascension.backend.feature.document.entity.DocumentQuestionOption;
import com.englishascension.backend.feature.document.service.UserDocumentService;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/documents")
public class UserDocumentController {

    private static final Logger log = LoggerFactory.getLogger(UserDocumentController.class);

    private final UserRepository userRepository;
    private final UserDocumentService userDocumentService;

    public UserDocumentController(UserRepository userRepository, 
                                  UserDocumentService userDocumentService) {
        this.userRepository = userRepository;
        this.userDocumentService = userDocumentService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "flashcardCount", defaultValue = "5") int flashcardCount) {
        try {
            User currentUser = getCurrentUser();
            log.info("User {} uploading document: {}, flashcardCount: {}", currentUser.getEmail(), file.getOriginalFilename(), flashcardCount);
            
            UserDocument doc = userDocumentService.uploadAndProcess(file, currentUser, flashcardCount);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tải lên và phân tích tài liệu thành công!");
            response.put("documentId", doc.getId());
            response.put("fileName", doc.getTitle());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Lỗi khi xử lý tải lên tài liệu", e);
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResponse);
        }
    }

    @GetMapping
    public ResponseEntity<?> listDocuments() {
        try {
            User currentUser = getCurrentUser();
            List<UserDocument> docs = userDocumentService.getMyDocuments(currentUser);
            
            List<Map<String, Object>> response = docs.stream().map(doc -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", doc.getId());
                map.put("fileName", doc.getTitle());
                map.put("createdAt", doc.getCreatedAt());
                map.put("flashcardCount", doc.getFlashcards().size());
                map.put("quizCount", doc.getQuestions().size());
                return map;
            }).toList();
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocumentDetails(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            UserDocument doc = userDocumentService.getDocumentById(id, currentUser);
            
            List<DocumentFlashcard> flashcards = doc.getFlashcards();
            List<DocumentQuestion> questions = doc.getQuestions();

            List<Map<String, Object>> flashcardList = flashcards.stream().map(fc -> {
                Map<String, Object> fcMap = new HashMap<>();
                fcMap.put("id", fc.getId());
                fcMap.put("word", fc.getWord());
                fcMap.put("partOfSpeech", fc.getPartOfSpeech());
                fcMap.put("phonetic", fc.getPhonetic());
                fcMap.put("definition", fc.getDefinition());
                fcMap.put("exampleSentence", fc.getExampleSentence());
                fcMap.put("exampleTranslation", fc.getExampleTranslation());
                return fcMap;
            }).toList();

            List<Map<String, Object>> quizQuestions = questions.stream().map(q -> {
                Map<String, Object> qDto = new HashMap<>();
                qDto.put("id", q.getId());
                qDto.put("questionText", q.getQuestionText());
                qDto.put("explanation", q.getExplanation());

                qDto.put("optionA", "");
                qDto.put("optionB", "");
                qDto.put("optionC", "");
                qDto.put("optionD", "");
                String correct = "A";

                for (DocumentQuestionOption opt : q.getOptions()) {
                    if ("A".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionA", opt.getOptionValue());
                    if ("B".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionB", opt.getOptionValue());
                    if ("C".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionC", opt.getOptionValue());
                    if ("D".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionD", opt.getOptionValue());
                    if (opt.isCorrect()) {
                        correct = opt.getOptionKey();
                    }
                }

                boolean isMcq = false;
                for (DocumentQuestionOption opt : q.getOptions()) {
                    if ("A".equalsIgnoreCase(opt.getOptionKey()) && opt.getOptionValue() != null && !opt.getOptionValue().trim().isEmpty()) {
                        isMcq = true;
                    }
                }
                qDto.put("type", isMcq ? "MULTIPLE_CHOICE" : "FILL_IN_BLANK");

                qDto.put("correctAnswer", correct);
                return qDto;
            }).toList();

            Map<String, Object> response = new HashMap<>();
            response.put("id", doc.getId());
            response.put("fileName", doc.getTitle());
            response.put("extractedText", doc.getBodyText());
            response.put("createdAt", doc.getCreatedAt());
            response.put("flashcards", flashcardList);
            response.put("quizQuestions", quizQuestions);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            userDocumentService.deleteDocument(id, currentUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa tài liệu thành công!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResponse);
        }
    }

    @PostMapping("/{docId}/flashcards")
    public ResponseEntity<?> addFlashcardToDocument(@PathVariable Long docId, @RequestBody DocumentFlashcard flashcard) {
        try {
            User currentUser = getCurrentUser();
            DocumentFlashcard saved = userDocumentService.addFlashcard(docId, flashcard, currentUser);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Lỗi khi thêm flashcard thủ công", e);
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResponse);
        }
    }

    @DeleteMapping("/{docId}/flashcards/{flashcardId}")
    public ResponseEntity<?> deleteFlashcardFromDocument(@PathVariable Long docId, @PathVariable Long flashcardId) {
        try {
            User currentUser = getCurrentUser();
            userDocumentService.deleteFlashcard(docId, flashcardId, currentUser);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Xóa flashcard thành công!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Lỗi khi xóa flashcard", e);
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResponse);
        }
    }

    @PostMapping("/{docId}/regenerate-quiz")
    public ResponseEntity<?> regenerateQuiz(
            @PathVariable Long docId,
            @RequestParam(value = "questionCount", defaultValue = "5") int questionCount,
            @RequestParam(value = "questionType", defaultValue = "MULTIPLE_CHOICE") String questionType) {
        try {
            User currentUser = getCurrentUser();
            log.info("User {} regenerating quiz for doc {}: count={}, type={}", currentUser.getEmail(), docId, questionCount, questionType);
            List<DocumentQuestion> newQuestions = userDocumentService.regenerateQuiz(docId, currentUser, questionCount, questionType);
            
            List<Map<String, Object>> qDtos = newQuestions.stream().map(q -> {
                Map<String, Object> qDto = new HashMap<>();
                qDto.put("id", q.getId());
                qDto.put("questionText", q.getQuestionText());
                qDto.put("explanation", q.getExplanation());

                qDto.put("optionA", "");
                qDto.put("optionB", "");
                qDto.put("optionC", "");
                qDto.put("optionD", "");
                String correct = "A";

                for (DocumentQuestionOption opt : q.getOptions()) {
                    if ("A".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionA", opt.getOptionValue());
                    if ("B".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionB", opt.getOptionValue());
                    if ("C".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionC", opt.getOptionValue());
                    if ("D".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionD", opt.getOptionValue());
                    if (opt.isCorrect()) {
                        correct = opt.getOptionKey();
                    }
                }

                boolean isMcq = false;
                for (DocumentQuestionOption opt : q.getOptions()) {
                    if ("A".equalsIgnoreCase(opt.getOptionKey()) && opt.getOptionValue() != null && !opt.getOptionValue().trim().isEmpty()) {
                        isMcq = true;
                    }
                }
                qDto.put("type", isMcq ? "MULTIPLE_CHOICE" : "FILL_IN_BLANK");

                qDto.put("correctAnswer", correct);
                return qDto;
            }).toList();

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Tạo lại quiz thành công!");
            response.put("quizQuestions", qDtos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Lỗi khi tạo lại quiz", e);
            Map<String, String> errResponse = new HashMap<>();
            errResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errResponse);
        }
    }
}
