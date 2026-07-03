package com.englishascension.backend.feature.classroom.service;

import com.englishascension.backend.feature.classroom.entity.ClassRoom;
import com.englishascension.backend.feature.classroom.entity.ClassMember;
import com.englishascension.backend.feature.classroom.entity.ClassAssignment;
import com.englishascension.backend.feature.classroom.entity.ClassRole;
import com.englishascension.backend.feature.classroom.repository.ClassRoomRepository;
import com.englishascension.backend.feature.classroom.repository.ClassMemberRepository;
import com.englishascension.backend.feature.classroom.repository.ClassAssignmentRepository;

import com.englishascension.backend.feature.roadmap.entity.Lesson;
import com.englishascension.backend.feature.roadmap.entity.LessonType;
import com.englishascension.backend.feature.roadmap.repository.LessonRepository;
import com.englishascension.backend.feature.study.entity.Question;
import com.englishascension.backend.feature.study.entity.QuestionOption;
import com.englishascension.backend.feature.study.repository.QuestionRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserGameStats;
import com.englishascension.backend.feature.user.entity.UserLessonState;
import com.englishascension.backend.feature.user.repository.UserLessonStateRepository;
import com.englishascension.backend.feature.user.repository.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ClassRoomService {

    private static final Logger log = LoggerFactory.getLogger(ClassRoomService.class);

    private final ClassRoomRepository classRoomRepository;
    private final ClassMemberRepository classMemberRepository;
    private final ClassAssignmentRepository classAssignmentRepository;
    private final LessonRepository lessonRepository;
    private final QuestionRepository questionRepository;
    private final UserLessonStateRepository userLessonStateRepository;
    private final UserRepository userRepository;

    public ClassRoomService(
            ClassRoomRepository classRoomRepository,
            ClassMemberRepository classMemberRepository,
            ClassAssignmentRepository classAssignmentRepository,
            LessonRepository lessonRepository,
            QuestionRepository questionRepository,
            UserLessonStateRepository userLessonStateRepository,
            UserRepository userRepository) {
        this.classRoomRepository = classRoomRepository;
        this.classMemberRepository = classMemberRepository;
        this.classAssignmentRepository = classAssignmentRepository;
        this.lessonRepository = lessonRepository;
        this.questionRepository = questionRepository;
        this.userLessonStateRepository = userLessonStateRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> createClassRoom(String name, String description, User creator) {
        String code = generateUniqueCode();
        ClassRoom classRoom = ClassRoom.builder()
                .name(name)
                .description(description)
                .inviteCode(code)
                .createdBy(creator)
                .build();
        classRoom = classRoomRepository.save(classRoom);

        ClassMember ownerMember = ClassMember.builder()
                .classRoom(classRoom)
                .user(creator)
                .role(ClassRole.OWNER)
                .build();
        classMemberRepository.save(ownerMember);

        return buildClassRoomDto(classRoom, creator);
    }

    public List<Map<String, Object>> getMyClasses(User user) {
        List<ClassRoom> rooms = classRoomRepository.findAllByUserInvolved(user);
        return rooms.stream().map(r -> buildClassRoomDto(r, user)).collect(Collectors.toList());
    }

    public Map<String, Object> getClassRoomDetails(Long classRoomId, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertMember(classRoom, user);
        return buildClassRoomDetailsDto(classRoom, user);
    }

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

    public void deleteClassRoom(Long classRoomId, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, user);
        classRoomRepository.delete(classRoom);
    }

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

    public Map<String, Object> createQuiz(Long classRoomId, String title, String description,
                                           List<Map<String, Object>> questions, User owner) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, owner);

        // A Quiz is represented as a Lesson of type 'CLASS_QUIZ'
        String slug = "class-quiz-" + UUID.randomUUID();
        Lesson lesson = Lesson.builder()
                .type(LessonType.CLASS_QUIZ)
                .title(title)
                .slug(slug)
                .orderIndex(1)
                .difficultyScore(1.0)
                .topic(title)
                .build();
        lesson = lessonRepository.save(lesson);

        // Save questions
        saveQuestions(lesson, questions);

        // Create assignment for class
        ClassAssignment assignment = ClassAssignment.builder()
                .classRoom(classRoom)
                .title(title)
                .description(description)
                .lesson(lesson)
                .createdBy(owner)
                .active(true)
                .build();
        assignment = classAssignmentRepository.save(assignment);

        return buildAssignmentDto(assignment, owner);
    }

    public Map<String, Object> updateQuiz(Long classRoomId, Long quizId, String title, String description,
                                           List<Map<String, Object>> questions, User owner) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, owner);
        ClassAssignment assignment = classAssignmentRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        Lesson lesson = assignment.getLesson();
        if (lesson != null) {
            lesson.setTitle(title);
            lessonRepository.save(lesson);

            // Replace questions
            List<Question> oldQuestions = questionRepository.findByLessonId(lesson.getId());
            questionRepository.deleteAll(oldQuestions);
            saveQuestions(lesson, questions);
        }

        assignment.setTitle(title);
        assignment.setDescription(description);
        classAssignmentRepository.save(assignment);

        return buildAssignmentDto(assignment, owner);
    }

    public void deleteQuiz(Long classRoomId, Long quizId, User owner) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertOwner(classRoom, owner);
        ClassAssignment assignment = classAssignmentRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        Lesson lesson = assignment.getLesson();
        classAssignmentRepository.delete(assignment);
        if (lesson != null) {
            lessonRepository.delete(lesson);
        }
    }

    public Map<String, Object> submitQuiz(Long classRoomId, Long quizId,
                                           Map<Long, String> answers, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertMember(classRoom, user);
        ClassAssignment assignment = classAssignmentRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        Lesson lesson = assignment.getLesson();
        if (lesson == null) {
            throw new RuntimeException("Lesson not found for this assignment.");
        }
        List<Question> questions = questionRepository.findByLessonId(lesson.getId());

        int correct = 0;
        for (Question q : questions) {
            String userAnswer = answers.get(q.getId());
            if (userAnswer != null) {
                boolean isCorrect = q.getOptions().stream()
                        .anyMatch(opt -> opt.getOptionKey().equalsIgnoreCase(userAnswer.trim()) && opt.isCorrect());
                if (isCorrect) {
                    correct++;
                }
            }
        }

        // Save progress using UserLessonState
        UserLessonState state = userLessonStateRepository
                .findByUserIdAndLessonId(user.getId(), lesson.getId())
                .orElseGet(() -> UserLessonState.builder()
                        .user(user)
                        .lesson(lesson)
                        .status("UNLOCKED")
                        .build());

        if (state.getScore() == null || correct >= state.getScore()) {
            state.setStatus("COMPLETED");
            state.setScore(correct);
            state.setCompletedAt(LocalDateTime.now());
            userLessonStateRepository.save(state);
        }

        int xpGained = correct * 20;

        UserGameStats stats = user.getUserGameStats();
        if (stats == null) {
            stats = UserGameStats.builder().user(user).streak(0).exp(0).level(1).build();
            user.setUserGameStats(stats);
        }

        int currentExp = stats.getExp() + xpGained;
        int currentLevel = stats.getLevel();
        boolean leveledUp = false;
        int previousLevel = stats.getLevel();

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

        stats.setExp(currentExp);
        stats.setLevel(currentLevel);
        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("score", correct);
        result.put("totalQuestions", questions.size());
        result.put("percentage", questions.isEmpty() ? 0 : Math.round((correct * 100.0) / questions.size()));
        
        result.put("xpGained", xpGained);
        result.put("coinsGained", 0);
        result.put("newXp", currentExp);
        result.put("newLevel", currentLevel);
        result.put("newCoins", 0);
        result.put("leveledUp", leveledUp);
        result.put("previousLevel", previousLevel);
        result.put("newTitle", null);

        return result;
    }

    public List<Map<String, Object>> getLeaderboard(Long classRoomId, Long quizId, User user) {
        ClassRoom classRoom = findClassRoomOrThrow(classRoomId);
        assertMember(classRoom, user);
        ClassAssignment assignment = classAssignmentRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        Lesson lesson = assignment.getLesson();
        if (lesson == null) {
            return Collections.emptyList();
        }

        // For classroom leaderboard, query states of all users in classroom
        List<ClassMember> members = classMemberRepository.findByClassRoomOrderByJoinedAtAsc(classRoom);
        List<Map<String, Object>> leaderboard = new ArrayList<>();
        int rank = 1;

        List<UserLessonState> allStates = new ArrayList<>();
        for (ClassMember member : members) {
            userLessonStateRepository.findByUserIdAndLessonId(member.getUser().getId(), lesson.getId())
                    .ifPresent(allStates::add);
        }

        allStates.sort((a, b) -> Integer.compare(b.getScore() != null ? b.getScore() : 0, a.getScore() != null ? a.getScore() : 0));

        for (UserLessonState a : allStates) {
            List<Question> questions = questionRepository.findByLessonId(lesson.getId());
            Map<String, Object> entry = new HashMap<>();
            entry.put("rank", rank++);
            entry.put("userId", a.getUser().getId());
            entry.put("email", a.getUser().getEmail());
            entry.put("score", a.getScore());
            entry.put("totalQuestions", questions.size());
            entry.put("percentage", questions.isEmpty() ? 0 : Math.round((a.getScore() * 100.0) / questions.size()));
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

    private void saveQuestions(Lesson lesson, List<Map<String, Object>> questionDtos) {
        if (questionDtos == null) return;
        for (Map<String, Object> dto : questionDtos) {
            Question q = Question.builder()
                    .lesson(lesson)
                    .sourceType("CLASS_QUIZ")
                    .questionText(String.valueOf(dto.get("questionText")))
                    .explanation(dto.containsKey("explanation") ? String.valueOf(dto.get("explanation")) : null)
                    .build();

            List<QuestionOption> options = new ArrayList<>();
            String correct = dto.containsKey("correctAnswer") ? String.valueOf(dto.get("correctAnswer")) : "A";

            if (dto.containsKey("optionA")) {
                options.add(QuestionOption.builder().question(q).optionKey("A").optionValue(String.valueOf(dto.get("optionA"))).correct("A".equalsIgnoreCase(correct)).build());
            }
            if (dto.containsKey("optionB")) {
                options.add(QuestionOption.builder().question(q).optionKey("B").optionValue(String.valueOf(dto.get("optionB"))).correct("B".equalsIgnoreCase(correct)).build());
            }
            if (dto.containsKey("optionC")) {
                options.add(QuestionOption.builder().question(q).optionKey("C").optionValue(String.valueOf(dto.get("optionC"))).correct("C".equalsIgnoreCase(correct)).build());
            }
            if (dto.containsKey("optionD")) {
                options.add(QuestionOption.builder().question(q).optionKey("D").optionValue(String.valueOf(dto.get("optionD"))).correct("D".equalsIgnoreCase(correct)).build());
            }
            q.setOptions(options);
            questionRepository.save(q);
        }
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

    private Map<String, Object> buildClassRoomDto(ClassRoom cr, User currentUser) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", cr.getId());
        dto.put("name", cr.getName());
        dto.put("description", cr.getDescription());
        dto.put("inviteCode", cr.getInviteCode());
        dto.put("createdByEmail", cr.getCreatedBy().getEmail());
        dto.put("createdAt", cr.getCreatedAt());
        dto.put("memberCount", cr.getMembers().size());
        dto.put("quizCount", classAssignmentRepository.findByClassRoomId(cr.getId()).size());
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

        // Quizzes (Class Assignments)
        List<ClassAssignment> assignments = classAssignmentRepository.findByClassRoomId(cr.getId());
        List<Map<String, Object>> quizDtos = assignments.stream()
                .map(q -> buildAssignmentDto(q, currentUser))
                .collect(Collectors.toList());
        dto.put("quizzes", quizDtos);

        return dto;
    }

    private Map<String, Object> buildAssignmentDto(ClassAssignment assignment, User currentUser) {
        Lesson lesson = assignment.getLesson();
        List<Question> questions = lesson != null ? questionRepository.findByLessonId(lesson.getId()) : Collections.emptyList();
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", assignment.getId());
        dto.put("title", assignment.getTitle());
        dto.put("description", assignment.getDescription());
        dto.put("createdByEmail", assignment.getCreatedBy().getEmail());
        dto.put("isActive", assignment.isActive());
        dto.put("createdAt", assignment.getCreatedAt());
        dto.put("questionCount", questions.size());

        List<Map<String, Object>> qDtos = questions.stream().map(q -> {
            Map<String, Object> qDto = new LinkedHashMap<>();
            qDto.put("id", q.getId());
            qDto.put("questionNumber", 1); // Virtual order index
            qDto.put("type", "MULTIPLE_CHOICE");
            qDto.put("questionText", q.getQuestionText());

            qDto.put("optionA", "");
            qDto.put("optionB", "");
            qDto.put("optionC", "");
            qDto.put("optionD", "");
            String correct = "A";

            for (QuestionOption opt : q.getOptions()) {
                if ("A".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionA", opt.getOptionValue());
                if ("B".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionB", opt.getOptionValue());
                if ("C".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionC", opt.getOptionValue());
                if ("D".equalsIgnoreCase(opt.getOptionKey())) qDto.put("optionD", opt.getOptionValue());
                if (opt.isCorrect()) {
                    correct = opt.getOptionKey();
                }
            }

            qDto.put("correctAnswer", correct);
            qDto.put("explanation", q.getExplanation());
            return qDto;
        }).collect(Collectors.toList());
        dto.put("questions", qDtos);
        return dto;
    }
}
