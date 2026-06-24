package com.englishascension.backend.feature.study.service;

import com.englishascension.backend.feature.ai.service.GroqService;
import com.englishascension.backend.feature.roadmap.entity.LearningModule;
import com.englishascension.backend.feature.roadmap.repository.LearningModuleRepository;
import com.englishascension.backend.feature.roadmap.entity.LearningRoadmap;
import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import com.englishascension.backend.feature.roadmap.entity.UserLearningPath;
import com.englishascension.backend.feature.roadmap.entity.UserLearningPathLesson;
import com.englishascension.backend.feature.roadmap.repository.UserLearningPathLessonRepository;
import com.englishascension.backend.feature.study.entity.*;
import com.englishascension.backend.feature.study.repository.*;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserProgressRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.vocabulary.entity.VocabularyWord;
import com.englishascension.backend.feature.vocabulary.repository.VocabularyWordRepository;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import com.englishascension.backend.shared.reward.RewardResult;
import com.englishascension.backend.shared.reward.RewardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Business logic for roadmap study modules (content generation, step/module completion,
 * battle words, pronunciation analysis, and user profile).
 */
@Service
public class StudyService {

    private static final Logger log = LoggerFactory.getLogger(StudyService.class);

    private final UserRepository userRepository;
    private final LearningModuleRepository learningModuleRepository;
    private final FlashcardRepository flashcardRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;
    private final VocabularyWordRepository vocabularyWordRepository;
    private final StudyContentRepository studyContentRepository;
    private final GroqService groqService;
    private final RewardService rewardService;
    private final UserLearningPathLessonRepository userLearningPathLessonRepository;

    public StudyService(UserRepository userRepository,
                        LearningModuleRepository learningModuleRepository,
                        FlashcardRepository flashcardRepository,
                        QuestionRepository questionRepository,
                        UserProgressRepository progressRepository,
                        VocabularyWordRepository vocabularyWordRepository,
                        StudyContentRepository studyContentRepository,
                        GroqService groqService,
                        RewardService rewardService,
                        UserLearningPathLessonRepository userLearningPathLessonRepository) {
        this.userRepository           = userRepository;
        this.learningModuleRepository = learningModuleRepository;
        this.flashcardRepository      = flashcardRepository;
        this.questionRepository       = questionRepository;
        this.progressRepository       = progressRepository;
        this.vocabularyWordRepository = vocabularyWordRepository;
        this.studyContentRepository   = studyContentRepository;
        this.groqService              = groqService;
        this.rewardService            = rewardService;
        this.userLearningPathLessonRepository = userLearningPathLessonRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // ------------------------------------------------------------------
    // Get module content (flashcards + quiz questions)
    // ------------------------------------------------------------------

    public Map<String, Object> getModuleContent(Long userLearningPathLessonId, String category) {
        UserLearningPathLesson pathLesson = userLearningPathLessonRepository.findById(userLearningPathLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("UserLearningPathLesson", userLearningPathLessonId));

        Lesson lesson = pathLesson.getLesson();

        String targetCategory = (category == null || category.trim().isEmpty() || "test".equalsIgnoreCase(category))
                ? lesson.getType().name()
                : category;
        targetCategory = targetCategory.toUpperCase().trim();
        if ("PRONUNCIATION".equals(targetCategory)) targetCategory = "VOCABULARY";

        List<Flashcard> flashcards = new ArrayList<>();
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", userLearningPathLessonId);

        String bodyText = null;
        String mediaUrl = null;

        if (lesson.getType() == LessonType.VOCABULARY) {
            List<Flashcard> savedFcs = flashcardRepository.findByModuleId(lesson.getContentId());
            if (savedFcs.isEmpty()) {
                LearningModule topic = learningModuleRepository.findById(lesson.getContentId()).orElse(null);
                if (topic != null) {
                    savedFcs = autoGenerateVocabularyFlashcards(topic);
                }
            }
            flashcards.addAll(savedFcs);

            if (questions.isEmpty()) {
                questions = generateVocabQuizQuestionsForPathLesson(pathLesson, lesson);
            }
        } else {
            StudyContent content = studyContentRepository.findById(lesson.getContentId())
                    .orElseThrow(() -> new ResourceNotFoundException("StudyContent", lesson.getContentId()));

            bodyText = content.getBodyText();
            mediaUrl = content.getMediaUrl();

            List<Flashcard> contentFcs = content.getFlashcards();
            if (contentFcs == null || contentFcs.isEmpty()) {
                contentFcs = generateAndSaveStudyContentFlashcards(content);
            }

            flashcards.addAll(filterFlashcardsByCategory(contentFcs, targetCategory));

            if (questions.isEmpty()) {
                questions = generateStudyContentQuizQuestionsForPathLesson(pathLesson, lesson, content);
            }
        }

        return buildContentResponse(
                lesson.getTitle(),
                lesson.getTopic() != null ? lesson.getTopic() : "",
                lesson.getType().name(),
                bodyText,
                mediaUrl,
                flashcards,
                questions
        );
    }

    // ------------------------------------------------------------------
    // Complete step
    // ------------------------------------------------------------------

    public RewardResult completeStep(Long userLearningPathLessonId) {
        User user = getCurrentUser();
        userLearningPathLessonRepository.findById(userLearningPathLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("UserLearningPathLesson", userLearningPathLessonId));
        return rewardService.addRewards(user, 30, 10);
    }

    // ------------------------------------------------------------------
    // Complete module
    // ------------------------------------------------------------------

    public Map<String, Object> completeModule(Long userLearningPathLessonId, Map<String, Object> requestBody) {
        User user = getCurrentUser();

        UserLearningPathLesson pathLesson = userLearningPathLessonRepository.findById(userLearningPathLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("UserLearningPathLesson", userLearningPathLessonId));

        Integer correctAnswers = requestBody.get("correctAnswers") instanceof Integer i ? i : 5;

        List<Question> quizQuestions = questionRepository.findBySourceTypeAndParentId("ROADMAP_QUIZ", userLearningPathLessonId);
        int totalQuestions = quizQuestions.isEmpty() ? 5 : quizQuestions.size();
        double pct = (double) correctAnswers / totalQuestions;
        if (pct < 0.70) {
            throw new IllegalArgumentException(
                    "Chưa đạt yêu cầu! Bạn cần đạt tối thiểu 7 điểm (trả lời đúng 70% số câu hỏi) để qua màn.");
        }

        int quizXp    = correctAnswers * 10;
        int quizCoins = correctAnswers * 2;

        RewardResult reward = rewardService.addRewards(user, quizXp, quizCoins);

        pathLesson.setStatus("COMPLETED");
        userLearningPathLessonRepository.save(pathLesson);

        // Unlock next lesson in the path
        UserLearningPath learningPath = pathLesson.getLearningPath();
        UserLearningPathLesson nextPathLesson = null;
        for (UserLearningPathLesson pl : learningPath.getLessons()) {
            if (pl.getOrderIndex() == pathLesson.getOrderIndex() + 1) {
                nextPathLesson = pl;
                break;
            }
        }
        if (nextPathLesson != null && "LOCKED".equals(nextPathLesson.getStatus())) {
            nextPathLesson.setStatus("IN_PROGRESS");
            userLearningPathLessonRepository.save(nextPathLesson);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("xpGained",      reward.getXpGained());
        result.put("coinsGained",   reward.getCoinsGained());
        result.put("newXp",         reward.getNewXp());
        result.put("newLevel",      reward.getNewLevel());
        result.put("newCoins",      reward.getNewCoins());
        result.put("leveledUp",     reward.isLeveledUp());
        result.put("previousLevel", reward.getPreviousLevel());
        result.put("newTitle",      reward.getNewTitle());
        result.put("nextModuleId",  nextPathLesson != null ? nextPathLesson.getId() : null);
        return result;
    }

    // ------------------------------------------------------------------
    // Battle words
    // ------------------------------------------------------------------

    public List<Map<String, Object>> getBattleWords(Long userLearningPathLessonId) {
        UserLearningPathLesson pathLesson = userLearningPathLessonRepository.findById(userLearningPathLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("UserLearningPathLesson", userLearningPathLessonId));

        UserLearningPath learningPath = pathLesson.getLearningPath();
        String cefrLevel = (learningPath != null && learningPath.getRoadmap() != null && learningPath.getRoadmap().getCefrLevel() != null)
                ? learningPath.getRoadmap().getCefrLevel().toUpperCase().trim() : "A1";

        String level = "A1";
        if      (cefrLevel.contains("C1")) level = "C1";
        else if (cefrLevel.contains("B2")) level = "B2";
        else if (cefrLevel.contains("B1")) level = "B1";
        else if (cefrLevel.contains("A2")) level = "A2";

        List<VocabularyWord> words = vocabularyWordRepository.findByCefrLevelIgnoreCase(level);
        if (words == null || words.isEmpty()) {
            words = vocabularyWordRepository.findByCefrLevelIgnoreCase("A1");
        }
        if (words == null || words.isEmpty()) return Collections.emptyList();

        Collections.shuffle(words);
        List<VocabularyWord> battleWords = words.size() > 30 ? words.subList(0, 30) : words;

        List<Map<String, Object>> result = new ArrayList<>();
        for (VocabularyWord w : battleWords) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("id",                w.getId());
            entry.put("word",              w.getWord());
            entry.put("definition",        w.getDefinition());
            entry.put("partOfSpeech",      w.getPartOfSpeech());
            entry.put("phonetic",          w.getPhonetic());
            entry.put("exampleSentence",   w.getExampleSentence());
            entry.put("exampleTranslation",w.getExampleTranslation());
            result.add(entry);
        }
        return result;
    }

    // ------------------------------------------------------------------
    // Battle complete
    // ------------------------------------------------------------------

    public RewardResult completeBattle(Long userLearningPathLessonId) {
        User user = getCurrentUser();
        userLearningPathLessonRepository.findById(userLearningPathLessonId)
                .orElseThrow(() -> new ResourceNotFoundException("UserLearningPathLesson", userLearningPathLessonId));
        return rewardService.addRewards(user, 50, 15);
    }

    // ------------------------------------------------------------------
    // Pronunciation analysis
    // ------------------------------------------------------------------

    public String analyzePronunciation(String targetWord, String transcribedText) {
        if (targetWord == null || targetWord.trim().isEmpty()
                || transcribedText == null || transcribedText.trim().isEmpty()) {
            throw new IllegalArgumentException("Tham số targetWord và transcribedText không được để trống.");
        }

        String systemPrompt = """
                You are an AI Pronunciation Coach. Your task is to analyze the user's pronunciation \
                based on the target English word/phrase and the transcribed text captured by speech recognition.
                Analyze the phonetic difference and potential errors. Return ONLY a JSON object with:
                - 'score': integer 0-100
                - 'accuracy': short string in Vietnamese ('Xuất sắc', 'Tốt', 'Khá', 'Cần cải thiện')
                - 'errorAnalysis': descriptive sentence in Vietnamese
                - 'suggestions': helpful tips in Vietnamese on how to improve pronunciation
                Ensure the response is a valid, raw JSON object and nothing else.""";

        String userPrompt = String.format("Target word: \"%s\"\nTranscribed text: \"%s\"", targetWord, transcribedText);
        return groqService.generateJsonResponse(systemPrompt, userPrompt);
    }

    // ------------------------------------------------------------------
    // User profile (quick stats)
    // ------------------------------------------------------------------

    public Map<String, Object> getUserProfile() {
        User user = getCurrentUser();
        Map<String, Object> profile = new HashMap<>();
        profile.put("email",  user.getEmail());
        profile.put("streak", user.getStreak());
        profile.put("coins",  user.getCoins());
        profile.put("exp",    user.getExp());
        profile.put("level",  user.getLevel());
        return profile;
    }

    // =========================================================================
    // Private helpers
    // =========================================================================

    private Map<String, Object> buildContentResponse(String title,
                                                     String description,
                                                     String lessonType,
                                                     String bodyText,
                                                     String mediaUrl,
                                                     List<Flashcard> flashcards,
                                                     List<Question> questions) {
        Map<String, Object> response = new HashMap<>();
        response.put("moduleTitle",       title);
        response.put("moduleDescription", description);
        response.put("lessonType",        lessonType);
        response.put("bodyText",          bodyText);
        response.put("mediaUrl",          mediaUrl);
        response.put("flashcards",        flashcards);
        response.put("quizQuestions",     questions);
        return response;
    }

    private List<Flashcard> autoGenerateVocabularyFlashcards(LearningModule topic) {
        String title = topic.getTitle();
        String level = "A1";
        int moduleIndex = topic.getOrderIndex() != null ? topic.getOrderIndex() : 1;

        if      (title.toUpperCase().startsWith("A1")) { level = "A1"; }
        else if (title.toUpperCase().startsWith("A2")) { level = "A2"; }
        else if (title.toUpperCase().startsWith("B1")) { level = "B1"; }
        else if (title.toUpperCase().startsWith("B2")) { level = "B2"; }
        else if (title.toUpperCase().startsWith("C1")) { level = "C1"; }

        List<VocabularyWord> wordList =
                vocabularyWordRepository.findByCefrLevelIgnoreCaseAndModuleIndex(level, moduleIndex);
        if (wordList == null || wordList.isEmpty()) return Collections.emptyList();

        List<Flashcard> saved = new ArrayList<>();
        for (VocabularyWord vw : wordList) {
            Flashcard fc = Flashcard.builder()
                    .module(topic)
                    .word(vw.getWord())
                    .partOfSpeech(vw.getPartOfSpeech())
                    .phonetic(vw.getPhonetic())
                    .definition(vw.getDefinition())
                    .exampleSentence(vw.getExampleSentence())
                    .exampleTranslation(vw.getExampleTranslation())
                    .build();
            saved.add(flashcardRepository.save(fc));
        }
        return saved;
    }

    private List<Question> generateVocabQuizQuestionsForPathLesson(UserLearningPathLesson pathLesson, Lesson lesson) {
        List<Question> saved = new ArrayList<>();
        LearningModule topic = learningModuleRepository.findById(lesson.getContentId()).orElse(null);
        int moduleIndex = (topic != null && topic.getOrderIndex() != null) ? topic.getOrderIndex() : 1;
        String level = lesson.getLevel();

        List<VocabularyWord> wordList =
                vocabularyWordRepository.findByCefrLevelIgnoreCaseAndModuleIndex(level, moduleIndex);
        if (wordList == null || wordList.isEmpty()) return saved;

        List<VocabularyWord> p = new ArrayList<>(wordList);
        while (p.size() < 10) p.add(p.get(p.size() % wordList.size()));

        saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                .questionNumber(1).type("MULTIPLE_CHOICE")
                .questionText("Which of the following is the correct definition of the word \"" + p.get(0).getWord() + "\"?")
                .optionA(p.get(0).getDefinition()).optionB(p.get(1).getDefinition())
                .optionC(p.get(2).getDefinition()).optionD(p.get(3).getDefinition())
                .correctOption("A").correctAnswer("A")
                .explanation("\"" + p.get(0).getWord() + "\" có nghĩa là: " + p.get(0).getDefinition()).build()));

        saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                .questionNumber(2).type("MULTIPLE_CHOICE")
                .questionText("What does the word \"" + p.get(1).getWord() + "\" mean?")
                .optionA(p.get(4).getDefinition()).optionB(p.get(1).getDefinition())
                .optionC(p.get(5).getDefinition()).optionD(p.get(6).getDefinition())
                .correctOption("B").correctAnswer("B")
                .explanation("\"" + p.get(1).getWord() + "\" có nghĩa là: " + p.get(1).getDefinition()).build()));

        saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                .questionNumber(3).type("MULTIPLE_CHOICE")
                .questionText("Find the correct Vietnamese meaning of the word \"" + p.get(2).getWord() + "\":")
                .optionA(p.get(7).getDefinition()).optionB(p.get(8).getDefinition())
                .optionC(p.get(2).getDefinition()).optionD(p.get(9).getDefinition())
                .correctOption("C").correctAnswer("C")
                .explanation("\"" + p.get(2).getWord() + "\" có nghĩa là: " + p.get(2).getDefinition()).build()));

        saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                .questionNumber(4).type("MULTIPLE_CHOICE")
                .questionText("What is the meaning of the English word \"" + p.get(3).getWord() + "\"?")
                .optionA(p.get(0).getDefinition()).optionB(p.get(5).getDefinition())
                .optionC(p.get(8).getDefinition()).optionD(p.get(3).getDefinition())
                .correctOption("D").correctAnswer("D")
                .explanation("\"" + p.get(3).getWord() + "\" có nghĩa là: " + p.get(3).getDefinition()).build()));

        for (int i = 4; i < 7; i++) {
            VocabularyWord w = p.get(i);
            String sentence = (w.getExampleSentence() != null && !w.getExampleSentence().trim().isEmpty())
                    ? w.getExampleSentence() : "We need to learn the word " + w.getWord() + " daily.";
            String blanked = sentence.replaceAll("(?i)" + Pattern.quote(w.getWord()), "______");
            String opt = i == 4 ? "A" : i == 5 ? "B" : "C";
            saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                    .questionNumber(i + 1).type("FILL_IN_BLANK")
                    .questionText("Complete the sentence: \"" + blanked + "\"")
                    .optionA(i == 4 ? w.getWord().toLowerCase() : p.get(8).getWord().toLowerCase())
                    .optionB(i == 5 ? w.getWord().toLowerCase() : p.get(5).getWord().toLowerCase())
                    .optionC(i == 6 ? w.getWord().toLowerCase() : p.get(9).getWord().toLowerCase())
                    .optionD(p.get(0).getWord().toLowerCase())
                    .correctOption(opt).correctAnswer(opt)
                    .explanation("Từ cần điền là \"" + w.getWord() + "\" (" + w.getDefinition() + ")").build()));
        }

        // Q8: Phonetic
        VocabularyWord w7 = p.get(7);
        saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                .questionNumber(8).type("MULTIPLE_CHOICE")
                .questionText("What is the correct IPA phonetic transcription of the word \"" + w7.getWord() + "\"?")
                .optionA(w7.getPhonetic()).optionB(p.get(8).getPhonetic())
                .optionC(p.get(9).getPhonetic()).optionD(p.get(0).getPhonetic())
                .correctOption("A").correctAnswer("A")
                .explanation("Phiên âm IPA của \"" + w7.getWord() + "\" là " + w7.getPhonetic()).build()));

        // Q9: Part of speech
        VocabularyWord w8 = p.get(8);
        String pos = w8.getPartOfSpeech() != null ? w8.getPartOfSpeech().toLowerCase().trim() : "";
        String opt9 = pos.contains("verb") ? "B" : pos.contains("adj") ? "C" : pos.contains("adv") ? "D" : "A";
        saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                .questionNumber(9).type("MULTIPLE_CHOICE")
                .questionText("What is the part of speech of the word \"" + w8.getWord() + "\"?")
                .optionA("Noun (Danh từ)").optionB("Verb (Động từ)")
                .optionC("Adjective (Tính từ)").optionD("Adverb/Pronoun/Other")
                .correctOption(opt9).correctAnswer(opt9)
                .explanation("Từ \"" + w8.getWord() + "\" thuộc loại từ: " + w8.getPartOfSpeech()).build()));

        // Q10: Word matching
        String wordsStr = String.join("|", p.get(0).getWord(), p.get(1).getWord(), p.get(2).getWord(), p.get(3).getWord(), p.get(4).getWord());
        String defsStr  = String.join("|", p.get(0).getDefinition(), p.get(1).getDefinition(), p.get(2).getDefinition(), p.get(3).getDefinition(), p.get(4).getDefinition());
        String matchAns = p.get(0).getWord()+":"+p.get(0).getDefinition()+"|"
                        + p.get(1).getWord()+":"+p.get(1).getDefinition()+"|"
                        + p.get(2).getWord()+":"+p.get(2).getDefinition()+"|"
                        + p.get(3).getWord()+":"+p.get(3).getDefinition()+"|"
                        + p.get(4).getWord()+":"+p.get(4).getDefinition();
        saved.add(questionRepository.save(Question.builder().sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                .questionNumber(10).type("WORD_MATCHING")
                .questionText("Match the vocabulary words with their correct Vietnamese definitions:")
                .optionA(wordsStr).optionB(defsStr)
                .correctOption(matchAns).correctAnswer(matchAns)
                .explanation("Ghép các từ vựng tiếng Anh bên trái với nghĩa tiếng Việt thích hợp bên phải.").build()));

        return saved;
    }

    private List<Flashcard> generateAndSaveStudyContentFlashcards(StudyContent content) {
        List<Flashcard> saved = new ArrayList<>();
        String type = content.getType().toUpperCase().trim();
        if ("GRAMMAR".equals(type)) {
            String bodyText = content.getBodyText() != null ? content.getBodyText() : "";
            String[] parts = bodyText.split("(?m)^(?=##|###)");
            if (parts.length == 0 || (parts.length == 1 && parts[0].trim().isEmpty())) {
                parts = new String[]{"Bài học ngữ pháp " + content.getTitle()};
            }
            for (String part : parts) {
                part = part.trim();
                if (part.isEmpty()) continue;
                String cardTitle = content.getTitle(), cardBody = part;
                String[] lines = part.split("\n", 2);
                if (lines[0].startsWith("#")) {
                    cardTitle = lines[0].replace("#", "").trim();
                    cardBody  = lines.length > 1 ? lines[1].trim() : "";
                }
                saved.add(flashcardRepository.save(Flashcard.builder()
                        .studyContent(content).word(cardTitle).definition(cardBody)
                        .partOfSpeech("Ngữ pháp").phonetic("").exampleSentence("").exampleTranslation("").build()));
            }
        } else if ("LISTENING".equals(type)) {
            String mediaUrl = content.getMediaUrl();
            String audioLinkText = (mediaUrl != null && !mediaUrl.isEmpty())
                    ? "🎧 **Nhấn vào liên kết để nghe:** [Nghe file Audio bài học](" + mediaUrl + ")\n\n" : "";
            saved.add(flashcardRepository.save(Flashcard.builder()
                    .studyContent(content).word("1. Lời thoại (Transcript)")
                    .definition(audioLinkText + (content.getBodyText() != null ? content.getBodyText() : ""))
                    .partOfSpeech("Nghe hiểu").phonetic("").exampleSentence("").exampleTranslation("").build()));
            saved.add(flashcardRepository.save(Flashcard.builder()
                    .studyContent(content).word("2. Từ vựng cốt lõi (Vocabulary)")
                    .definition(content.getDescription() != null ? content.getDescription() : "Không có từ vựng bổ sung.")
                    .partOfSpeech("Từ vựng").phonetic("").exampleSentence("").exampleTranslation("").build()));
        } else if ("READING".equals(type)) {
            saved.add(flashcardRepository.save(Flashcard.builder()
                    .studyContent(content).word("1. Bài đọc hiểu (Passage)")
                    .definition(content.getBodyText() != null ? content.getBodyText() : "")
                    .partOfSpeech("Đọc hiểu").phonetic("").exampleSentence("").exampleTranslation("").build()));
            saved.add(flashcardRepository.save(Flashcard.builder()
                    .studyContent(content).word("2. Bản dịch & Từ vựng")
                    .definition(content.getDescription() != null ? content.getDescription() : "")
                    .partOfSpeech("Dịch & Từ khóa").phonetic("").exampleSentence("").exampleTranslation("").build()));
        }
        return saved;
    }

    private List<Question> generateStudyContentQuizQuestionsForPathLesson(UserLearningPathLesson pathLesson, Lesson lesson, StudyContent content) {
        List<Question> saved = new ArrayList<>();
        String mainCategory = lesson.getType().name();
        String mediaUrl = "LISTENING".equals(mainCategory) ? content.getMediaUrl() : null;

        List<Question> origQs = questionRepository.findBySourceTypeAndParentId(mainCategory, content.getId());
        for (Question oq : origQs) {
            Question nq = Question.builder()
                    .sourceType("ROADMAP_QUIZ").parentId(pathLesson.getId())
                    .questionNumber(oq.getQuestionNumber()).type(oq.getType())
                    .questionText(oq.getQuestionText())
                    .audioUrl(oq.getAudioUrl() != null ? oq.getAudioUrl() : mediaUrl)
                    .imageUrl(oq.getImageUrl())
                    .optionA(oq.getOptionA()).optionB(oq.getOptionB())
                    .optionC(oq.getOptionC()).optionD(oq.getOptionD())
                    .correctOption(oq.getCorrectOption()).correctAnswer(oq.getCorrectAnswer())
                    .explanation(oq.getExplanation()).build();
            saved.add(questionRepository.save(nq));
        }
        return saved;
    }

    private List<Flashcard> filterFlashcardsByCategory(List<Flashcard> all, String targetCategory) {
        List<Flashcard> result = new ArrayList<>();
        for (Flashcard fc : all) {
            String pos = fc.getPartOfSpeech() != null ? fc.getPartOfSpeech() : "";
            boolean match = switch (targetCategory) {
                case "GRAMMAR"    -> "Ngữ pháp".equalsIgnoreCase(pos);
                case "LISTENING"  -> "Nghe hiểu".equalsIgnoreCase(pos) || "Từ vựng".equalsIgnoreCase(pos)
                        || "Lời thoại (Transcript)".equalsIgnoreCase(fc.getWord())
                        || "2. Từ vựng cốt lõi (Vocabulary)".equalsIgnoreCase(fc.getWord());
                case "READING"    -> "Đọc hiểu".equalsIgnoreCase(pos) || "Dịch & Từ khóa".equalsIgnoreCase(pos)
                        || "1. Bài đọc hiểu (Passage)".equalsIgnoreCase(fc.getWord())
                        || "2. Bản dịch & Từ vựng".equalsIgnoreCase(fc.getWord());
                default           -> !"Ngữ pháp".equalsIgnoreCase(pos)
                        && !"Nghe hiểu".equalsIgnoreCase(pos)
                        && !"Đọc hiểu".equalsIgnoreCase(pos)
                        && !"Dịch & Từ khóa".equalsIgnoreCase(pos)
                        && !"1. Lời thoại (Transcript)".equalsIgnoreCase(fc.getWord())
                        && !"2. Từ vựng cốt lõi (Vocabulary)".equalsIgnoreCase(fc.getWord())
                        && !"1. Bài đọc hiểu (Passage)".equalsIgnoreCase(fc.getWord())
                        && !"2. Bản dịch & Từ vựng".equalsIgnoreCase(fc.getWord());
            };
            if (match) result.add(fc);
        }
        return result;
    }
}
