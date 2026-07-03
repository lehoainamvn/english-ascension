package com.englishascension.backend.feature.document.service;

import com.englishascension.backend.feature.ai.service.GroqService;
import com.englishascension.backend.feature.document.entity.UserDocument;
import com.englishascension.backend.feature.document.entity.DocumentFlashcard;
import com.englishascension.backend.feature.document.entity.DocumentQuestion;
import com.englishascension.backend.feature.document.entity.DocumentQuestionOption;
import com.englishascension.backend.feature.document.repository.UserDocumentRepository;
import com.englishascension.backend.feature.document.repository.DocumentFlashcardRepository;
import com.englishascension.backend.feature.document.repository.DocumentQuestionRepository;
import com.englishascension.backend.feature.user.entity.User;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class UserDocumentService {

    private static final Logger log = LoggerFactory.getLogger(UserDocumentService.class);

    private final UserDocumentRepository userDocumentRepository;
    private final DocumentFlashcardRepository documentFlashcardRepository;
    private final DocumentQuestionRepository documentQuestionRepository;
    private final GroqService groqService;
    private final ObjectMapper objectMapper;

    public UserDocumentService(
            UserDocumentRepository userDocumentRepository,
            DocumentFlashcardRepository documentFlashcardRepository,
            DocumentQuestionRepository documentQuestionRepository,
            GroqService groqService) {
        this.userDocumentRepository = userDocumentRepository;
        this.documentFlashcardRepository = documentFlashcardRepository;
        this.documentQuestionRepository = documentQuestionRepository;
        this.groqService = groqService;
        this.objectMapper = new ObjectMapper();
    }

    public List<UserDocument> getMyDocuments(User user) {
        return userDocumentRepository.findByUserId(user.getId());
    }

    public UserDocument getDocumentById(Long id, User user) {
        UserDocument doc = userDocumentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tài liệu không tồn tại."));
        if (doc.getUser() == null || !doc.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Bạn không có quyền truy cập tài liệu này.");
        }
        return doc;
    }

    public void deleteDocument(Long id, User user) {
        UserDocument doc = getDocumentById(id, user);
        userDocumentRepository.delete(doc);
    }

    public UserDocument uploadAndProcess(MultipartFile file, User user, int flashcardCount) {
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

        // Save User Document
        UserDocument userDocument = UserDocument.builder()
                .user(user)
                .title(fileName)
                .bodyText(extractedText)
                .build();
        userDocument = userDocumentRepository.save(userDocument);

        try {
            generateStudyMaterials(userDocument, truncatedTextForAi, flashcardCount);
        } catch (Exception e) {
            log.error("Lỗi khi sinh học liệu từ AI cho tài liệu: {}", fileName, e);
            userDocumentRepository.delete(userDocument);
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

    public List<DocumentQuestion> regenerateQuiz(Long docId, User user, int questionCount, String questionType) throws Exception {
        UserDocument doc = getDocumentById(docId, user);

        List<DocumentQuestion> oldQuestions = documentQuestionRepository.findByDocumentId(docId);
        documentQuestionRepository.deleteAll(oldQuestions);

        String truncatedText = doc.getBodyText();
        if (truncatedText != null && truncatedText.length() > 12000) {
            truncatedText = truncatedText.substring(0, 12000) + "\n...[Văn bản được cắt ngắn]...";
        }

        return generateQuizOnly(doc, truncatedText, questionCount, questionType);
    }

    private List<DocumentQuestion> generateQuizOnly(UserDocument userDocument, String text, int count, String type) throws Exception {
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
                "    }\n" +
                "  ]\n" +
                "}";

        String userPrompt = "Text to analyze:\n\n" + text;
        log.info("Regenerating {} {} quiz questions for doc ID: {}", count, type, userDocument.getId());
        String jsonResponse = groqService.generateJsonResponse(systemPrompt, userPrompt);
        
        jsonResponse = cleanJsonResponse(jsonResponse);
        JsonNode root = objectMapper.readTree(jsonResponse);
        JsonNode quizzesNode = root.get("quizzes");
        List<DocumentQuestion> quizList = new ArrayList<>();
        if (quizzesNode != null && quizzesNode.isArray()) {
            for (JsonNode qNode : quizzesNode) {
                DocumentQuestion q = DocumentQuestion.builder()
                        .document(userDocument)
                        .questionText(qNode.path("questionText").asText())
                        .explanation(qNode.path("explanation").asText())
                        .build();

                List<DocumentQuestionOption> options = new ArrayList<>();
                String correct = qNode.path("correctAnswer").asText();
                if (qNode.has("optionA")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("A").optionValue(qNode.get("optionA").asText()).correct("A".equalsIgnoreCase(correct)).build());
                }
                if (qNode.has("optionB")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("B").optionValue(qNode.get("optionB").asText()).correct("B".equalsIgnoreCase(correct)).build());
                }
                if (qNode.has("optionC")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("C").optionValue(qNode.get("optionC").asText()).correct("C".equalsIgnoreCase(correct)).build());
                }
                if (qNode.has("optionD")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("D").optionValue(qNode.get("optionD").asText()).correct("D".equalsIgnoreCase(correct)).build());
                }
                q.setOptions(options);
                quizList.add(q);
                documentQuestionRepository.save(q);
            }
        }
        return quizList;
    }

    private void generateStudyMaterials(UserDocument userDocument, String text, int flashcardCount) throws Exception {
        String systemPrompt = "You are an AI learning assistant. Your task is to analyze the provided English text and generate exactly two items:\n" +
                "1. A list of exactly " + flashcardCount + " key English vocabulary words (Flashcards) found in the text, each with phonetic spelling, part of speech, Vietnamese definition, and an example English sentence with its Vietnamese translation.\n" +
                "2. A list of exactly 5 quiz questions of MULTIPLE_CHOICE type (QuizQuestions) testing vocabulary or reading comprehension.\n\n" +
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
                "    }\n" +
                "  ]\n" +
                "}\n" +
                "Ensure all output fields match the keys exactly. Always translate explanation, definition, and example translation to Vietnamese.";

        String userPrompt = "Here is the English document text to analyze:\n\n" + text;

        log.info("Requesting AI parsing from Groq for document ID: {}", userDocument.getId());
        String jsonResponse = groqService.generateJsonResponse(systemPrompt, userPrompt);
        log.info("Received AI response: {}", jsonResponse);

        jsonResponse = cleanJsonResponse(jsonResponse);
        JsonNode root = objectMapper.readTree(jsonResponse);

        // Parse and save Flashcards
        JsonNode flashcardsNode = root.get("flashcards");
        if (flashcardsNode != null && flashcardsNode.isArray()) {
            for (JsonNode fNode : flashcardsNode) {
                DocumentFlashcard vocab = DocumentFlashcard.builder()
                        .document(userDocument)
                        .word(fNode.path("word").asText())
                        .partOfSpeech(fNode.path("partOfSpeech").asText())
                        .phonetic(fNode.path("phonetic").asText())
                        .definition(fNode.path("definition").asText())
                        .exampleSentence(fNode.path("exampleSentence").asText())
                        .exampleTranslation(fNode.path("exampleTranslation").asText())
                        .build();
                documentFlashcardRepository.save(vocab);
            }
        }

        // Parse and save QuizQuestions
        JsonNode quizzesNode = root.get("quizzes");
        if (quizzesNode != null && quizzesNode.isArray()) {
            for (JsonNode qNode : quizzesNode) {
                DocumentQuestion q = DocumentQuestion.builder()
                        .document(userDocument)
                        .questionText(qNode.path("questionText").asText())
                        .explanation(qNode.path("explanation").asText())
                        .build();

                List<DocumentQuestionOption> options = new ArrayList<>();
                String correct = qNode.path("correctAnswer").asText();
                if (qNode.has("optionA")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("A").optionValue(qNode.get("optionA").asText()).correct("A".equalsIgnoreCase(correct)).build());
                }
                if (qNode.has("optionB")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("B").optionValue(qNode.get("optionB").asText()).correct("B".equalsIgnoreCase(correct)).build());
                }
                if (qNode.has("optionC")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("C").optionValue(qNode.get("optionC").asText()).correct("C".equalsIgnoreCase(correct)).build());
                }
                if (qNode.has("optionD")) {
                    options.add(DocumentQuestionOption.builder().question(q).optionKey("D").optionValue(qNode.get("optionD").asText()).correct("D".equalsIgnoreCase(correct)).build());
                }
                q.setOptions(options);
                documentQuestionRepository.save(q);
            }
        }

        // Fallback: If quizzes count is 0, run dedicated call to generate exactly 5 quizzes
        int questionsCount = documentQuestionRepository.findByDocumentId(userDocument.getId()).size();
        if (questionsCount == 0) {
            log.warn("No quizzes generated in initial joint prompt. Running separate quiz generation fallback for doc ID: {}", userDocument.getId());
            try {
                generateQuizOnly(userDocument, text, 5, "MULTIPLE_CHOICE");
            } catch (Exception e) {
                log.error("Failed to generate fallback quizzes: {}", e.getMessage(), e);
            }
        }
    }

    public DocumentFlashcard addFlashcard(Long docId, DocumentFlashcard flashcard, User user) {
        UserDocument doc = getDocumentById(docId, user);
        flashcard.setDocument(doc);
        return documentFlashcardRepository.save(flashcard);
    }

    public void deleteFlashcard(Long docId, Long flashcardId, User user) {
        UserDocument doc = getDocumentById(docId, user);
        DocumentFlashcard flashcard = documentFlashcardRepository.findById(flashcardId)
                .orElseThrow(() -> new RuntimeException("Flashcard không tồn tại."));
        if (flashcard.getDocument() == null || !flashcard.getDocument().getId().equals(doc.getId())) {
            throw new RuntimeException("Flashcard không thuộc tài liệu này.");
        }
        documentFlashcardRepository.delete(flashcard);
    }

    private String cleanJsonResponse(String json) {
        if (json == null) return "{}";
        json = json.trim();
        if (json.startsWith("```")) {
            int firstLineEnd = json.indexOf("\n");
            if (firstLineEnd != -1) {
                json = json.substring(firstLineEnd + 1);
            } else {
                json = json.substring(3);
            }
            if (json.endsWith("```")) {
                json = json.substring(0, json.length() - 3);
            }
            json = json.trim();
        }
        return json;
    }
}
