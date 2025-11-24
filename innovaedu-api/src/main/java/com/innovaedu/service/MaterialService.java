package com.innovaedu.service;

import com.innovaedu.entity.Material;
import com.innovaedu.entity.User;
import com.innovaedu.repository.MaterialRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Value("${huggingface.api.token}")
    private String huggingFaceToken;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Material generateMaterial(String type, String grade, String subject, String topic, User user) {
        System.out.println("Generando material para: " + type + ", " + grade + ", " + subject + ", " + topic);
        // Temporal: usar mock para probar flujo
        String content = "Material simulado para " + type + " en " + grade + " grado, " + subject + ", tema " + topic + ". Incluye objetivos, actividades y evaluación alineados con CNEB.";
        System.out.println("Contenido generado (mock): " + content);

        Material material = new Material();
        material.setType(type);
        material.setGrade(grade);
        material.setSubject(subject);
        material.setTopic(topic);
        material.setContent(content);
        material.setUser(user);

        return materialRepository.save(material);
    }

    private String buildPrompt(String type, String grade, String subject, String topic) {
        return "Genera un material pedagógico de tipo " + type + " para " + grade + " grado, asignatura " + subject +
               ", tema " + topic + ". Alineado con el Currículo Nacional de Educación Básica (CNEB). " +
               "Incluye objetivos, contenido, actividades y evaluación. Escribe en español.";
    }

    private String generateWithHuggingFace(String prompt) {
        String apiUrl = "https://api-inference.huggingface.co/models/gpt2"; // Modelo más rápido
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + huggingFaceToken);
        headers.set("Content-Type", "application/json");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("inputs", prompt);
        requestBody.put("parameters", Map.of("max_length", 300, "temperature", 0.7));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            String generatedText = jsonNode.get(0).get("generated_text").asText();
            return generatedText.replace(prompt, "").trim(); // Remover el prompt del inicio
        } catch (Exception e) {
            return "Error generando contenido: " + e.getMessage();
        }
    }

    public byte[] generatePDF(Material material) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("Material Pedagógico"));
        document.add(new Paragraph("Tipo: " + material.getType()));
        document.add(new Paragraph("Grado: " + material.getGrade()));
        document.add(new Paragraph("Asignatura: " + material.getSubject()));
        document.add(new Paragraph("Tema: " + material.getTopic()));
        document.add(new Paragraph("Contenido:"));
        document.add(new Paragraph(material.getContent()));

        document.close();
        return out.toByteArray();
    }

    public byte[] generateDOCX(Material material) throws IOException {
        XWPFDocument document = new XWPFDocument();
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText("Material Pedagógico");
        run.addBreak();

        run = paragraph.createRun();
        run.setText("Tipo: " + material.getType());
        run.addBreak();

        run = paragraph.createRun();
        run.setText("Grado: " + material.getGrade());
        run.addBreak();

        run = paragraph.createRun();
        run.setText("Asignatura: " + material.getSubject());
        run.addBreak();

        run = paragraph.createRun();
        run.setText("Tema: " + material.getTopic());
        run.addBreak();

        run = paragraph.createRun();
        run.setText("Contenido:");
        run.addBreak();

        run = paragraph.createRun();
        run.setText(material.getContent());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.write(out);
        document.close();
        return out.toByteArray();
    }
}