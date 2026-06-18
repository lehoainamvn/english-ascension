package com.englishascension.backend.feature.study;

import com.englishascension.backend.feature.roadmap.LearningModule;
import com.englishascension.backend.feature.roadmap.LearningModuleRepository;
import com.englishascension.backend.feature.roadmap.LearningRoadmap;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.user.UserProgressRepository;
import com.englishascension.backend.feature.user.UserRepository;
import com.englishascension.backend.feature.vocabulary.VocabularyWord;
import com.englishascension.backend.feature.vocabulary.VocabularyWordRepository;


import com.englishascension.backend.feature.ai.GroqService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/study")
public class StudyController {

    private static final Logger log = LoggerFactory.getLogger(StudyController.class);

    private final UserRepository userRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final FlashcardRepository flashcardRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;
    private final VocabularyWordRepository vocabularyWordRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public StudyController(
            UserRepository userRepository,
            LearningModuleRepository learningModuleRepository,
            FlashcardRepository flashcardRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository,
            VocabularyWordRepository vocabularyWordRepository,
            GroqService groqService) {
        this.userRepository = userRepository;
        this.learningModuleRepository = learningModuleRepository;
        this.flashcardRepository = flashcardRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
        this.vocabularyWordRepository = vocabularyWordRepository;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    @GetMapping("/modules/{moduleId}/content")
    public ResponseEntity<?> getModuleContent(@PathVariable Long moduleId) {
        LearningModule module = learningModuleRepository.findById(moduleId).orElse(null);
        if (module == null) {
            return ResponseEntity.notFound().build();
        }

        // Fetch from DB if already exists
        List<Flashcard> flashcards = flashcardRepository.findByModuleId(moduleId);
        List<Question> quizQuestions = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", moduleId);

        if (!flashcards.isEmpty() && !quizQuestions.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("moduleTitle", module.getTitle());
            response.put("moduleDescription", module.getDescription());
            response.put("flashcards", flashcards);
            response.put("quizQuestions", quizQuestions);
            return ResponseEntity.ok(response);
        }

        // Generate deterministically locally based on module level and order index
        List<Flashcard> savedFlashcards = new ArrayList<>();
        List<Question> savedQuizzes = new ArrayList<>();

        LearningRoadmap roadmap = module.getRoadmap();
        String cefrLevel = (roadmap != null) ? roadmap.getCefrLevel() : "A1";
        int orderIndex = module.getOrderIndex();

        String level = "A1";
        int poolModuleIndex = 1;

        if (cefrLevel == null) {
            cefrLevel = "A1";
        }
        String cefr = cefrLevel.toUpperCase().trim();

        if (cefr.contains("A1-A2")) {
            if (orderIndex <= 4) {
                level = "A1";
                poolModuleIndex = orderIndex;
            } else {
                level = "A2";
                poolModuleIndex = orderIndex - 4;
            }
        } else if (cefr.contains("B1-B2")) {
            if (orderIndex <= 4) {
                level = "B1";
                poolModuleIndex = orderIndex;
            } else {
                level = "B2";
                poolModuleIndex = orderIndex - 4;
            }
        } else if (cefr.contains("TOEIC 600+")) {
            if (orderIndex <= 4) {
                level = "B1";
                poolModuleIndex = orderIndex + 4;
            } else {
                level = "B2";
                poolModuleIndex = orderIndex;
            }
        } else if (cefr.contains("BUSINESS")) {
            if (orderIndex <= 4) {
                level = "B2";
                poolModuleIndex = orderIndex + 2;
            } else {
                level = "B1";
                poolModuleIndex = orderIndex - 2;
            }
        } else if (cefr.contains("A2")) {
            level = "A2";
            poolModuleIndex = Math.min(10, Math.max(1, orderIndex));
        } else if (cefr.contains("B1")) {
            level = "B1";
            poolModuleIndex = Math.min(10, Math.max(1, orderIndex));
        } else if (cefr.contains("B2")) {
            level = "B2";
            poolModuleIndex = Math.min(10, Math.max(1, orderIndex));
        } else {
            level = "A1";
            poolModuleIndex = Math.min(10, Math.max(1, orderIndex));
        }

        List<VocabularyWord> wordList = vocabularyWordRepository.findByCefrLevelIgnoreCaseAndModuleIndex(level, poolModuleIndex);
        if (wordList == null || wordList.isEmpty()) {
            log.warn("No vocabulary words found in DB for level {} and module index {}", level, poolModuleIndex);
            return ResponseEntity.badRequest().body(Map.of("message", "Không tìm thấy dữ liệu từ vựng cho trình độ " + level + " chặng " + poolModuleIndex + " trong cơ sở dữ liệu. Vui lòng kiểm tra lại seeding."));
        }

        // 1. Save the 10 Flashcards
        for (VocabularyWord vw : wordList) {
            Flashcard fc = Flashcard.builder()
                    .module(module)
                    .word(vw.getWord())
                    .partOfSpeech(vw.getPartOfSpeech())
                    .phonetic(vw.getPhonetic())
                    .definition(vw.getDefinition())
                    .exampleSentence(vw.getExampleSentence())
                    .exampleTranslation(vw.getExampleTranslation())
                    .build();
            savedFlashcards.add(flashcardRepository.save(fc));
        }

        // We require at least 10 words to generate all 10 questions safely.
        // If the DB only has fewer, we copy/pad it.
        List<VocabularyWord> paddedList = new ArrayList<>(wordList);
        while (paddedList.size() < 10) {
            paddedList.add(paddedList.get(paddedList.size() % wordList.size()));
        }

        // 2. Generate 10 Questions dynamically
        // Question 1-4: Multiple choice vocabulary translation
        // Q1: Word 0
        String qText1 = String.format("Which of the following is the correct definition of the word \"%s\"?", paddedList.get(0).getWord());
        Question q1 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(1)
                .type("MULTIPLE_CHOICE")
                .questionText(qText1)
                .optionA(paddedList.get(0).getDefinition())
                .optionB(paddedList.get(1).getDefinition())
                .optionC(paddedList.get(2).getDefinition())
                .optionD(paddedList.get(3).getDefinition())
                .correctOption("A")
                .correctAnswer("A")
                .explanation(String.format("\"%s\" có nghĩa là: %s. Ví dụ: %s (%s)", paddedList.get(0).getWord(), paddedList.get(0).getDefinition(), paddedList.get(0).getExampleSentence(), paddedList.get(0).getExampleTranslation()))
                .build();
        savedQuizzes.add(questionRepository.save(q1));

        // Q2: Word 1
        String qText2 = String.format("What does the word \"%s\" mean?", paddedList.get(1).getWord());
        Question q2 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(2)
                .type("MULTIPLE_CHOICE")
                .questionText(qText2)
                .optionA(paddedList.get(4).getDefinition())
                .optionB(paddedList.get(1).getDefinition())
                .optionC(paddedList.get(5).getDefinition())
                .optionD(paddedList.get(6).getDefinition())
                .correctOption("B")
                .correctAnswer("B")
                .explanation(String.format("\"%s\" có nghĩa là: %s. Ví dụ: %s (%s)", paddedList.get(1).getWord(), paddedList.get(1).getDefinition(), paddedList.get(1).getExampleSentence(), paddedList.get(1).getExampleTranslation()))
                .build();
        savedQuizzes.add(questionRepository.save(q2));

        // Q3: Word 2
        String qText3 = String.format("Find the correct Vietnamese meaning of the word \"%s\":", paddedList.get(2).getWord());
        Question q3 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(3)
                .type("MULTIPLE_CHOICE")
                .questionText(qText3)
                .optionA(paddedList.get(7).getDefinition())
                .optionB(paddedList.get(8).getDefinition())
                .optionC(paddedList.get(2).getDefinition())
                .optionD(paddedList.get(9).getDefinition())
                .correctOption("C")
                .correctAnswer("C")
                .explanation(String.format("\"%s\" có nghĩa là: %s. Ví dụ: %s (%s)", paddedList.get(2).getWord(), paddedList.get(2).getDefinition(), paddedList.get(2).getExampleSentence(), paddedList.get(2).getExampleTranslation()))
                .build();
        savedQuizzes.add(questionRepository.save(q3));

        // Q4: Word 3
        String qText4 = String.format("What is the meaning of the English word \"%s\"?", paddedList.get(3).getWord());
        Question q4 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(4)
                .type("MULTIPLE_CHOICE")
                .questionText(qText4)
                .optionA(paddedList.get(0).getDefinition())
                .optionB(paddedList.get(5).getDefinition())
                .optionC(paddedList.get(8).getDefinition())
                .optionD(paddedList.get(3).getDefinition())
                .correctOption("D")
                .correctAnswer("D")
                .explanation(String.format("\"%s\" có nghĩa là: %s. Ví dụ: %s (%s)", paddedList.get(3).getWord(), paddedList.get(3).getDefinition(), paddedList.get(3).getExampleSentence(), paddedList.get(3).getExampleTranslation()))
                .build();
        savedQuizzes.add(questionRepository.save(q4));

        // Question 5-7: Fill in the blank (from example sentences)
        // Q5: Word 4
        String sentence5 = paddedList.get(4).getExampleSentence();
        String blanked5 = sentence5.replaceAll("(?i)" + java.util.regex.Pattern.quote(paddedList.get(4).getWord()), "______");
        Question q5 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(5)
                .type("FILL_IN_BLANK")
                .questionText(String.format("Complete the sentence: \"%s\"", blanked5))
                .optionA(paddedList.get(4).getWord().toLowerCase())
                .optionB(paddedList.get(5).getWord().toLowerCase())
                .optionC(paddedList.get(6).getWord().toLowerCase())
                .optionD(paddedList.get(7).getWord().toLowerCase())
                .correctOption("A")
                .correctAnswer("A")
                .explanation(String.format("Từ cần điền là \"%s\" (%s) để tạo thành câu hoàn chỉnh: \"%s\" (%s)", paddedList.get(4).getWord(), paddedList.get(4).getDefinition(), paddedList.get(4).getExampleSentence(), paddedList.get(4).getExampleTranslation()))
                .build();
        savedQuizzes.add(questionRepository.save(q5));

        // Q6: Word 5
        String sentence6 = paddedList.get(5).getExampleSentence();
        String blanked6 = sentence6.replaceAll("(?i)" + java.util.regex.Pattern.quote(paddedList.get(5).getWord()), "______");
        Question q6 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(6)
                .type("FILL_IN_BLANK")
                .questionText(String.format("Choose the best word to fill in: \"%s\"", blanked6))
                .optionA(paddedList.get(8).getWord().toLowerCase())
                .optionB(paddedList.get(5).getWord().toLowerCase())
                .optionC(paddedList.get(9).getWord().toLowerCase())
                .optionD(paddedList.get(0).getWord().toLowerCase())
                .correctOption("B")
                .correctAnswer("B")
                .explanation(String.format("Từ cần điền là \"%s\" (%s) để tạo thành câu hoàn chỉnh: \"%s\" (%s)", paddedList.get(5).getWord(), paddedList.get(5).getDefinition(), paddedList.get(5).getExampleSentence(), paddedList.get(5).getExampleTranslation()))
                .build();
        savedQuizzes.add(questionRepository.save(q6));

        // Q7: Word 6
        String sentence7 = paddedList.get(6).getExampleSentence();
        String blanked7 = sentence7.replaceAll("(?i)" + java.util.regex.Pattern.quote(paddedList.get(6).getWord()), "______");
        Question q7 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(7)
                .type("FILL_IN_BLANK")
                .questionText(String.format("Fill in the blank: \"%s\"", blanked7))
                .optionA(paddedList.get(1).getWord().toLowerCase())
                .optionB(paddedList.get(2).getWord().toLowerCase())
                .optionC(paddedList.get(6).getWord().toLowerCase())
                .optionD(paddedList.get(3).getWord().toLowerCase())
                .correctOption("C")
                .correctAnswer("C")
                .explanation(String.format("Từ cần điền là \"%s\" (%s) để tạo thành câu hoàn chỉnh: \"%s\" (%s)", paddedList.get(6).getWord(), paddedList.get(6).getDefinition(), paddedList.get(6).getExampleSentence(), paddedList.get(6).getExampleTranslation()))
                .build();
        savedQuizzes.add(questionRepository.save(q7));

        // Question 8: Phonetics / Transcription
        // Q8: Word 7
        String qText8 = String.format("What is the correct IPA phonetic transcription of the word \"%s\"?", paddedList.get(7).getWord());
        Question q8 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(8)
                .type("MULTIPLE_CHOICE")
                .questionText(qText8)
                .optionA(paddedList.get(7).getPhonetic())
                .optionB(paddedList.get(8).getPhonetic())
                .optionC(paddedList.get(9).getPhonetic())
                .optionD(paddedList.get(0).getPhonetic())
                .correctOption("A")
                .correctAnswer("A")
                .explanation(String.format("Phiên âm quốc tế chuẩn (IPA) của từ \"%s\" là %s.", paddedList.get(7).getWord(), paddedList.get(7).getPhonetic()))
                .build();
        savedQuizzes.add(questionRepository.save(q8));

        // Question 9: Part of Speech
        // Q9: Word 8
        String pos = paddedList.get(8).getPartOfSpeech().toLowerCase().trim();
        String correctOpt9 = "A";
        if (pos.contains("verb")) {
            correctOpt9 = "B";
        } else if (pos.contains("adj")) {
            correctOpt9 = "C";
        } else if (pos.contains("adv")) {
            correctOpt9 = "D";
        }
        String qText9 = String.format("What is the part of speech (từ loại) of the word \"%s\"?", paddedList.get(8).getWord());
        Question q9 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(9)
                .type("MULTIPLE_CHOICE")
                .questionText(qText9)
                .optionA("Noun (Danh từ)")
                .optionB("Verb (Động từ)")
                .optionC("Adjective (Tính từ)")
                .optionD("Adverb/Pronoun/Other")
                .correctOption(correctOpt9)
                .correctAnswer(correctOpt9)
                .explanation(String.format("Từ \"%s\" thuộc loại từ: %s.", paddedList.get(8).getWord(), paddedList.get(8).getPartOfSpeech()))
                .build();
        savedQuizzes.add(questionRepository.save(q9));

        // Question 10: Word Matching
        // Q10: Match Words 0-4
        String wordsStr = String.format("%s|%s|%s|%s|%s", paddedList.get(0).getWord(), paddedList.get(1).getWord(), paddedList.get(2).getWord(), paddedList.get(3).getWord(), paddedList.get(4).getWord());
        String defsStr = String.format("%s|%s|%s|%s|%s", paddedList.get(0).getDefinition(), paddedList.get(1).getDefinition(), paddedList.get(2).getDefinition(), paddedList.get(3).getDefinition(), paddedList.get(4).getDefinition());
        String matchAnswer = String.format("%s:%s|%s:%s|%s:%s|%s:%s|%s:%s",
                paddedList.get(0).getWord(), paddedList.get(0).getDefinition(),
                paddedList.get(1).getWord(), paddedList.get(1).getDefinition(),
                paddedList.get(2).getWord(), paddedList.get(2).getDefinition(),
                paddedList.get(3).getWord(), paddedList.get(3).getDefinition(),
                paddedList.get(4).getWord(), paddedList.get(4).getDefinition());
        Question q10 = Question.builder()
                .sourceType("ROADMAP_QUIZ")
                .parentId(module.getId())
                .questionNumber(10)
                .type("WORD_MATCHING")
                .questionText("Match the vocabulary words with their correct Vietnamese definitions:")
                .optionA(wordsStr)
                .optionB(defsStr)
                .correctOption(matchAnswer)
                .correctAnswer(matchAnswer)
                .explanation("Ghép các từ vựng tiếng Anh bên trái với nghĩa tiếng Việt thích hợp bên phải.")
                .build();
        savedQuizzes.add(questionRepository.save(q10));

        Map<String, Object> response = new HashMap<>();
        response.put("moduleTitle", module.getTitle());
        response.put("moduleDescription", module.getDescription());
        response.put("flashcards", savedFlashcards);
        response.put("quizQuestions", savedQuizzes);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/modules/{moduleId}/complete-step")
    public ResponseEntity<?> completeStep(@PathVariable Long moduleId, @RequestBody Map<String, String> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Mỗi bước học nhỏ lẻ (Ngữ pháp, Từ vựng, Nghe, Phát âm) đều được +30 EXP và +10 Xu
        int xpGained = 30;
        int coinsGained = 10;

        // Process level up logic
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += xpGained;
        currentCoins += coinsGained;

        boolean leveledUp = false;
        int previousLevel = user.getLevel();

        while (true) {
            int expNeeded = currentLevel * 100;
            if (currentExp >= expNeeded) {
                currentExp -= expNeeded;
                currentLevel++;
                leveledUp = true;
            } else {
                break;
            }
        }

        user.setExp(currentExp);
        user.setLevel(currentLevel);
        user.setCoins(currentCoins);

        String newTitle = user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice";
        if (leveledUp) {
            newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", xpGained);
        result.put("coinsGained", coinsGained);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", currentCoins);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", newTitle);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/modules/{moduleId}/complete")
    public ResponseEntity<?> completeModule(@PathVariable Long moduleId, @RequestBody Map<String, Object> requestBody) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule module = learningModuleRepository.findById(moduleId).orElse(null);
        if (module == null) {
            return ResponseEntity.notFound().build();
        }

        // Extract score from body if available
        Integer correctAnswers = (Integer) requestBody.get("correctAnswers");
        if (correctAnswers == null) {
            correctAnswers = 5; // default
        }

        // Enforce passing score of >= 70% (>= 7.0 points)
        List<Question> quizQuestions = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", moduleId);
        int totalQuestions = quizQuestions.isEmpty() ? 5 : quizQuestions.size();
        double pct = (double) correctAnswers / totalQuestions;
        if (pct < 0.70) {
            return ResponseEntity.badRequest().body(Map.of("message", "Chưa đạt yêu cầu! Bạn cần đạt tối thiểu 7 điểm (trả lời đúng 70% số câu hỏi) để qua màn."));
        }

        // Calculate XP and Coin gains (chỉ thưởng điểm test, vì lý thuyết/từ vựng đã thưởng riêng qua complete-step)
        int quizXp = correctAnswers * 10;
        int quizCoins = correctAnswers * 2;

        int totalXpGained = quizXp;
        int totalCoinsGained = quizCoins;

        // Process level up logic
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += totalXpGained;
        currentCoins += totalCoinsGained;

        boolean leveledUp = false;
        int previousLevel = user.getLevel();
        
        while (true) {
            int expNeeded = currentLevel * 100;
            if (currentExp >= expNeeded) {
                currentExp -= expNeeded;
                currentLevel++;
                leveledUp = true;
            } else {
                break;
            }
        }

        user.setExp(currentExp);
        user.setLevel(currentLevel);
        user.setCoins(currentCoins);

        String newTitle = user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice";
        if (leveledUp) {
            newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);

        // Update learning modules progression status
        module.setStatus("COMPLETED");
        learningModuleRepository.save(module);

        // Unlock next module in chronological order
        LearningRoadmap roadmap = module.getRoadmap();
        List<LearningModule> roadmapModules = roadmap.getModules();
        LearningModule nextModule = null;
        for (LearningModule m : roadmapModules) {
            if (m.getOrderIndex() == module.getOrderIndex() + 1) {
                nextModule = m;
                break;
            }
        }
        if (nextModule != null && "LOCKED".equals(nextModule.getStatus())) {
            nextModule.setStatus("IN_PROGRESS");
            learningModuleRepository.save(nextModule);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", totalXpGained);
        result.put("coinsGained", totalCoinsGained);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", currentCoins);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", newTitle);
        result.put("nextModuleId", nextModule != null ? nextModule.getId() : null);

        return ResponseEntity.ok(result);
    }

    private String calculateTitle(int level) {
        if (level >= 100) return "Language Legend";
        if (level >= 80) return "Grand Sage";
        if (level >= 60) return "Master";
        if (level >= 40) return "Knight";
        if (level >= 20) return "Scholar";
        if (level >= 10) return "Student";
        if (level >= 5) return "Adventurer";
        return "Novice";
    }

    @PostMapping("/modules/{moduleId}/battle-complete")
    public ResponseEntity<?> completeWordBattle(@PathVariable Long moduleId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        LearningModule module = learningModuleRepository.findById(moduleId).orElse(null);
        if (module == null) {
            return ResponseEntity.notFound().build();
        }

        // Word Battle rewards
        int totalXpGained = 50;
        int totalCoinsGained = 15;

        // Process level up logic
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += totalXpGained;
        currentCoins += totalCoinsGained;

        boolean leveledUp = false;
        int previousLevel = user.getLevel();
        
        while (true) {
            int expNeeded = currentLevel * 100;
            if (currentExp >= expNeeded) {
                currentExp -= expNeeded;
                currentLevel++;
                leveledUp = true;
            } else {
                break;
            }
        }

        user.setExp(currentExp);
        user.setLevel(currentLevel);
        user.setCoins(currentCoins);

        String newTitle = user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice";
        if (leveledUp) {
            newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", totalXpGained);
        result.put("coinsGained", totalCoinsGained);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", currentCoins);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", newTitle);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/pronunciation/analyze")
    public ResponseEntity<?> analyzePronunciation(@RequestBody Map<String, String> request) {
        String targetWord = request.get("targetWord");
        String transcribedText = request.get("transcribedText");

        if (targetWord == null || targetWord.trim().isEmpty() ||
            transcribedText == null || transcribedText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tham số targetWord và transcribedText không được để trống."));
        }

        log.info("Analyzing pronunciation. Target: '{}', Transcribed: '{}'", targetWord, transcribedText);

        String systemPrompt = "You are an AI Pronunciation Coach. Your task is to analyze the user's pronunciation based on the target English word/phrase and the transcribed text captured by speech recognition.\n" +
                "Analyze the phonetic difference and potential errors. Return ONLY a JSON object with the following fields:\n" +
                "- 'score': an integer from 0 to 100 representing how close the transcription is to the target word/phrase.\n" +
                "- 'accuracy': a short string in Vietnamese describing the level of accuracy ('Xuất sắc', 'Tốt', 'Khá', 'Cần cải thiện').\n" +
                "- 'errorAnalysis': a descriptive sentence in Vietnamese explaining what sound was mispronounced or why the transcription turned out the way it did.\n" +
                "- 'suggestions': helpful tips in Vietnamese on how to improve pronunciation of this word (e.g. focus on word endings, vowel length, stress, etc.).\n" +
                "Ensure the response is a valid, raw JSON object matching the requested schema and nothing else.";

        String userPrompt = String.format("Target word: \"%s\"\nTranscribed text: \"%s\"", targetWord, transcribedText);

        try {
            String jsonResponse = groqService.generateJsonResponse(systemPrompt, userPrompt);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json; charset=UTF-8")
                    .body(jsonResponse);
        } catch (Exception e) {
            log.error("Error analyzing pronunciation with AI", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "AI Coach đang bận, vui lòng thử lại sau. Chi tiết: " + e.getMessage()));
        }
    }


    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Map<String, Object> profile = new HashMap<>();
        profile.put("email", user.getEmail());
        profile.put("streak", user.getStreak());
        profile.put("coins", user.getCoins());
        profile.put("exp", user.getExp());
        profile.put("level", user.getLevel());
        
        return ResponseEntity.ok(profile);
    }
}
