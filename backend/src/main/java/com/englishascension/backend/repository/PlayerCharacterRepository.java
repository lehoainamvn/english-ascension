package com.englishascension.backend.repository;

import com.englishascension.backend.model.PlayerCharacter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlayerCharacterRepository extends JpaRepository<PlayerCharacter, Long> {
    Optional<PlayerCharacter> findByUserId(Long userId);
}
