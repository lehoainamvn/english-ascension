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
@RequestMapping("/api/reading")
public class ReadingStudyController {

    private static final Logger log = LoggerFactory.getLogger(ReadingStudyController.class);

    private final UserRepository userRepository;
    private final PlayerCharacterRepository characterRepository;
    private final StudyContentRepository articleRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository progressRepository;

    public ReadingStudyController(
            UserRepository userRepository,
            PlayerCharacterRepository characterRepository,
            StudyContentRepository articleRepository,
            QuestionRepository questionRepository,
            UserProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.characterRepository = characterRepository;
        this.articleRepository = articleRepository;
        this.questionRepository = questionRepository;
        this.progressRepository = progressRepository;
    }

    @GetMapping("/articles")
    public ResponseEntity<?> getArticles() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (articleRepository.findByType("READING").isEmpty()) {
            seedReadingData();
        }

        List<StudyContent> articles = articleRepository.findByType("READING");
        List<UserProgress> articleProgressList = progressRepository.findByUserIdAndResourceType(user.getId(), "READING_ARTICLE");

        Map<Long, Boolean> completedArticlesMap = new HashMap<>();
        for (UserProgress p : articleProgressList) {
            completedArticlesMap.put(p.getResourceId(), p.isCompleted());
        }

        List<Map<String, Object>> response = new ArrayList<>();
        for (StudyContent art : articles) {
            Map<String, Object> item = new HashMap<>();
            item.put("id", art.getId());
            item.put("title", art.getTitle());
            item.put("level", art.getDuration()); // Level mapped to duration
            item.put("questionsCount", art.getQuestionsCount());
            
            boolean isCompleted = completedArticlesMap.getOrDefault(art.getId(), false);
            item.put("isCompleted", isCompleted);
            
            response.add(item);
        }

        response.sort(Comparator.comparing(item -> (Long) item.get("id")));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/articles/{articleId}")
    public ResponseEntity<?> getArticleDetails(@PathVariable Long articleId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent article = articleRepository.findById(articleId).orElse(null);
        if (article == null || !"READING".equals(article.getType())) {
            return ResponseEntity.notFound().build();
        }

        List<Question> questions = questionRepository.findBySourceTypeAndParentId("READING", articleId);
        List<UserProgress> userQProgress = progressRepository.findByUserIdAndResourceType(user.getId(), "READING_QUESTION");
        
        Optional<UserProgress> userArtProgress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_ARTICLE", articleId);

        Map<Long, Boolean> questionStatusMap = new HashMap<>();
        for (UserProgress qp : userQProgress) {
            if (qp.isCompleted()) {
                questionStatusMap.put(qp.getResourceId(), true);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", article.getId());
        response.put("title", article.getTitle());
        response.put("content", article.getBodyText());
        response.put("vietnameseContent", article.getDescription());
        response.put("level", article.getDuration()); // Level mapped to duration
        response.put("questionsCount", article.getQuestionsCount());
        response.put("vocabularyJson", article.getMediaUrl()); // Vocab JSON mapped to mediaUrl
        response.put("isCompleted", userArtProgress.isPresent() && userArtProgress.get().isCompleted());

        List<Map<String, Object>> questionsList = new ArrayList<>();
        for (Question q : questions) {
            Map<String, Object> qMap = new HashMap<>();
            qMap.put("id", q.getId());
            qMap.put("questionNumber", q.getQuestionNumber());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("optionA", q.getOptionA());
            qMap.put("optionB", q.getOptionB());
            qMap.put("optionC", q.getOptionC());
            qMap.put("optionD", q.getOptionD());
            qMap.put("correctOption", q.getCorrectOption());
            qMap.put("explanation", q.getExplanation());
            qMap.put("isCorrect", questionStatusMap.getOrDefault(q.getId(), false));
            questionsList.add(qMap);
        }
        questionsList.sort(Comparator.comparing(q -> (Integer) q.get("questionNumber")));
        response.put("questions", questionsList);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/questions/{questionId}/submit")
    public ResponseEntity<?> submitAnswer(@PathVariable Long questionId, @RequestParam String selectedOption) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null || !"READING".equals(question.getSourceType())) {
            return ResponseEntity.notFound().build();
        }

        boolean isCorrect = question.getCorrectOption() != null && question.getCorrectOption().equalsIgnoreCase(selectedOption.trim());
        int xpGained = 0;
        int coinsGained = 0;

        if (isCorrect) {
            UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_QUESTION", questionId)
                    .orElseGet(() -> UserProgress.builder()
                            .user(user)
                            .resourceType("READING_QUESTION")
                            .resourceId(questionId)
                            .completed(false)
                            .build());

            if (!progress.isCompleted()) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
                progressRepository.save(progress);

                // Correct answer reward: +10 EXP, +2 Coins
                xpGained = 10;
                coinsGained = 2;
                addRewardsToUser(user, xpGained, coinsGained);
            }
        }

        Map<String, Object> result = getRewardResponseMap(user, xpGained, coinsGained);
        result.put("isCorrect", isCorrect);
        result.put("correctOption", question.getCorrectOption());
        result.put("explanation", question.getExplanation());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/articles/{articleId}/complete")
    public ResponseEntity<?> completeArticle(@PathVariable Long articleId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        StudyContent article = articleRepository.findById(articleId).orElse(null);
        if (article == null || !"READING".equals(article.getType())) {
            return ResponseEntity.notFound().build();
        }

        UserProgress progress = progressRepository.findByUserIdAndResourceTypeAndResourceId(user.getId(), "READING_ARTICLE", articleId)
                .orElseGet(() -> UserProgress.builder()
                        .user(user)
                        .resourceType("READING_ARTICLE")
                        .resourceId(articleId)
                        .completed(false)
                        .build());

        int xpGained = 0;
        int coinsGained = 0;

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);

            // Article completion reward: +50 EXP, +15 Coins
            xpGained = 50;
            coinsGained = 15;
            addRewardsToUser(user, xpGained, coinsGained);
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

        if (leveledUp && user.getPlayerCharacter() != null) {
            PlayerCharacter character = user.getPlayerCharacter();
            String newTitle = calculateTitle(currentLevel);
            character.setTitle(newTitle);
            characterRepository.save(character);
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
        result.put("newTitle", user.getPlayerCharacter() != null ? user.getPlayerCharacter().getTitle() : "Novice");
        return result;
    }

    private void seedReadingData() {
        log.info("Seeding Reading Articles and Questions...");

        // Article 1
        String art1Content = "To: All Staff\nFrom: HR Department\nSubject: Company Lunch Party\n\nWe are happy to announce a company lunch party on Friday, March 10.\nThe event will start at 12:00 p.m. in the main office hall.\nThis party is organized to celebrate our successful year.\nAll employees are invited to attend.\nLunch and drinks will be free of charge.\nPlease confirm your attendance by March 7 by sending an email to the HR Department.";
        String art1ViContent = "Gửi: Toàn thể nhân viên\nTừ: Phòng Nhân sự\nChủ đề: Tiệc trưa công ty\n\nChúng tôi rất vui mừng thông báo về tiệc trưa công ty vào thứ Sáu, ngày 10 tháng 3.\nSự kiện sẽ bắt đầu lúc 12:00 trưa tại sảnh văn phòng chính.\nBữa tiệc này được tổ chức để ăn mừng một năm thành công của chúng ta.\nTất cả nhân viên đều được mời tham dự.\nBữa trưa và đồ uống sẽ được miễn phí.\nVui lòng xác nhận sự tham gia của bạn trước ngày 7 tháng 3 bằng cách gửi email đến Phòng Nhân sự.";
        String art1Vocab = "[{\"word\":\"announce\",\"phonetic\":\"/əˈnaʊns/\",\"meaning\":\"thông báo, tuyên bố\"},{\"word\":\"celebrate\",\"phonetic\":\"/ˈselɪbreɪt/\",\"meaning\":\"ăn mừng, kỷ niệm\"},{\"word\":\"attendance\",\"phonetic\":\"/əˈtendəns/\",\"meaning\":\"sự tham gia, sự hiện diện\"},{\"word\":\"free of charge\",\"phonetic\":\"/friː əv tʃɑːdʒ/\",\"meaning\":\"miễn phí\"}]";
        StudyContent a1 = StudyContent.builder()
                .title("Company Lunch Party (E-mail)")
                .type("READING")
                .bodyText(art1Content)
                .description(art1ViContent)
                .duration(1) // Level 1
                .questionsCount(4)
                .mediaUrl(art1Vocab)
                .orderIndex(1)
                .build();
        a1 = articleRepository.save(a1);

        List<Question> a1q = new ArrayList<>();
        a1q.add(Question.builder().sourceType("READING").parentId(a1.getId()).questionNumber(1)
                .questionText("What is the purpose of the email?")
                .optionA("To change work hours").optionB("To announce a party").optionC("To introduce a new manager").optionD("To sell food")
                .correctOption("B").correctAnswer("B").explanation("The email states: 'We are happy to announce a company lunch party...'").build());
        a1q.add(Question.builder().sourceType("READING").parentId(a1.getId()).questionNumber(2)
                .questionText("Where will the party take place?")
                .optionA("In the HR office").optionB("In a restaurant").optionC("In the main office hall").optionD("Outdoors")
                .correctOption("C").correctAnswer("C").explanation("The email says the event will start 'in the main office hall'.").build());
        a1q.add(Question.builder().sourceType("READING").parentId(a1.getId()).questionNumber(3)
                .questionText("When is the deadline to confirm attendance?")
                .optionA("March 10").optionB("March 7").optionC("March 12").optionD("Friday morning")
                .correctOption("B").correctAnswer("B").explanation("The email requests: 'Please confirm your attendance by March 7'.").build());
        a1q.add(Question.builder().sourceType("READING").parentId(a1.getId()).questionNumber(4)
                .questionText("How much do employees have to pay for lunch?")
                .optionA("Half price").optionB("$10 per person").optionC("Nothing").optionD("Paid by HR department")
                .correctOption("C").correctAnswer("C").explanation("The email mentions that 'Lunch and drinks will be free of charge,' meaning employees pay nothing.").build());
        questionRepository.saveAll(a1q);

        // Article 2
        String art2Content = "Attention all department managers.\nA mandatory training session on the new database software will take place next Wednesday.\nThe training will run from 9:00 a.m. to 12:00 p.m. in Training Room B.\nMr. John Davis from IT Solutions will be the instructor.\nPlease bring your company laptops and make sure they are fully charged.\nIf you cannot attend, please inform the IT coordinator immediately.";
        String art2ViContent = "Chú ý toàn thể các trưởng bộ phận.\nMột buổi đào tạo bắt buộc về phần mềm cơ sở dữ liệu mới sẽ diễn ra vào thứ Tư tới.\nBuổi đào tạo sẽ kéo dài từ 9:00 sáng đến 12:00 trưa tại Phòng Đào tạo B.\nÔng John Davis từ IT Solutions sẽ là người hướng dẫn.\nVui lòng mang theo máy tính xách tay của công ty và đảm bảo chúng được sạc đầy.\nNếu bạn không thể tham dự, vui lòng thông báo cho điều phối viên CNTT ngay lập tức.";
        String art2Vocab = "[{\"word\":\"mandatory\",\"phonetic\":\"/ˈmændətəri/\",\"meaning\":\"bắt buộc\"},{\"word\":\"session\",\"phonetic\":\"/ˈseʃn/\",\"meaning\":\"buổi họp, phiên, buổi đào tạo\"},{\"word\":\"instructor\",\"phonetic\":\"/ɪnˈstrʌktə(r)/\",\"meaning\":\"người hướng dẫn\"},{\"word\":\"coordinator\",\"phonetic\":\"/kəʊˈɔːdɪneɪtə(r)/\",\"meaning\":\"điều phối viên\"}]";
        StudyContent a2 = StudyContent.builder()
                .title("Computer Training Session (Notice)")
                .type("READING")
                .bodyText(art2Content)
                .description(art2ViContent)
                .duration(1) // Level 1
                .questionsCount(3)
                .mediaUrl(art2Vocab)
                .orderIndex(2)
                .build();
        a2 = articleRepository.save(a2);

        List<Question> a2q = new ArrayList<>();
        a2q.add(Question.builder().sourceType("READING").parentId(a2.getId()).questionNumber(1)
                .questionText("Who is this notice addressed to?")
                .optionA("All employees").optionB("Department managers").optionC("IT support team").optionD("New hires")
                .correctOption("B").correctAnswer("B").explanation("The notice starts with: 'Attention all department managers'.").build());
        a2q.add(Question.builder().sourceType("READING").parentId(a2.getId()).questionNumber(2)
                .questionText("What are participants required to bring?")
                .optionA("Notebooks and pens").optionB("ID cards").optionC("Company laptops").optionD("Software manuals")
                .correctOption("C").correctAnswer("C").explanation("The text asks managers to 'bring your company laptops'.").build());
        a2q.add(Question.builder().sourceType("READING").parentId(a2.getId()).questionNumber(3)
                .questionText("How long will the training session last?")
                .optionA("2 hours").optionB("3 hours").optionC("All day").optionD("4 hours")
                .correctOption("B").correctAnswer("B").explanation("It runs from 9:00 a.m. to 12:00 p.m., which is exactly 3 hours.").build());
        questionRepository.saveAll(a2q);

        // Article 3
        String art3Content = "We are pleased to inform you that our main office is relocating to a larger space.\nStarting July 1, our new address will be 455 Broad Street, Suite 300.\nOur telephone numbers and email addresses will remain unchanged.\nThe relocation process will occur over the weekend of June 28-29.\nDuring this period, our servers will be temporarily offline.\nThank you for your cooperation and patience during this transition.";
        String art3ViContent = "Chúng tôi rất hân hạnh thông báo rằng văn phòng chính của chúng tôi đang chuyển đến một không gian lớn hơn.\nBắt đầu từ ngày 1 tháng 7, địa chỉ mới của chúng tôi sẽ là 455 Broad Street, Suite 300.\nSố điện thoại và địa chỉ email của chúng tôi sẽ vẫn không thay đổi.\nQuá trình di dời sẽ diễn ra vào cuối tuần ngày 28-29 tháng 6.\nTrong thời gian này, máy chủ của chúng tôi tạm thời ngoại tuyến.\nCảm ơn bạn đã hợp tác và kiên nhẫn trong quá trình chuyển đổi này.";
        String art3Vocab = "[{\"word\":\"relocate\",\"phonetic\":\"/ˌriːləʊˈkeɪt/\",\"meaning\":\"di dời, chuyển chỗ\"},{\"word\":\"remain\",\"phonetic\":\"/rɪˈmeɪn/\",\"meaning\":\"vẫn, duy trì\"},{\"word\":\"temporarily\",\"phonetic\":\"/ˈtemprərəli/\",\"meaning\":\"tạm thời\"},{\"word\":\"transition\",\"phonetic\":\"/trænˈzɪʃn/\",\"meaning\":\"quá trình chuyển đổi\"}]";
        StudyContent a3 = StudyContent.builder()
                .title("Office Relocation Notice")
                .type("READING")
                .bodyText(art3Content)
                .description(art3ViContent)
                .duration(1) // Level 1
                .questionsCount(2)
                .mediaUrl(art3Vocab)
                .orderIndex(3)
                .build();
        a3 = articleRepository.save(a3);

        List<Question> a3q = new ArrayList<>();
        a3q.add(Question.builder().sourceType("READING").parentId(a3.getId()).questionNumber(1)
                .questionText("When will the company start working at the new location?")
                .optionA("June 28").optionB("June 29").optionC("July 1").optionD("July 15")
                .correctOption("C").correctAnswer("C").explanation("The text states: 'Starting July 1, our new address will be...'").build());
        a3q.add(Question.builder().sourceType("READING").parentId(a3.getId()).questionNumber(2)
                .questionText("What information will NOT change after the move?")
                .optionA("Office address").optionB("Server configuration").optionC("Telephone numbers").optionD("Office size")
                .correctOption("C").correctAnswer("C").explanation("The notice says: 'Our telephone numbers and email addresses will remain unchanged.'").build());
        questionRepository.saveAll(a3q);

        // Article 4 (Level 2 - Staff Meeting Reminder)
        String art4Content = "This is a reminder that the monthly staff meeting has been rescheduled.\nIt will now be held on Tuesday, November 14, at 2:00 p.m. in the main conference room.\nThe main agenda is to discuss the budget cuts and department restructurings for the upcoming fiscal year.\nPlease review the attached financial report before the meeting.\nAttendance is compulsory for all team leads and managers.";
        String art4ViContent = "Đây là thông báo nhắc nhở rằng cuộc họp nhân viên hàng tháng đã được thay đổi lịch trình.\nCuộc họp sẽ được tổ chức vào thứ Ba, ngày 14 tháng 11, lúc 2:00 chiều tại phòng hội nghị chính.\nChương trình nghị sự chính là thảo luận về việc cắt giảm ngân sách và tái cơ cấu bộ phận cho năm tài chính sắp tới.\nVui lòng xem xét báo cáo tài chính đính kèm trước cuộc họp.\nSự tham dự là bắt buộc đối với tất cả các trưởng nhóm và quản lý.";
        String art4Vocab = "[{\"word\":\"reschedule\",\"phonetic\":\"/ˌriːˈʃedjuːl/\",\"meaning\":\"thay đổi lịch trình\"},{\"word\":\"agenda\",\"phonetic\":\"/əˈdʒendə/\",\"meaning\":\"chương trình nghị sự\"},{\"word\":\"restructure\",\"phonetic\":\"/ˌriːˈstrʌktʃə(r)/\",\"meaning\":\"tái cơ cấu\"},{\"word\":\"compulsory\",\"phonetic\":\"/kəmˈpʌlsəri/\",\"meaning\":\"bắt buộc\"}]";
        StudyContent a4 = StudyContent.builder()
                .title("Staff Meeting Reminder (E-mail)")
                .type("READING")
                .bodyText(art4Content)
                .description(art4ViContent)
                .duration(2) // Level 2
                .questionsCount(2)
                .mediaUrl(art4Vocab)
                .orderIndex(4)
                .build();
        a4 = articleRepository.save(a4);

        List<Question> a4q = new ArrayList<>();
        a4q.add(Question.builder().sourceType("READING").parentId(a4.getId()).questionNumber(1)
                .questionText("What is the main purpose of the rescheduled meeting?")
                .optionA("To elect a new CEO").optionB("To discuss budget cuts and restructurings").optionC("To review software updates").optionD("To plan a holiday event")
                .correctOption("B").correctAnswer("B").explanation("The email says: 'The main agenda is to discuss the budget cuts and department restructurings...'").build());
        a4q.add(Question.builder().sourceType("READING").parentId(a4.getId()).questionNumber(2)
                .questionText("Who must attend the meeting?")
                .optionA("All staff members").optionB("Only the HR staff").optionC("All team leads and managers").optionD("Budget analysts only")
                .correctOption("C").correctAnswer("C").explanation("The text mentions: 'Attendance is compulsory for all team leads and managers.'").build());
        questionRepository.saveAll(a4q);
    }
}
