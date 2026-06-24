package com.englishascension.backend.feature.community.repository;

import com.englishascension.backend.feature.community.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findTop50ByOrderByCreatedAtDesc();
}
