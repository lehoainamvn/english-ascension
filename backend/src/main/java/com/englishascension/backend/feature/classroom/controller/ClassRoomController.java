package com.englishascension.backend.feature.classroom.controller;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.classroom.service.ClassRoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/classes")
public class ClassRoomController {

    private static final Logger log = LoggerFactory.getLogger(ClassRoomController.class);

    private final UserRepository userRepository;
    private final ClassRoomService classRoomService;

    public ClassRoomController(UserRepository userRepository, ClassRoomService classRoomService) {
        this.userRepository = userRepository;
        this.classRoomService = classRoomService;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
    }

    /** Tạo class mới */
    @PostMapping
    public ResponseEntity<?> createClass(@RequestBody Map<String, String> body) {
        try {
            User user = getCurrentUser();
            String name = body.get("name");
            String description = body.getOrDefault("description", "");
            if (name == null || name.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tên lớp không được để trống."));
            }
            Map<String, Object> result = classRoomService.createClassRoom(name, description, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error creating class", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Danh sách class của tôi */
    @GetMapping
    public ResponseEntity<?> getMyClasses() {
        try {
            User user = getCurrentUser();
            List<Map<String, Object>> result = classRoomService.getMyClasses(user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching classes", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    /** Chi tiết class */
    @GetMapping("/{id}")
    public ResponseEntity<?> getClassDetails(@PathVariable Long id) {
        try {
            User user = getCurrentUser();
            Map<String, Object> result = classRoomService.getClassRoomDetails(id, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching class details", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Tham gia class bằng code */
    @PostMapping("/join")
    public ResponseEntity<?> joinClass(@RequestBody Map<String, String> body) {
        try {
            User user = getCurrentUser();
            String code = body.get("inviteCode");
            if (code == null || code.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mã mời không hợp lệ."));
            }
            Map<String, Object> result = classRoomService.joinClass(code, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error joining class", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Xóa class */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        try {
            User user = getCurrentUser();
            classRoomService.deleteClassRoom(id, user);
            return ResponseEntity.ok(Map.of("message", "Xóa lớp học thành công!"));
        } catch (Exception e) {
            log.error("Error deleting class", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Xóa thành viên */
    @DeleteMapping("/{classId}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable Long classId, @PathVariable Long userId) {
        try {
            User owner = getCurrentUser();
            classRoomService.removeMember(classId, userId, owner);
            return ResponseEntity.ok(Map.of("message", "Đã xóa thành viên khỏi lớp học."));
        } catch (Exception e) {
            log.error("Error removing member", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Tạo quiz cho class */
    @PostMapping("/{classId}/quizzes")
    public ResponseEntity<?> createQuiz(@PathVariable Long classId, @RequestBody Map<String, Object> body) {
        try {
            User user = getCurrentUser();
            String title = (String) body.get("title");
            String description = (String) body.getOrDefault("description", "");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> questions = (List<Map<String, Object>>) body.get("questions");
            if (title == null || title.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Tiêu đề quiz không được để trống."));
            }
            Map<String, Object> result = classRoomService.createQuiz(classId, title, description, questions, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error creating quiz", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Sửa quiz */
    @PutMapping("/{classId}/quizzes/{quizId}")
    public ResponseEntity<?> updateQuiz(@PathVariable Long classId, @PathVariable Long quizId,
                                         @RequestBody Map<String, Object> body) {
        try {
            User user = getCurrentUser();
            String title = (String) body.get("title");
            String description = (String) body.getOrDefault("description", "");
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> questions = (List<Map<String, Object>>) body.get("questions");
            Map<String, Object> result = classRoomService.updateQuiz(classId, quizId, title, description, questions, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error updating quiz", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Xóa quiz */
    @DeleteMapping("/{classId}/quizzes/{quizId}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long classId, @PathVariable Long quizId) {
        try {
            User user = getCurrentUser();
            classRoomService.deleteQuiz(classId, quizId, user);
            return ResponseEntity.ok(Map.of("message", "Xóa quiz thành công!"));
        } catch (Exception e) {
            log.error("Error deleting quiz", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Nộp bài thi */
    @PostMapping("/{classId}/quizzes/{quizId}/submit")
    public ResponseEntity<?> submitQuiz(@PathVariable Long classId, @PathVariable Long quizId,
                                         @RequestBody Map<String, Object> body) {
        try {
            User user = getCurrentUser();
            @SuppressWarnings("unchecked")
            Map<String, String> rawAnswers = (Map<String, String>) body.get("answers");
            Map<Long, String> answers = new HashMap<>();
            if (rawAnswers != null) {
                rawAnswers.forEach((k, v) -> answers.put(Long.parseLong(k), v));
            }
            Map<String, Object> result = classRoomService.submitQuiz(classId, quizId, answers, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error submitting quiz", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    /** Bảng xếp hạng */
    @GetMapping("/{classId}/quizzes/{quizId}/leaderboard")
    public ResponseEntity<?> getLeaderboard(@PathVariable Long classId, @PathVariable Long quizId) {
        try {
            User user = getCurrentUser();
            List<Map<String, Object>> result = classRoomService.getLeaderboard(classId, quizId, user);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching leaderboard", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
