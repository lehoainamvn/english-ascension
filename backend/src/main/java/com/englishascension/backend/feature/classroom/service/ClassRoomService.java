package com.englishascension.backend.feature.classroom.service;

import com.englishascension.backend.feature.classroom.entity.ClassRoom;
import com.englishascension.backend.feature.classroom.entity.ClassMember;
import com.englishascension.backend.feature.classroom.entity.ClassQuiz;
import com.englishascension.backend.feature.classroom.entity.ClassRole;
import com.englishascension.backend.feature.classroom.repository.ClassRoomRepository;
import com.englishascension.backend.feature.classroom.repository.ClassMemberRepository;
import com.englishascension.backend.feature.classroom.repository.ClassQuizRepository;

import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserProgress;
import com.englishascension.backend.feature.user.repository.UserProgressRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClassRoomService {

    private static final Logger log = LoggerFactory.getLogger(ClassRoomService.class);

    private final ClassRoomRepository classRoomRepository;
    private final ClassMemberRepository classMemberRepository;
    private final ClassQuizRepository classQuizRepository;
    private final QuestionRepository questionRepository;
    private final UserProgressRepository userProgressRepository;
    private final UserRepository userRepository;

    public ClassRoomService(
            ClassRoomRepository classRoomRepository,
            ClassMemberRepository classMemberRepository,
            ClassQuizRepository classQuizRepository,
            QuestionRepository questionRepository,
            UserProgressRepository userProgressRepository,
            UserRepository userRepository) {
        this.classRoomRepository = classRoomRepository;
        this.classMemberRepository = classMemberRepository;
        this.classQuizRepository = classQuizRepository;
        this.questionRepository = questionRepository;
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
    }

    /** Tạo class mới, người tạo tự động là OWNER */
    public Map<String, Object> createClassRoom(String name, String description, User creator) {
        String code = generateUniqueCode();
        ClassRoom classRoom = ClassRoom.builder()
                .name(name)
                .description(description)
                .inviteCode(code)
                .createdBy(creator)
                .build();
        classRoom = classRoomRepository.save(classRoom);

        // Tự động thêm người tạo là OWNER
        ClassMember ownerMember = ClassMember.builder()
                .classRoom(classRoom)
                .user(creator)
                .role(ClassRole.OWNER)
                .build();
        classMemberRepository.save(ownerMember);

        return buildClassRoomDto(classRoom, creator);
    }

    /** Lấy danh sách class của user (tạo hoặc tham gia) */
    public List<Map<String, Object>> getMyClasses(User user) {
        List<ClassRoom> rooms = classRoomRepository.findAllByUserInvolved(user);
        return rooms.stream().map(r -> buildClassRoomDto(r, user)).collect(Collectors.toList());
    }

    /** Lấy chi tiết class với members và quizzes */
    public Map<String, Object> getClassRoomDetails(Long classRoomId, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertMember(classRoom, user);
        return buildClassRoomDetailsDto(classRoom, user);
    }

    /** Tham gia class bằng invite code */
    public Map<String, Object> joinClass(String inviteCode, User user) {
        ClassRoom classRoom = classRoomRepository.findByInviteCode(inviteCode.trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Mã mời không hợp lệ hoặc class không tồn tại."));

        if (classMemberRepository.existsByClassRoomAndUser(classRoom, user)) {
            throw new RuntimeException("Bạn đã là thành viên của lớp học này rồi.");
        }

        ClassMember member = ClassMember.builder()
                .classRoom(classRoom)
                .user(user)
                .role(ClassRole.MEMBER)
                .build();
        classMemberRepository.save(member);

        return buildClassRoomDto(classRoom, user);
    }

    /** Xóa class (chỉ owner) */
    public void deleteClassRoom(Long classRoomId, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, user);
        classRoomRepository.delete(classRoom);
    }

    /** Xóa thành viên (chỉ owner, không thể xóa chính mình) */
    public void removeMember(Long classRoomId, Long memberUserId, User owner) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, owner);
        if (owner.getId().equals(memberUserId)) {
            throw new RuntimeException("Owner không thể tự xóa bản thân.");
        }
        ClassMember member = classMemberRepository.findByClassRoomAndUser(classRoom,
                new User() {{ setId(memberUserId); }})
                .orElseThrow(() -> new RuntimeException("Thành viên không tồn tại trong lớp."));
        classMemberRepository.delete(member);
    }

    /** Tạo quiz cho class (chỉ owner) */
    public Map<String, Object> createQuiz(Long classRoomId, String title, String description,
                                           List<Map<String, Object>> questions, User owner) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, owner);

        ClassQuiz quiz = ClassQuiz.builder()
                .classRoom(classRoom)
                .title(title)
                .description(description)
                .createdBy(owner)
                .isActive(true)
                .build();
        quiz = classQuizRepository.save(quiz);

        saveQuestions(quiz, questions);
        return buildQuizDto(quiz, owner);
    }

    /** Sửa quiz (chỉ owner) - cập nhật title, description và thay toàn bộ câu hỏi */
    public Map<String, Object> updateQuiz(Long classRoomId, Long quizId, String title, String description,
                                           List<Map<String, Object>> questions, User owner) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, owner);
        ClassQuiz quiz = findQuizOrThrow(quizId, classRoom);

        quiz.setTitle(title);
        if (description != null) quiz.setDescription(description);
        quiz = classQuizRepository.save(quiz);

        // Replace all questions
        List<Question> oldQuestions = questionRepository.findBySourceTypeAndParentId("CLASS_QUIZ", quiz.getId());
        questionRepository.deleteAll(oldQuestions);
        saveQuestions(quiz, questions);
        return buildQuizDto(quiz, owner);
    }

    /** Xóa quiz (chỉ owner) */
    public void deleteQuiz(Long classRoomId, Long quizId, User owner) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, owner);
        ClassQuiz quiz = findQuizOrThrow(quizId, classRoom);
        
        // Delete related questions first
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("CLASS_QUIZ", quizId);
        questionRepository.deleteAll(questions);
        
        classQuizRepository.delete(quiz);
    }

    /** Nộp bài thi */
    public Map<String, Object> submitQuiz(Long classRoomId, Long quizId,
                                           Map<Long, String> answers, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertMember(classRoom, user);
        ClassQuiz quiz = findQuizOrThrow(quizId, classRoom);

        List<Question> questions = questionRepository.findBySourceTypeAndParentIdOrderByQuestionNumberAsc("CLASS_QUIZ", quiz.getId());
        int correct = 0;
        for (Question q : questions) {
            String userAnswer = answers.get(q.getId());
            if (userAnswer != null) {
                if ("MULTIPLE_CHOICE".equals(q.getType())) {
                    // For MC, correct answer is "A"/"B"/"C"/"D" - compare with the option text
                    String correctOptionText = getOptionText(q, q.getCorrectAnswer());
                    if (userAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer().trim()) ||
                        userAnswer.trim().equalsIgnoreCase(correctOptionText.trim())) {
                        correct++;
                    }
                } else {
                    // FILL_IN_BLANK
                    if (userAnswer.trim().equalsIgnoreCase(q.getCorrectAnswer().trim())) {
                        correct++;
                    }
                }
            }
        }

        // Save or update attempt (allow re-attempt, keep best score)
        Optional<UserProgress> existingAttempt = userProgressRepository.findByResourceTypeAndResourceIdAndUser("CLASS_QUIZ", quiz.getId(), user);
        UserProgress attempt;
        if (existingAttempt.isPresent()) {
            attempt = existingAttempt.get();
            // Update if new score is higher
            if (correct >= attempt.getScore()) {
                attempt.setScore(correct);
                attempt.setTotalQuestions(questions.size());
                attempt.setCompletedAt(java.time.LocalDateTime.now());
            }
        } else {
            attempt = UserProgress.builder()
                    .resourceType("CLASS_QUIZ")
                    .resourceId(quiz.getId())
                    .user(user)
                    .completed(true)
                    .completedAt(java.time.LocalDateTime.now())
                    .score(correct)
                    .totalQuestions(questions.size())
                    .build();
        }
        userProgressRepository.save(attempt);

        // Thưởng điểm EXP và Xu cho Quiz lớp học: 20 EXP và 5 Xu cho mỗi câu trả lời đúng
        int xpGained = correct * 20;
        int coinsGained = correct * 5;

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
        result.put("score", correct);
        result.put("totalQuestions", questions.size());
        result.put("percentage", questions.isEmpty() ? 0 : Math.round((correct * 100.0) / questions.size()));
        
        result.put("xpGained", xpGained);
        result.put("coinsGained", coinsGained);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", currentCoins);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", newTitle);

        return result;
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

    /** Bảng xếp hạng quiz */
    public List<Map<String, Object>> getLeaderboard(Long classRoomId, Long quizId, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertMember(classRoom, user);
        ClassQuiz quiz = findQuizOrThrow(quizId, classRoom);

        List<UserProgress> attempts = userProgressRepository.findByResourceTypeAndResourceIdOrderByScoreDescCompletedAtAsc("CLASS_QUIZ", quiz.getId());
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        int rank = 1;
        for (UserProgress a : attempts) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", rank++);
            entry.put("userId", a.getUser().getId());
            entry.put("email", a.getUser().getEmail());
            entry.put("score", a.getScore());
            entry.put("totalQuestions", a.getTotalQuestions());
            entry.put("percentage", a.getTotalQuestions() == null || a.getTotalQuestions() == 0 ? 0 : Math.round((a.getScore() * 100.0) / a.getTotalQuestions()));
            entry.put("completedAt", a.getCompletedAt());
            leaderboard.add(entry);
        }
        return leaderboard;
    }

    // ========================= Private Helpers =========================

    private ClassRoom findClassRoomOrThrow(Long id) {
        return classRoomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại."));
    }

    private ClassQuiz findQuizOrThrow(Long quizId, ClassRoom classRoom) {
        ClassQuiz quiz = classQuizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz không tồn tại."));
        if (!quiz.getClassRoom().getId().equals(classRoom.getId())) {
            throw new RuntimeException("Quiz không thuộc lớp học này.");
        }
        return quiz;
    }

    private void assertMember(ClassRoom classRoom, User user) {
        if (!classMemberRepository.existsByClassRoomAndUser(classRoom, user)) {
            throw new RuntimeException("Bạn không phải thành viên của lớp học này.");
        }
    }

    private void assertOwner(ClassRoom classRoom, User user) {
        ClassMember member = classMemberRepository.findByClassRoomAndUser(classRoom, user)
                .orElseThrow(() -> new RuntimeException("Bạn không phải thành viên của lớp học này."));
        if (member.getRole() != ClassRole.OWNER) {
            throw new RuntimeException("Chỉ chủ lớp mới có quyền thực hiện thao tác này.");
        }
    }

    @SuppressWarnings("unchecked")
    private void saveQuestions(ClassQuiz quiz, List<Map<String, Object>> questionDtos) {
        if (questionDtos == null) return;
        List<Question> questions = new ArrayList<>();
        int num = 1;
        for (Map<String, Object> dto : questionDtos) {
            Question q = Question.builder()
                    .sourceType("CLASS_QUIZ")
                    .parentId(quiz.getId())
                    .questionNumber(num++)
                    .type(String.valueOf(dto.getOrDefault("type", "MULTIPLE_CHOICE")))
                    .questionText(String.valueOf(dto.get("questionText")))
                    .optionA(dto.containsKey("optionA") ? String.valueOf(dto.get("optionA")) : null)
                    .optionB(dto.containsKey("optionB") ? String.valueOf(dto.get("optionB")) : null)
                    .optionC(dto.containsKey("optionC") ? String.valueOf(dto.get("optionC")) : null)
                    .optionD(dto.containsKey("optionD") ? String.valueOf(dto.get("optionD")) : null)
                    .correctAnswer(dto.containsKey("correctAnswer") ? String.valueOf(dto.get("correctAnswer")) : null)
                    .correctOption(dto.containsKey("correctAnswer") ? String.valueOf(dto.get("correctAnswer")) : null) // Set both for compatibility
                    .explanation(dto.containsKey("explanation") ? String.valueOf(dto.get("explanation")) : null)
                    .build();
            questions.add(q);
        }
        questionRepository.saveAll(questions);
    }

    private String generateUniqueCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random rand = new Random();
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(rand.nextInt(chars.length())));
            }
            code = sb.toString();
        } while (classRoomRepository.findByInviteCode(code).isPresent());
        return code;
    }

    private String getOptionText(Question q, String option) {
        if (option == null) return "";
        return switch (option.toUpperCase()) {
            case "A" -> q.getOptionA() != null ? q.getOptionA() : "";
            case "B" -> q.getOptionB() != null ? q.getOptionB() : "";
            case "C" -> q.getOptionC() != null ? q.getOptionC() : "";
            case "D" -> q.getOptionD() != null ? q.getOptionD() : "";
            default -> "";
        };
    }

    private Map<String, Object> buildClassRoomDto(ClassRoom cr, User currentUser) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", cr.getId());
        dto.put("name", cr.getName());
        dto.put("description", cr.getDescription());
        dto.put("inviteCode", cr.getInviteCode());
        dto.put("createdByEmail", cr.getCreatedBy().getEmail());
        dto.put("createdAt", cr.getCreatedAt());
        dto.put("memberCount", cr.getMembers().size());
        dto.put("quizCount", cr.getQuizzes().size());
        dto.put("isOwner", cr.getCreatedBy().getId().equals(currentUser.getId()));
        return dto;
    }

    private Map<String, Object> buildClassRoomDetailsDto(ClassRoom cr, User currentUser) {
        Map<String, Object> dto = buildClassRoomDto(cr, currentUser);

        // Members
        List<ClassMember> members = classMemberRepository.findByClassRoomOrderByJoinedAtAsc(cr);
        List<Map<String, Object>> memberDtos = members.stream().map(m -> {
            Map<String, Object> mDto = new HashMap<>();
            mDto.put("userId", m.getUser().getId());
            mDto.put("email", m.getUser().getEmail());
            mDto.put("role", m.getRole().name());
            mDto.put("joinedAt", m.getJoinedAt());
            return mDto;
        }).collect(Collectors.toList());
        dto.put("members", memberDtos);

        // Quizzes
        List<ClassQuiz> quizzes = classQuizRepository.findByClassRoomOrderByCreatedAtDesc(cr);
        List<Map<String, Object>> quizDtos = quizzes.stream()
                .map(q -> buildQuizDto(q, currentUser))
                .collect(Collectors.toList());
        dto.put("quizzes", quizDtos);

        return dto;
    }

    private Map<String, Object> buildQuizDto(ClassQuiz quiz, User currentUser) {
        List<Question> questions = questionRepository.findBySourceTypeAndParentIdOrderByQuestionNumberAsc("CLASS_QUIZ", quiz.getId());
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", quiz.getId());
        dto.put("title", quiz.getTitle());
        dto.put("description", quiz.getDescription());
        dto.put("createdByEmail", quiz.getCreatedBy().getEmail());
        dto.put("isActive", quiz.isActive());
        dto.put("createdAt", quiz.getCreatedAt());
        dto.put("questionCount", questions.size());

        List<Map<String, Object>> qDtos = questions.stream().map(q -> {
            Map<String, Object> qDto = new LinkedHashMap<>();
            qDto.put("id", q.getId());
            qDto.put("questionNumber", q.getQuestionNumber());
            qDto.put("type", q.getType());
            qDto.put("questionText", q.getQuestionText());
            qDto.put("optionA", q.getOptionA());
            qDto.put("optionB", q.getOptionB());
            qDto.put("optionC", q.getOptionC());
            qDto.put("optionD", q.getOptionD());
            qDto.put("correctAnswer", q.getCorrectAnswer());
            qDto.put("explanation", q.getExplanation());
            return qDto;
        }).collect(Collectors.toList());
        dto.put("questions", qDtos);
        return dto;
    }
}
