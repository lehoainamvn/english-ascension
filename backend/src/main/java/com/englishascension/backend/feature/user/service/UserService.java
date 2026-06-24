package com.englishascension.backend.feature.user.service;

import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import com.englishascension.backend.feature.user.entity.Role;
import com.englishascension.backend.shared.exception.ResourceNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Business logic for user management.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Returns the authenticated user from SecurityContext. */
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

        if (fields.containsKey("exp"))            user.setExp((Integer) fields.get("exp"));
        if (fields.containsKey("level"))          user.setLevel((Integer) fields.get("level"));
        if (fields.containsKey("coins"))          user.setCoins((Integer) fields.get("coins"));
        if (fields.containsKey("characterTitle")) user.setCharacterTitle((String) fields.get("characterTitle"));

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
