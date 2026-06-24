package com.englishascension.backend.feature.community.service;

import com.englishascension.backend.feature.community.entity.ChatMessage;
import com.englishascension.backend.feature.community.repository.ChatMessageRepository;
import com.englishascension.backend.feature.user.entity.User;
import com.englishascension.backend.feature.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommunityService {

    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    public CommunityService(UserRepository userRepository, ChatMessageRepository chatMessageRepository) {
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public List<Map<String, Object>> getLeaderboard() {
        List<User> users = userRepository.findAllByOrderByExpDesc();
        List<Map<String, Object>> entries = new ArrayList<>();
        
        for (int i = 0; i < users.size(); i++) {
            User u = users.get(i);
            String name = u.getCharacterName() != null ? u.getCharacterName() : u.getEmail().split("@")[0];
            entries.add(Map.of(
                "rank", i + 1,
                "name", name,
                "level", u.getLevel(),
                "exp", u.getExp(),
                "streak", u.getStreak(),
                "email", u.getEmail()
            ));
        }
        return entries;
    }

    public List<Map<String, Object>> getChatMessages() {
        List<ChatMessage> messages = chatMessageRepository.findTop50ByOrderByCreatedAtDesc();
        List<ChatMessage> sortedMessages = new ArrayList<>(messages);
        Collections.reverse(sortedMessages);

        return sortedMessages.stream().map(m -> {
            String name = m.getUser().getCharacterName() != null ? m.getUser().getCharacterName() : m.getUser().getEmail().split("@")[0];
            return Map.<String, Object>of(
                "senderName", name,
                "senderEmail", m.getUser().getEmail(),
                "content", m.getContent(),
                "createdAt", m.getCreatedAt().toString()
            );
        }).collect(Collectors.toList());
    }

    public Map<String, Object> postChatMessage(String content, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        ChatMessage message = ChatMessage.builder()
                .user(user)
                .content(content)
                .build();

        chatMessageRepository.save(message);

        String name = user.getCharacterName() != null ? user.getCharacterName() : user.getEmail().split("@")[0];
        return Map.of(
            "senderName", name,
            "senderEmail", user.getEmail(),
            "content", message.getContent(),
            "createdAt", message.getCreatedAt().toString()
        );
    }
}
