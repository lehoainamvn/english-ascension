package com.englishascension.backend.feature.user.service;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.entity.UserGameStats;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.user.entity.Role;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    public User updateUser(Long id, Map<String, Object> fields) {
        User user = getUserById(id);

        if (fields.containsKey("avatar")) {
            user.setAvatar((String) fields.get("avatar"));
        }

        // Cập nhật stats
        if (fields.containsKey("exp") || fields.containsKey("level") || fields.containsKey("streak")) {
            UserGameStats stats = user.getUserGameStats();
            if (stats == null) {
                stats = UserGameStats.builder().user(user).build();
                user.setUserGameStats(stats);
            }
            if (fields.containsKey("exp"))    stats.setExp((Integer) fields.get("exp"));
            if (fields.containsKey("level"))  stats.setLevel((Integer) fields.get("level"));
            if (fields.containsKey("streak")) stats.setStreak((Integer) fields.get("streak"));
        }

        if (fields.containsKey("role")) {
            String roleStr = (String) fields.get("role");
            try {
                user.setRole(Role.valueOf(roleStr));
            } catch (IllegalArgumentException ignored) {}
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }
}
