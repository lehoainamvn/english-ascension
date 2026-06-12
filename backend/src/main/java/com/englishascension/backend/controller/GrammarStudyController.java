package com.englishascension.backend.controller;

import com.englishascension.backend.model.*;
import com.englishascension.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/grammar")
public class GrammarStudyController {

    private static final Logger log = LoggerFactory.getLogger(GrammarStudyController.class);

    private final UserRepository userRepository;
    private final StudyContentRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    public GrammarStudyController(
            UserRepository userRepository,
            StudyContentRepository lessonRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
    }

    @GetMapping("/lessons")
    public ResponseEntity<?> getLessons() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (lessonRepository.findByType("GRAMMAR").isEmpty()) {
            seedLessonsAndQuestions();
        }

        List<StudyContent> lessons = lessonRepository.findByType("GRAMMAR");
        List<UserProgress> lessonProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "GRAMMAR_LESSON");
        List<UserProgress> practiceProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "GRAMMAR_PRACTICE");

        // Map progress for quick lookup
        Map<Long, Boolean> lessonCompletedMap = new HashMap<>();
        for (UserProgress p : lessonProgressList) {
            lessonCompletedMap.put(p.getResourceId(), p.isCompleted());
        }

        Map<Long, Boolean> practiceCompletedMap = new HashMap<>();
        Map<Long, Integer> scoreMap = new HashMap<>();
        for (UserProgress p : practiceProgressList) {
            practiceCompletedMap.put(p.getResourceId(), p.isCompleted());
            scoreMap.put(p.getResourceId(), p.getScore());
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent lesson : lessons) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", lesson.getId());
            item.put("title", lesson.getTitle());
            item.put("vietnameseTitle", lesson.getCategory());
            item.put("questionsCount", lesson.getQuestionsCount());
            item.put("xpRewardLesson", 30);
            item.put("coinRewardLesson", 10);
            item.put("xpRewardPractice", 50);
            item.put("coinRewardPractice", 15);

            item.put("lessonCompleted", lessonCompletedMap.getOrDefault(lesson.getId(), false));
            item.put("practiceCompleted", practiceCompletedMap.getOrDefault(lesson.getId(), false));
            item.put("score", scoreMap.get(lesson.getId()));
            response.add(item);
        }

        // Sort response by ID for stability
        response.sort(Comparator.comparing(item -> (Long) item.get("id")));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<?> getLesson(@PathVariable Long lessonId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress lessonProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_LESSON", lessonId).orElse(null);
        UserProgress practiceProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_PRACTICE", lessonId).orElse(null);

        Map<String, Object> response = new HashMap<>();
        response.put("id", lesson.getId());
        response.put("title", lesson.getTitle());
        response.put("vietnameseTitle", lesson.getCategory());
        response.put("theoryContent", lesson.getBodyText());
        response.put("xpRewardLesson", 30);
        response.put("coinRewardLesson", 10);
        response.put("xpRewardPractice", 50);
        response.put("coinRewardPractice", 15);
        response.put("lessonCompleted", lessonProgress != null && lessonProgress.isCompleted());
        response.put("practiceCompleted", practiceProgress != null && practiceProgress.isCompleted());
        response.put("score", practiceProgress != null ? practiceProgress.getScore() : null);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/lessons/{lessonId}/questions")
    public ResponseEntity<?> getQuestions(@PathVariable Long lessonId) {
        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = questionRepository.findBySourceTypeAndParentId("GRAMMAR", lessonId);
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/lessons/{lessonId}/complete-lesson")
    public ResponseEntity<?> completeLesson(@PathVariable Long lessonId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_LESSON", lessonId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("GRAMMAR_LESSON")
                        .resourceId(lessonId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            xpGained = 30;
            coinsGained = 10;
            
            // Add rewards
            addRewardsToUser(user, xpGained, coinsGained);
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/lessons/{lessonId}/complete-practice")
    public ResponseEntity<?> completePractice(@PathVariable Long lessonId, @RequestBody Map<String, Object> request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null || !"GRAMMAR".equals(lesson.getType())) {
            return ResponseEntity.notFound().build();
        }

        Integer score = (Integer) request.get("score");
        if (score == null) {
            score = 100; // default
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "GRAMMAR_PRACTICE", lessonId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("GRAMMAR_PRACTICE")
                        .resourceId(lessonId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setScore(score);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            xpGained = 50;
            coinsGained = 15;

            // Add rewards
            addRewardsToUser(user, xpGained, coinsGained);
        } else {
            // Update score if higher
            if (progress.getScore() == null || score > progress.getScore()) {
                progress.setScore(score);
                progressRepository.save(progress);
            }
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        return ResponseEntity.ok(result);
    }

    private void addRewardsToUser(User user, int xp, int coins) {
        int currentExp = user.getExp();
        int currentLevel = user.getLevel();
        int currentCoins = user.getCoins();

        currentExp += xp;
        currentCoins += coins;

        boolean leveledUp = false;
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

        if (leveledUp) {
            String newTitle = calculateTitle(currentLevel);
            user.setCharacterTitle(newTitle);
        }

        userRepository.save(user);
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

    private Map<String, Object> getRewardResponseMap(User user, int xpGained, int coinsGained) {
        Map<String, Object> result = new HashMap<>();
        result.put("xpGained", xpGained);
        result.put("coinsGained", coinsGained);
        result.put("newXp", user.getExp());
        result.put("newLevel", user.getLevel());
        result.put("newCoins", user.getCoins());
        result.put("leveledUp", xpGained > 0 && user.getExp() < xpGained);
        result.put("previousLevel", user.getLevel());
        result.put("newTitle", user.getCharacterTitle() != null ? user.getCharacterTitle() : "Novice");
        return result;
    }

    private void seedLessonsAndQuestions() {
        log.info("Seeding grammar lessons and default questions...");

        // Theory contents
        String theoryBasic = "### 1. Cấu trúc câu cơ bản (Basic Sentence Structure)\n" +
                "Trong tiếng Anh, một câu hoàn chỉnh thường bao gồm:\n" +
                "- **Chủ ngữ (Subject - S)**: Danh từ hoặc đại từ thực hiện hành động (e.g., *She, They*).\n" +
                "- **Động từ (Verb - V)**: Chỉ hành động hoặc trạng thái (e.g., *run, is*).\n" +
                "- **Tân ngữ (Object - O)**: Nhận tác động của hành động (e.g., *English*).\n\n" +
                "### 2. Thì Hiện tại đơn (Simple Present)\n" +
                "- **Công thức**: S + V(s/es)\n" +
                "- **Sử dụng**: Diễn tả một sự thật hiển nhiên, thói quen hằng ngày.\n" +
                "- **Ví dụ**: *He works in an office.* (Anh ấy làm việc ở văn phòng).\n\n" +
                "### 3. Thì Hiện tại tiếp diễn (Present Continuous)\n" +
                "- **Công thức**: S + am/is/are + V-ing\n" +
                "- **Sử dụng**: Diễn tả hành động đang xảy ra tại thời điểm nói.\n" +
                "- **Ví dụ**: *We are studying grammar.*";

        String theoryNouns = "### 1. Định nghĩa Danh từ (Nouns)\n" +
                "Danh từ là từ dùng để chỉ người, vật, sự việc, địa điểm hoặc khái niệm.\n\n" +
                "### 2. Cách nhận biết hậu tố (Suffixes) của Danh từ\n" +
                "Bạn có thể xác định danh từ dựa vào đuôi từ. Các đuôi danh từ phổ biến:\n" +
                "- **-tion / -sion**: information, decision, selection\n" +
                "- **-ment**: agreement, development, payment\n" +
                "- **-ness**: happiness, weakness, effectiveness\n" +
                "- **-er / -or / -ee** (chỉ người): manager, supervisor, employee\n" +
                "- **-ity**: activity, security, responsibility\n\n" +
                "### 3. Vị trí của Danh từ trong câu\n" +
                "- Làm chủ ngữ đứng đầu câu trước động từ chính.\n" +
                "- Đứng sau mạo từ (*a, an, the*) hoặc tính từ sở hữu (*my, his, your*).\n" +
                "- Đứng sau tính từ để tạo thành cụm danh từ: *a **great achievement**.*";

        String theoryVerbs = "### 1. Động từ trong tiếng Anh (Verbs)\n" +
                "Động từ là phần quan trọng nhất trong câu tiếng Anh, dùng để diễn tả hành động hoặc trạng thái.\n\n" +
                "### 2. Phân loại động từ chính\n" +
                "- **Action Verbs (Động từ chỉ hành động)**: run, write, build, analyze.\n" +
                "- **State Verbs (Động từ chỉ trạng thái)**: like, know, believe, remain.\n" +
                "- **Auxiliary Verbs (Trợ động từ)**: do, does, have, has, is, are.\n\n" +
                "### 3. Vị trí và chia động từ\n" +
                "- Động từ đứng ngay sau chủ ngữ.\n" +
                "- Cần chia động từ theo đúng chủ ngữ (ít/nhiều) và thì của câu.\n" +
                "- Động từ đi sau **to** ở dạng nguyên mẫu: *decide to **postpone***.";

        String theoryVoice = "### 1. Thể chủ động & Bị động (Active & Passive Voice)\n" +
                "- **Chủ động (Active)**: Chủ ngữ thực hiện hành động.\n" +
                "  - *Ví dụ*: *The CEO signed the contract.* (CEO ký hợp đồng).\n" +
                "- **Bị động (Passive)**: Chủ ngữ nhận tác động của hành động.\n" +
                "  - *Ví dụ*: *The contract was signed by the CEO.* (Hợp đồng được ký bởi CEO).\n\n" +
                "### 2. Công thức thể bị động chung\n" +
                "**S + be + Past Participle (V3/ed) (+ by Object)**\n" +
                "- Tùy vào thì của câu mà ta chia động từ **be** tương ứng (am/is/are, was/were, have been, etc.).\n" +
                "- Thường dùng khi người thực hiện hành động không quan trọng hoặc không rõ là ai.";

        String theoryAdjectives = "### 1. Tính từ là gì? (Adjectives)\n" +
                "Tính từ dùng để miêu tả đặc điểm, tính chất của danh từ, giúp câu sinh động và rõ ý hơn.\n\n" +
                "### 2. Vị trí của tính từ\n" +
                "- Đứng **trước** danh từ để bổ nghĩa: *an **expensive** computer.*\n" +
                "- Đứng **sau** các động từ liên kết (linking verbs) như: *be, look, seem, become, feel*:\n" +
                "  - *Ví dụ*: *The report seems **complete**.*\n\n" +
                "### 3. Đuôi tính từ thông dụng\n" +
                "- **-ful**: helpful, beautiful\n" +
                "- **-ive**: creative, active\n" +
                "- **-able / -ible**: valuable, flexible\n" +
                "- **-ous**: dangerous, serious";

        String theoryAdverbs = "### 1. Trạng từ là gì? (Adverbs)\n" +
                "Trạng từ dùng để bổ nghĩa cho động từ, tính từ hoặc một trạng từ khác.\n\n" +
                "### 2. Cách cấu tạo trạng từ thông dụng\n" +
                "Thường được tạo thành bằng cách thêm đuôi **-ly** vào sau tính từ:\n" +
                "- *Adjective + -ly = Adverb*\n" +
                "- *Ví dụ*: *careful* &rarr; *carefully*, *smooth* &rarr; *smoothly*.\n\n" +
                "### 3. Vị trí của trạng từ\n" +
                "- Đứng sau động từ thường để bổ nghĩa cách thức: *run **quickly**.*\n" +
                "- Đứng trước tính từ để nhấn mạnh: *highly **effective**.*\n" +
                "- Đứng đầu câu để bổ nghĩa cho cả câu.";

        String theoryPronouns = "### 1. Đại từ (Pronouns)\n" +
                "Đại từ dùng để thay thế cho danh từ nhằm tránh lặp từ trong câu.\n\n" +
                "### 2. Phân loại đại từ chính\n" +
                "- **Đại từ nhân xưng chủ ngữ (Subject)**: I, you, he, she, it, we, they.\n" +
                "- **Đại từ nhân xưng tân ngữ (Object)**: me, you, him, her, it, us, them.\n" +
                "- **Tính từ sở hữu (Possessive Adjective)**: my, your, his, her, its, our, their (cần đi kèm danh từ).\n" +
                "- **Đại từ sở hữu (Possessive Pronoun)**: mine, yours, his, hers, ours, theirs (không cần danh từ).\n" +
                "- **Đại từ phản thân (Reflexive Pronoun)**: myself, yourself, himself, ourselves.";

        String theoryComparison = "### 1. Câu so sánh trong tiếng Anh (Comparisons)\n" +
                "Dùng để so sánh đặc điểm giữa hai hoặc nhiều chủ thể.\n\n" +
                "### 2. So sánh hơn (Comparative)\n" +
                "- **Tính từ ngắn**: adj-er + than (*harder than*)\n" +
                "- **Tính từ dài**: more + adj + than (*more expensive than*)\n\n" +
                "### 3. So sánh nhất (Superlative)\n" +
                "- **Tính từ ngắn**: the + adj-est (*the biggest*)\n" +
                "- **Tính từ dài**: the most + adj (*the most important*)\n\n" +
                "### 4. So sánh bằng\n" +
                "- **Công thức**: as + adj/adv + as (*as beautiful as*)";

        String theoryTest = "### 1. Thực chiến câu hỏi ngữ pháp TOEIC Part 5\n" +
                "Các câu hỏi ngữ pháp thực tế trong bài thi thường kiểm tra kỹ năng:\n" +
                "- Phân biệt từ loại (Danh từ, Tính từ, Động từ, Trạng từ).\n" +
                "- Sự hòa hợp giữa chủ ngữ và động từ (Subject-Verb Agreement).\n" +
                "- Thì của động từ và câu điều kiện.\n\n" +
                "### 2. Mẹo làm bài nhanh\n" +
                "- Luôn nhìn vào các từ đứng ngay trước và ngay sau chỗ trống để xác định loại từ cần điền.\n" +
                "- Tìm kiếm các từ nhận biết thời gian (since, by the time, yesterday) để chọn đúng thì.";

        // Create lessons
        StudyContent l1 = StudyContent.builder().type("GRAMMAR").title("Basic Grammar Knowledge").category("Kiến thức ngữ pháp cơ bản").questionsCount(3).bodyText(theoryBasic).orderIndex(1).build();
        StudyContent l2 = StudyContent.builder().type("GRAMMAR").title("Nouns").category("Danh từ").questionsCount(3).bodyText(theoryNouns).orderIndex(2).build();
        StudyContent l3 = StudyContent.builder().type("GRAMMAR").title("Verbs").category("Động từ").questionsCount(3).bodyText(theoryVerbs).orderIndex(3).build();
        StudyContent l4 = StudyContent.builder().type("GRAMMAR").title("Active and Passive Voice").category("Câu chủ động và câu bị động").questionsCount(3).bodyText(theoryVoice).orderIndex(4).build();
        StudyContent l5 = StudyContent.builder().type("GRAMMAR").title("Adjectives").category("Tính từ").questionsCount(3).bodyText(theoryAdjectives).orderIndex(5).build();
        StudyContent l6 = StudyContent.builder().type("GRAMMAR").title("Adverbs").category("Trạng từ").questionsCount(3).bodyText(theoryAdverbs).orderIndex(6).build();
        StudyContent l7 = StudyContent.builder().type("GRAMMAR").title("Pronouns").category("Đại từ").questionsCount(3).bodyText(theoryPronouns).orderIndex(7).build();
        StudyContent l8 = StudyContent.builder().type("GRAMMAR").title("Comparison Sentences").category("Câu so sánh").questionsCount(3).bodyText(theoryComparison).orderIndex(8).build();
        StudyContent l9 = StudyContent.builder().type("GRAMMAR").title("Actual test questions").category("Câu hỏi từ đề thi thật").questionsCount(3).bodyText(theoryTest).orderIndex(9).build();

        l1 = lessonRepository.save(l1);
        l2 = lessonRepository.save(l2);
        l3 = lessonRepository.save(l3);
        l4 = lessonRepository.save(l4);
        l5 = lessonRepository.save(l5);
        l6 = lessonRepository.save(l6);
        l7 = lessonRepository.save(l7);
        l8 = lessonRepository.save(l8);
        l9 = lessonRepository.save(l9);

        // Questions seed list
        List<Question> qList = new ArrayList<>();

        // Lesson 1
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l1.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("She _______ to the gym every morning.")
                .optionA("go").optionB("goes").optionC("going").optionD("gone").correctOption("B").correctAnswer("B")
                .explanation("Với chủ ngữ số ít ngôi thứ ba 'She', ta thêm 's/es' vào động từ ở thì hiện tại đơn. Đáp án đúng là 'goes'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l1.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("We _______ studying English at this moment.")
                .optionA("is").optionB("am").optionC("are").optionD("was").correctOption("C").correctAnswer("C")
                .explanation("Chủ ngữ số nhiều 'We' đi với động từ tobe 'are' ở thì hiện tại tiếp diễn.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l1.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete: \"They have _______ (be) friends for ten years.\"")
                .correctOption("been").correctAnswer("been")
                .explanation("Động từ tobe phân từ hai (V3) đi sau 'have' trong thì hiện tại hoàn thành là 'been'.").build());

        // Lesson 2
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l2.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("The manager is responsible for the overall _______ of the team.")
                .optionA("effective").optionB("effectively").optionC("effectiveness").optionD("effect").correctOption("C").correctAnswer("C")
                .explanation("'overall' là tính từ nên sau nó phải điền một danh từ. 'effectiveness' (hiệu quả) là danh từ phù hợp nhất.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l2.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("Please submit your _______ before Friday afternoon.")
                .optionA("propose").optionB("proposal").optionC("proposing").optionD("proposed").correctOption("B").correctAnswer("B")
                .explanation("Sau tính từ sở hữu 'your' cần một danh từ. 'proposal' (bản đề xuất) là danh từ.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l2.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Fill in the blank with plural noun: \"The company received many _______ (complain) from users.\"")
                .correctOption("complaints").correctAnswer("complaints")
                .explanation("Sau 'many' đi với danh từ số nhiều. Dạng số nhiều của complain là 'complaints' (lời phàn nàn).").build());

        // Lesson 3
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l3.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("The board of directors decided to _______ the project due to budget issues.")
                .optionA("postpone").optionB("postponement").optionC("postponed").optionD("postponing").correctOption("A").correctAnswer("A")
                .explanation("Cấu trúc 'decide to + V-infinitive' yêu cầu động từ nguyên thể 'postpone' (hoãn lại).").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l3.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("Our team has _______ the annual sales target.")
                .optionA("achieve").optionB("achieved").optionC("achieving").optionD("achievement").correctOption("B").correctAnswer("B")
                .explanation("Thì hiện tại hoàn thành 'has + V3/ed' yêu cầu động từ ở dạng quá khứ phân từ 'achieved'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l3.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete: \"He wants _______ (learn) how to speak English fluently.\"")
                .correctOption("to learn").correctAnswer("to learn")
                .explanation("Động từ 'want' yêu cầu động từ theo sau là 'to + V-infinitive' tức 'to learn'.").build());

        // Lesson 4
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l4.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("The contract _______ by the CEO yesterday.")
                .optionA("signs").optionB("signed").optionC("was signed").optionD("is signing").correctOption("C").correctAnswer("C")
                .explanation("Hợp đồng được ký bởi CEO (bị động) ở quá khứ đơn (yesterday) nên cấu trúc là 'was signed'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l4.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("English _______ all over the world by millions of people.")
                .optionA("speaks").optionB("is spoken").optionC("spoken").optionD("is speaking").correctOption("B").correctAnswer("B")
                .explanation("Tiếng Anh được nói (bị động) trên toàn thế giới, diễn tả một sự thật hiển nhiên ở hiện tại dùng 'is spoken'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l4.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete: \"The decision was _______ (make) by the committee last night.\"")
                .correctOption("made").correctAnswer("made")
                .explanation("Thể bị động dạng 'was + V3'. Quá khứ phân từ của make là 'made'.").build());

        // Lesson 5
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l5.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("She is a very _______ person who always supports her friends.")
                .optionA("kind").optionB("kindly").optionC("kindness").optionD("kinder").correctOption("A").correctAnswer("A")
                .explanation("Danh từ 'person' cần tính từ đứng trước bổ nghĩa. 'kind' (tốt bụng) là tính từ.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l5.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("The customer service results were highly _______.")
                .optionA("satisfy").optionB("satisfying").optionC("satisfaction").optionD("satisfactorily").correctOption("B").correctAnswer("B")
                .explanation("Động từ tobe 'were' làm tính từ bổ nghĩa cho chủ thể 'results' là 'satisfying'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l5.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete comparative: \"This new laptop is _______ (expensive) than the old one.\"")
                .correctOption("more expensive").correctAnswer("more expensive")
                .explanation("So sánh hơn với tính từ dài 'expensive' sử dụng 'more expensive'.").build());

        // Lesson 6
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l6.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("The clerk typed the contract _______ to make no errors.")
                .optionA("careful").optionB("carefully").optionC("care").optionD("carelessness").correctOption("B").correctAnswer("B")
                .explanation("Động từ hành động 'typed' cần trạng từ 'carefully' đứng sau bổ nghĩa cách thức thực hiện hành động.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l6.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("The new operating system runs _______ on all devices.")
                .optionA("smooth").optionB("smoothly").optionC("smoothness").optionD("smooths").correctOption("B").correctAnswer("B")
                .explanation("Động từ 'runs' cần trạng từ 'smoothly' để bổ nghĩa cách thức chạy của hệ điều hành.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l6.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete: \"She speaks English very _______ (fluent).\"")
                .correctOption("fluently").correctAnswer("fluently")
                .explanation("Trạng từ bổ nghĩa cho động từ hành động 'speaks' là 'fluently'.").build());

        // Lesson 7
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l7.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("David introduced _______ to the new team members on his first day.")
                .optionA("he").optionB("him").optionC("himself").optionD("his").correctOption("C").correctAnswer("C")
                .explanation("David tự giới thiệu bản thân, do đó cần dùng đại từ phản thân 'himself'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l7.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("We should collaborate to improve _______ project results.")
                .optionA("us").optionB("our").optionC("ours").optionD("ourselves").correctOption("B").correctAnswer("B")
                .explanation("Đứng trước danh từ 'project results' cần tính từ sở hữu 'our'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l7.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete: \"Is this vocabulary book _______ (you) or mine?\"")
                .correctOption("yours").correctAnswer("yours")
                .explanation("Dùng đại từ sở hữu 'yours' thay thế cho 'your book' để tránh lặp từ.").build());

        // Lesson 8
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l8.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("This is the _______ challenge I have ever faced in this job.")
                .optionA("big").optionB("bigger").optionC("biggest").optionD("most big").correctOption("C").correctAnswer("C")
                .explanation("Có cấu trúc 'the + adj-est' và cụm từ 'ever faced' chỉ so sánh nhất: 'the biggest'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l8.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("Working in a team is often _______ than working alone.")
                .optionA("good").optionB("better").optionC("best").optionD("more good").correctOption("B").correctAnswer("B")
                .explanation("Có từ 'than' là so sánh hơn. Tính từ tốt 'good' chuyển sang so sánh hơn là 'better'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l8.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete with adverb: \"He runs as _______ (fast) as a professional athlete.\"")
                .correctOption("fast").correctAnswer("fast")
                .explanation("Cấu trúc so sánh bằng 'as + adj/adv + as'. Trạng từ của 'fast' giữ nguyên là 'fast'.").build());

        // Lesson 9
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l9.getId()).questionNumber(1).type("MULTIPLE_CHOICE").questionText("Neither the teacher nor the students _______ present at the meeting yesterday.")
                .optionA("was").optionB("were").optionC("are").optionD("is").correctOption("B").correctAnswer("B")
                .explanation("Cấu trúc 'neither... nor...' chia động từ theo chủ ngữ gần nhất là 'students' (số nhiều) và có 'yesterday' chỉ quá khứ nên dùng 'were'.").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l9.getId()).questionNumber(2).type("MULTIPLE_CHOICE").questionText("By the time the manager arrived at the office, the reports _______ printed.")
                .optionA("already").optionB("have already been").optionC("had already been").optionD("were already").correctOption("C").correctAnswer("C")
                .explanation("Thì quá khứ hoàn thành bị động 'had already been + V3' để diễn tả hành động được hoàn thành trước một thời điểm quá khứ (arrived).").build());
        qList.add(Question.builder().sourceType("GRAMMAR").parentId(l9.getId()).questionNumber(3).type("FILL_IN_BLANK").questionText("Complete: \"If he had studied harder last night, he would have _______ (pass) the exam.\"")
                .correctOption("passed").correctAnswer("passed")
                .explanation("Cấu trúc câu điều kiện loại 3: 'would have + V3/ed'. Dạng quá khứ phân từ của pass là 'passed'.").build());

        questionRepository.saveAll(qList);
        log.info("Seeding completed successfully with 9 lessons and 27 questions.");
    }
}
