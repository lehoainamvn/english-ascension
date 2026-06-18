package com.englishascension.backend.feature.document;

import com.englishascension.backend.feature.ai.GroqService;


import com.englishascension.backend.feature.study.Flashcard;
import com.englishascension.backend.feature.study.Question;
import com.englishascension.backend.feature.user.User;
import com.englishascension.backend.feature.study.StudyContent;
import com.englishascension.backend.feature.study.FlashcardRepository;
import com.englishascension.backend.feature.study.QuestionRepository;
import com.englishascension.backend.feature.study.StudyContentRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class UserDocumentService {

    private static final Logger log = LoggerFactory.getLogger(UserDocumentService.class);

    private final StudyContentRepository studyContentRepository;
    private final FlashcardRepository flashcardRepository;
    private final QuestionRepository questionRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public UserDocumentService(
            StudyContentRepository studyContentRepository,
            FlashcardRepository flashcardRepository,
            QuestionRepository questionRepository,
            GroqService groqService) {
        this.studyContentRepository = studyContentRepository;
        this.flashcardRepository = flashcardRepository;
        this.questionRepository = questionRepository;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    public List<StudyContent> getMyDocuments(User user) {
        List<StudyContent> docs = studyContentRepository.findByUserOrderByCreatedAtDesc(user);
        for (StudyContent doc : docs) {
            doc.setQuizQuestions(questionRepository.findBySourceTypeAndParentId("DOCUMENT_QUIZ", doc.getId()));
        }
        return docs;
    }

    public StudyContent getDocumentById(Long id, User user) {
        StudyContent doc = studyContentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tài liệu không tồn tại."));
        if (doc.getUser() == null || !doc.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền truy cập tài liệu này.");
        }
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("DOCUMENT_QUIZ", doc.getId());
        for (Question q : questions) {
            if (q.getType() == null) {
                if (q.getOptionA() != null) {
                    q.setType("MULTIPLE_CHOICE");
                } else {
                    q.setType("FILL_IN_BLANK");
                }
            }
        }
        doc.setQuizQuestions(questions);
        return doc;
    }

    public void deleteDocument(Long id, User user) {
        StudyContent doc = getDocumentById(id, user);
        List<Question> questions = questionRepository.findBySourceTypeAndParentId("DOCUMENT_QUIZ", id);
        questionRepository.deleteAll(questions);
        studyContentRepository.delete(doc);
    }

    public StudyContent uploadAndProcess(MultipartFile file, User user, int flashcardCount) {
        String fileName = file.getOriginalFilename();
        if (fileName == null) {
            fileName = "untitled_document.txt";
        }

        String extractedText = "";
        try {
            if (fileName.toLowerCase().endsWith(".pdf")) {
                extractedText = extractTextFromPdf(file);
            } else if (fileName.toLowerCase().endsWith(".docx")) {
                extractedText = extractTextFromDocx(file);
            } else {
                extractedText = extractTextFromTxt(file);
            }
        } catch (Exception e) {
            log.error("Lỗi khi trích xuất văn bản từ file: {}", fileName, e);
            throw new RuntimeException("Không thể đọc được file này. Vui lòng kiểm tra lại định dạng tệp tin.");
        }

        if (extractedText.trim().isEmpty()) {
            throw new RuntimeException("Tệp tin rỗng hoặc không trích xuất được nội dung văn bản.");
        }

        String truncatedTextForAi = extractedText;
        if (extractedText.length() > 12000) {
            truncatedTextForAi = extractedText.substring(0, 12000) + "\n...[Văn bản được cắt ngắn bớt bởi hệ thống]...";
        }

        // Save StudyContent with type USER_DOCUMENT
        StudyContent userDocument = StudyContent.builder()
                .user(user)
                .type("USER_DOCUMENT")
                .title(fileName) // mapping fileName to title
                .category("USER_UPLOAD") // mapping category to USER_UPLOAD
                .bodyText(extractedText) // mapping extractedText to bodyText
                .createdAt(LocalDateTime.now())
                .build();
        userDocument = studyContentRepository.save(userDocument);

        try {
            generateStudyMaterials(userDocument, truncatedTextForAi, flashcardCount);
        } catch (Exception e) {
            log.error("Lỗi khi sinh học liệu từ AI cho tài liệu: {}", fileName, e);
            studyContentRepository.delete(userDocument);
            throw new RuntimeException("AI gặp sự cố khi phân tích văn bản: " + e.getMessage());
        }

        return userDocument;
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractTextFromDocx(MultipartFile file) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
            XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
            return extractor.getText();
        }
    }

    private String extractTextFromTxt(MultipartFile file) throws IOException {
        return new String(file.getBytes(), StandardCharsets.UTF_8);
    }

    public List<Question> regenerateQuiz(Long docId, User user, int questionCount, String questionType) throws Exception {
        StudyContent doc = getDocumentById(docId, user);

        List<Question> oldQuestions = questionRepository.findBySourceTypeAndParentId("DOCUMENT_QUIZ", docId);
        questionRepository.deleteAll(oldQuestions);

        String truncatedText = doc.getBodyText();
        if (truncatedText != null && truncatedText.length() > 12000) {
            truncatedText = truncatedText.substring(0, 12000) + "\n...[Văn bản được cắt ngắn]...";
        }

        List<Question> newQuestions = generateQuizOnly(doc, truncatedText, questionCount, questionType);
        doc.setQuizQuestions(newQuestions);
        return newQuestions;
    }

    private List<Question> generateQuizOnly(StudyContent userDocument, String text, int count, String type) throws Exception {
        String typeInstruction;
        switch (type.toUpperCase()) {
            case "MULTIPLE_CHOICE" -> typeInstruction = "ALL " + count + " questions must be MULTIPLE_CHOICE type with 4 options (A, B, C, D). correctAnswer must be \"A\", \"B\", \"C\", or \"D\"";
            case "FILL_IN_BLANK" -> typeInstruction = "ALL " + count + " questions must be FILL_IN_BLANK type. No options needed. correctAnswer is the missing word.";
            default -> typeInstruction = "Mix of MULTIPLE_CHOICE and FILL_IN_BLANK types across the " + count + " questions.";
        }

        String systemPrompt = "You are an AI quiz generator. Generate exactly " + count + " quiz questions from the provided English text.\n" +
                "Rule: " + typeInstruction + "\n" +
                "Output ONLY a raw JSON object with a \"quizzes\" array. No other text.\n" +
                "Format:\n" +
                "{\n" +
                "  \"quizzes\": [\n" +
                "    {\n" +
                "      \"questionText\": \"Question text?\",\n" +
                "      \"type\": \"MULTIPLE_CHOICE\",\n" +
                "      \"optionA\": \"Option A text\",\n" +
                "      \"optionB\": \"Option B text\",\n" +
                "      \"optionC\": \"Option C text\",\n" +
                "      \"optionD\": \"Option D text\",\n" +
                "      \"correctAnswer\": \"A\",\n" +
                "      \"explanation\": \"Giải thích bằng tiếng Việt.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"questionText\": \"Complete: She wants to ____ her skills.\",\n" +
                "      \"type\": \"FILL_IN_BLANK\",\n" +
                "      \"correctAnswer\": \"improve\",\n" +
                "      \"explanation\": \"Giải thích bằng tiếng Việt.\"\n" +
                "    }\n" +
                "  ]\n" +
                "}";

        String userPrompt = "Text to analyze:\n\n" + text;
        log.info("Regenerating {} {} quiz questions for doc ID: {}", count, type, userDocument.getId());
        String jsonResponse = groqService.generateJsonResponse(systemPrompt, userPrompt);

        JsonNode root = objectMapper.readTree(jsonResponse);
        JsonNode quizzesNode = root.get("quizzes");
        List<Question> quizList = new ArrayList<>();
        if (quizzesNode != null && quizzesNode.isArray()) {
            int qNum = 1;
            for (JsonNode qNode : quizzesNode) {
                Question quiz = Question.builder()
                        .sourceType("DOCUMENT_QUIZ")
                        .parentId(userDocument.getId())
                        .questionNumber(qNum++)
                        .type(qNode.path("type").asText())
                        .questionText(qNode.path("questionText").asText())
                        .optionA(qNode.has("optionA") ? qNode.get("optionA").asText() : null)
                        .optionB(qNode.has("optionB") ? qNode.get("optionB").asText() : null)
                        .optionC(qNode.has("optionC") ? qNode.get("optionC").asText() : null)
                        .optionD(qNode.has("optionD") ? qNode.get("optionD").asText() : null)
                        .correctOption(qNode.path("correctAnswer").asText())
                        .correctAnswer(qNode.path("correctAnswer").asText())
                        .explanation(qNode.path("explanation").asText())
                        .build();
                quizList.add(quiz);
            }
            questionRepository.saveAll(quizList);
        }
        return quizList;
    }

    private void generateStudyMaterials(StudyContent userDocument, String text, int flashcardCount) throws Exception {
        String systemPrompt = "You are an AI learning assistant. Your task is to analyze the provided English text and generate exactly two items:\n" +
                "1. A list of exactly " + flashcardCount + " key English vocabulary words (Flashcards) found in the text, each with phonetic spelling, part of speech, Vietnamese definition, and an example English sentence with its Vietnamese translation.\n" +
                "2. A list of exactly 5 quiz questions mixing MULTIPLE_CHOICE and FILL_IN_BLANK types (QuizQuestions) testing vocabulary or reading comprehension.\n\n" +
                "You MUST output raw JSON matching this format:\n" +
                "{\n" +
                "  \"flashcards\": [\n" +
                "    {\n" +
                "      \"word\": \"word\",\n" +
                "      \"partOfSpeech\": \"noun\",\n" +
                "      \"phonetic\": \"/phonetic/\",\n" +
                "      \"definition\": \"nghĩa tiếng Việt\",\n" +
                "      \"exampleSentence\": \"Example English sentence.\",\n" +
                "      \"exampleTranslation\": \"Dịch nghĩa ví dụ tiếng Việt.\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"quizzes\": [\n" +
                "    {\n" +
                "      \"questionText\": \"Question text here?\",\n" +
                "      \"type\": \"MULTIPLE_CHOICE\",\n" +
                "      \"optionA\": \"A...\",\n" +
                "      \"optionB\": \"B...\",\n" +
                "      \"optionC\": \"C...\",\n" +
                "      \"optionD\": \"D...\",\n" +
                "      \"correctAnswer\": \"A\",\n" +
                "      \"explanation\": \"Giải thích lý do đúng bằng tiếng Việt.\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"questionText\": \"Complete the sentence: She wants to ____ her English skills.\",\n" +
                "      \"type\": \"FILL_IN_BLANK\",\n" +
                "      \"correctAnswer\": \"enhance\",\n" +
                "      \"explanation\": \"Giải thích nghĩa từ vựng và câu bằng tiếng Việt.\"\n" +
                "    }\n" +
                "  ]\n" +
                "}\n" +
                "Ensure all output fields match the keys exactly. Always translate explanation, definition, and example translation to Vietnamese.";

        String userPrompt = "Here is the English document text to analyze:\n\n" + text;

        log.info("Requesting AI parsing from Groq for document ID: {}", userDocument.getId());
        String jsonResponse = groqService.generateJsonResponse(systemPrompt, userPrompt);
        log.info("Received AI response: {}", jsonResponse);

        JsonNode root = objectMapper.readTree(jsonResponse);

        // Parse and save Flashcards
        JsonNode flashcardsNode = root.get("flashcards");
        if (flashcardsNode != null && flashcardsNode.isArray()) {
            List<Flashcard> flashcardList = new ArrayList<>();
            for (JsonNode fNode : flashcardsNode) {
                Flashcard flashcard = Flashcard.builder()
                        .studyContent(userDocument)
                        .word(fNode.path("word").asText())
                        .partOfSpeech(fNode.path("partOfSpeech").asText())
                        .phonetic(fNode.path("phonetic").asText())
                        .definition(fNode.path("definition").asText())
                        .exampleSentence(fNode.path("exampleSentence").asText())
                        .exampleTranslation(fNode.path("exampleTranslation").asText())
                        .build();
                flashcardList.add(flashcard);
            }
            flashcardRepository.saveAll(flashcardList);
            userDocument.setFlashcards(flashcardList);
        }

        // Parse and save QuizQuestions
        JsonNode quizzesNode = root.get("quizzes");
        if (quizzesNode != null && quizzesNode.isArray()) {
            List<Question> quizList = new ArrayList<>();
            int qNum = 1;
            for (JsonNode qNode : quizzesNode) {
                Question quiz = Question.builder()
                        .sourceType("DOCUMENT_QUIZ")
                        .parentId(userDocument.getId())
                        .questionNumber(qNum++)
                        .type(qNode.path("type").asText())
                        .questionText(qNode.path("questionText").asText())
                        .optionA(qNode.has("optionA") ? qNode.get("optionA").asText() : null)
                        .optionB(qNode.has("optionB") ? qNode.get("optionB").asText() : null)
                        .optionC(qNode.has("optionC") ? qNode.get("optionC").asText() : null)
                        .optionD(qNode.has("optionD") ? qNode.get("optionD").asText() : null)
                        .correctOption(qNode.path("correctAnswer").asText())
                        .correctAnswer(qNode.path("correctAnswer").asText())
                        .explanation(qNode.path("explanation").asText())
                        .build();
                quizList.add(quiz);
            }
            questionRepository.saveAll(quizList);
            userDocument.setQuizQuestions(quizList);
        }
    }

    public Flashcard addFlashcard(Long docId, Flashcard flashcard, User user) {
        StudyContent doc = getDocumentById(docId, user);
        flashcard.setStudyContent(doc);
        return flashcardRepository.save(flashcard);
    }

    public void deleteFlashcard(Long docId, Long flashcardId, User user) {
        StudyContent doc = getDocumentById(docId, user);
        Flashcard flashcard = flashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard không tồn tại."));
        if (flashcard.getStudyContent() == null || !flashcard.getStudyContent().getId().equals(doc.getId())) {
            throw new RuntimeException("Flashcard không thuộc tài liệu này.");
        }
        flashcardRepository.delete(flashcard);
    }
}
