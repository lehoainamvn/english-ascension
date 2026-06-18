package com.englishascension.backend.feature.vocabulary;

import com.englishascension.backend.feature.vocabulary.VocabularyWord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VocabularyWordRepository extends JpaRepository<VocabularyWord, Long> {
    List<VocabularyWord> findByCefrLevelIgnoreCaseAndModuleIndex(String cefrLevel, Integer moduleIndex);
}
