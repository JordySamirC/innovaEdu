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
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MaterialService {

    @Autowired
    private MaterialRepository materialRepository;

    @Value("${HUGGINGFACE_API_TOKEN}")
    private String huggingFaceToken;

    public Material generateMaterial(String type, String grade, String subject, String topic, User user) {
        System.out.println("🚀 Generando material para: " + type + ", " + grade + ", " + subject + ", " + topic);

        String content;
        boolean useAI = true; // Activado: usando Spring AI con Hugging Face

        if (useAI) {
            try {
                String prompt = buildPrompt(type, grade, subject, topic);
                System.out.println("📝 Generando con Spring AI + Hugging Face (Llama-3.2-3B)...");
                System.out.println("📄 Prompt (primeros 150 caracteres): "
                        + prompt.substring(0, Math.min(150, prompt.length())) + "...");

                content = generateWithAI(prompt);

                System.out.println("✅ Contenido generado con IA exitosamente");
                if (content != null) {
                    System.out.println("📏 Longitud: " + content.length() + " caracteres");
                }

                if (content == null || content.trim().length() < 50) {
                    System.out.println("⚠️ Contenido muy corto, usando fallback");
                    content = generateFallbackContent(type, grade, subject, topic);
                }
            } catch (Exception e) {
                System.err.println("❌ ERROR GENERANDO CON IA: " + e.getClass().getName());
                System.err.println("❌ Mensaje: " + e.getMessage());
                e.printStackTrace();
                System.out.println("📋 Usando contenido de fallback");
                content = generateFallbackContent(type, grade, subject, topic);
            }
        } else {
            System.out.println("📋 Generando contenido estructurado (fallback)...");
            content = generateFallbackContent(type, grade, subject, topic);
        }

        Material material = new Material();
        material.setType(type);
        material.setGrade(grade);
        material.setSubject(subject);
        material.setTopic(topic);
        material.setContent(content);
        material.setUser(user);

        Material savedMaterial = materialRepository.save(material);
        System.out.println("💾 Material guardado con ID: " + savedMaterial.getId());

        return savedMaterial;
    }

    /**
     * Genera contenido usando Spring AI con Hugging Face
     * Modelo: Llama-3.2-3B-Instruct (gratuito)
     */
    private String generateWithAI(String prompt) {
        String url = "https://router.huggingface.co/v1/chat/completions";
        String apiKey = this.huggingFaceToken;

        RestTemplate restTemplate = new RestTemplate();

        // Configurar headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        // Crear el cuerpo de la petición
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "meta-llama/Llama-3.2-3B-Instruct");
        requestBody.put("max_tokens", 1500);
        requestBody.put("temperature", 0.7);

        // Mensajes
        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);
        requestBody.put("messages", List.of(userMessage));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            System.out.println("🚀 Enviando petición a Hugging Face Router API...");
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody != null && responseBody.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
                    String content = (String) messageObj.get("content");
                    System.out.println("✅ Respuesta recibida de Hugging Face");
                    return content;
                }
            }
            System.out.println("⚠️ Respuesta vacía de Hugging Face");
            return null;
        } catch (Exception e) {
            System.out.println("❌ Error llamando a Hugging Face API: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String buildPrompt(String type, String grade, String subject, String topic) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Eres un experto pedagogo peruano. Crea un ").append(type).append(" detallado para ");
        prompt.append(grade).append(" grado de educación básica, área de ").append(subject);
        prompt.append(", sobre el tema: ").append(topic).append(".\n\n");

        switch (type) {
            case "Sesión de Aprendizaje":
                prompt.append("Incluye:\n");
                prompt.append("1. DATOS INFORMATIVOS (grado, área, tema, duración)\n");
                prompt.append("2. PROPÓSITOS DE APRENDIZAJE (competencias, capacidades, desempeños)\n");
                prompt.append("3. SECUENCIA DIDÁCTICA (inicio, desarrollo, cierre con tiempos)\n");
                prompt.append("4. MATERIALES Y RECURSOS\n");
                prompt.append("5. EVALUACIÓN (instrumentos y criterios)\n");
                break;
            case "Ficha Práctica":
                prompt.append("Incluye:\n");
                prompt.append("1. Encabezado con grado, tema, nombre y fecha\n");
                prompt.append("2. Instrucciones claras\n");
                prompt.append("3. Sección de conceptos básicos (4 puntos)\n");
                prompt.append("4. Ejercicios de aplicación (8 puntos)\n");
                prompt.append("5. Problemas de razonamiento (8 puntos)\n");
                prompt.append("6. Autoevaluación\n");
                break;
            case "Rúbrica":
                prompt.append("Incluye:\n");
                prompt.append("1. Encabezado con área, grado y tema\n");
                prompt.append("2. Tabla con 5 criterios de evaluación\n");
                prompt.append("3. Niveles: Excelente (4), Bueno (3), Regular (2), Deficiente (1)\n");
                prompt.append("4. Descriptores específicos para cada nivel\n");
                prompt.append("5. Escala de calificación (AD, A, B, C)\n");
                break;
            case "Unidad de Aprendizaje":
                prompt.append("Incluye:\n");
                prompt.append("1. DATOS INFORMATIVOS\n");
                prompt.append("2. SITUACIÓN SIGNIFICATIVA\n");
                prompt.append("3. PROPÓSITOS DE APRENDIZAJE\n");
                prompt.append("4. SECUENCIA DE SESIONES (4 semanas)\n");
                prompt.append("5. MATERIALES Y RECURSOS\n");
                prompt.append("6. EVALUACIÓN\n");
                break;
        }

        prompt.append("\nAlineado con el Currículo Nacional de Educación Básica (CNEB) de Perú.");
        prompt.append("\nEscribe en español con formato claro y profesional.");

        return prompt.toString();
    }

    private String generateFallbackContent(String type, String grade, String subject, String topic) {
        System.out.println("📋 Generando contenido estructurado para: " + type);

        String gradeText = grade + "° Grado";

        switch (type) {
            case "Sesión de Aprendizaje":
                return generateSessionPlan(gradeText, subject, topic);
            case "Ficha Práctica":
                return generateWorksheet(gradeText, subject, topic);
            case "Rúbrica":
                return generateRubric(gradeText, subject, topic);
            case "Unidad de Aprendizaje":
                return generateLearningUnit(gradeText, subject, topic);
            default:
                return generateBasicContent(type, gradeText, subject, topic);
        }
    }

    private String generateBasicContent(String type, String grade, String subject, String topic) {
        return String.format(
                "%s - %s\n\n" +
                        "Grado: %s\n" +
                        "Área: %s\n" +
                        "Tema: %s\n\n" +
                        "CONTENIDO GENERADO AUTOMÁTICAMENTE\n\n" +
                        "Este material pedagógico está alineado con el Currículo Nacional de Educación Básica (CNEB).\n\n"
                        +
                        "PROPÓSITOS DE APRENDIZAJE:\n" +
                        "- Desarrollar competencias relacionadas con %s\n" +
                        "- Aplicar conocimientos en situaciones cotidianas\n" +
                        "- Fortalecer el pensamiento crítico y reflexivo\n\n" +
                        "ACTIVIDADES SUGERIDAS:\n" +
                        "1. Introducción al tema mediante ejemplos prácticos\n" +
                        "2. Desarrollo de ejercicios guiados\n" +
                        "3. Trabajo individual o grupal\n" +
                        "4. Evaluación formativa\n\n" +
                        "EVALUACIÓN:\n" +
                        "Se evaluará mediante rúbricas y listas de cotejo alineadas con los criterios del CNEB.\n\n" +
                        "Nota: Este es un contenido base. Se recomienda personalizarlo según las necesidades específicas de los estudiantes.",
                type, topic, grade, subject, topic, topic);
    }

    private String generateSessionPlan(String grade, String subject, String topic) {
        return String.format("SESIÓN DE APRENDIZAJE\n\n" +
                "DATOS INFORMATIVOS:\n" +
                "- Grado: %s\n" +
                "- Área: %s\n" +
                "- Tema: %s\n" +
                "- Duración: 90 minutos\n\n" +
                "I. PROPÓSITOS DE APRENDIZAJE:\n\n" +
                "Competencia:\n" +
                "- Resuelve problemas relacionados con %s en %s\n\n" +
                "Capacidades:\n" +
                "- Comprende los conceptos fundamentales de %s\n" +
                "- Aplica estrategias para resolver problemas de %s\n" +
                "- Argumenta sus procedimientos y resultados\n\n" +
                "Desempeños:\n" +
                "- Identifica y describe las características de %s\n" +
                "- Resuelve ejercicios prácticos aplicando %s\n" +
                "- Explica el proceso seguido para resolver problemas\n\n" +
                "II. SECUENCIA DIDÁCTICA:\n\n" +
                "INICIO (20 minutos):\n" +
                "- Motivación: Presentación de situación problemática cotidiana relacionada con %s\n" +
                "- Saberes previos: ¿Qué saben sobre %s? ¿Dónde lo han visto?\n" +
                "- Conflicto cognitivo: ¿Cómo podemos resolver este problema?\n" +
                "- Propósito: Hoy aprenderemos sobre %s y cómo aplicarlo\n\n" +
                "DESARROLLO (50 minutos):\n" +
                "- Presentación del tema %s con ejemplos visuales\n" +
                "- Explicación paso a paso de los conceptos clave\n" +
                "- Práctica guiada: Resolución de ejercicios en grupo\n" +
                "- Trabajo individual: Ejercicios de aplicación\n" +
                "- Retroalimentación continua\n\n" +
                "CIERRE (20 minutos):\n" +
                "- Metacognición: ¿Qué aprendimos? ¿Cómo lo aprendimos? ¿Para qué nos sirve?\n" +
                "- Evaluación formativa: Preguntas de verificación\n" +
                "- Tarea para casa: Ejercicios de refuerzo\n\n" +
                "III. MATERIALES Y RECURSOS:\n" +
                "- Pizarra y plumones\n" +
                "- Fichas de trabajo\n" +
                "- Material concreto (si aplica)\n" +
                "- Cuadernos de trabajo\n\n" +
                "IV. EVALUACIÓN:\n" +
                "- Instrumento: Lista de cotejo / Rúbrica\n" +
                "- Criterios: Comprensión, aplicación y argumentación",
                grade, subject, topic, topic, subject, topic, topic, topic, topic,
                topic, topic, topic, topic, topic);
    }

    private String generateWorksheet(String grade, String subject, String topic) {
        return String.format("FICHA PRÁCTICA - %s\n\n" +
                "Grado: %s\n" +
                "Tema: %s\n\n" +
                "Nombre: _________________________________  Fecha: __________\n\n" +
                "INSTRUCCIONES: Lee atentamente cada ejercicio y resuelve en los espacios indicados.\n\n" +
                "I. CONCEPTOS BÁSICOS (4 puntos)\n\n" +
                "1. Define con tus propias palabras qué es %s:\n" +
                "   _______________________________________________________________\n" +
                "   _______________________________________________________________\n\n" +
                "2. Menciona tres ejemplos donde se aplica %s en la vida diaria:\n" +
                "   a) ___________________________________________________________\n" +
                "   b) ___________________________________________________________\n" +
                "   c) ___________________________________________________________\n\n" +
                "II. EJERCICIOS DE APLICACIÓN (8 puntos)\n\n" +
                "3. Resuelve los siguientes problemas sobre %s:\n\n" +
                "   Problema 1: [Espacio para resolver]\n\n" +
                "   Problema 2: [Espacio para resolver]\n\n" +
                "   Problema 3: [Espacio para resolver]\n\n" +
                "   Problema 4: [Espacio para resolver]\n\n" +
                "III. PROBLEMAS DE RAZONAMIENTO (8 puntos)\n\n" +
                "4. Situación problemática:\n" +
                "   Plantea y resuelve un problema de la vida real que involucre %s.\n" +
                "   \n" +
                "   a) ¿Qué datos tienes?\n" +
                "   b) ¿Qué te piden encontrar?\n" +
                "   c) Resuelve paso a paso\n" +
                "   d) Verifica tu respuesta\n\n" +
                "AUTOEVALUACIÓN:\n" +
                "¿Qué aprendí hoy? _____________________________________________\n" +
                "¿Qué dificultades tuve? ________________________________________\n" +
                "¿Cómo las superé? _____________________________________________",
                subject.toUpperCase(), grade, topic, topic, topic, topic, topic);
    }

    private String generateRubric(String grade, String subject, String topic) {
        return String.format("RÚBRICA DE EVALUACIÓN\n\n" +
                "Área: %s\n" +
                "Grado: %s\n" +
                "Tema: %s\n\n" +
                "CRITERIOS DE EVALUACIÓN:\n\n" +
                "┌─────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐\n" +
                "│ CRITERIO            │ EXCELENTE(4) │ BUENO (3)    │ REGULAR (2)  │ DEFICIENTE(1)│\n" +
                "├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤\n" +
                "│ Comprensión del     │ Demuestra    │ Demuestra    │ Demuestra    │ No demuestra │\n" +
                "│ tema %s       │ comprensión  │ comprensión  │ comprensión  │ comprensión  │\n" +
                "│                     │ profunda y   │ adecuada del │ básica del   │ del tema     │\n" +
                "│                     │ completa     │ tema         │ tema         │              │\n" +
                "├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤\n" +
                "│ Aplicación de       │ Aplica       │ Aplica       │ Aplica con   │ No logra     │\n" +
                "│ conceptos           │ correcta y   │ correcta-    │ errores los  │ aplicar los  │\n" +
                "│                     │ creativamente│ mente los    │ conceptos    │ conceptos    │\n" +
                "│                     │ los conceptos│              │              │              │\n" +
                "├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤\n" +
                "│ Procedimientos      │ Usa procedi- │ Usa procedi- │ Usa procedi- │ No usa       │\n" +
                "│ y estrategias       │ mientos      │ mientos      │ mientos con  │ procedimien- │\n" +
                "│                     │ eficientes   │ adecuados    │ dificultad   │ tos correctos│\n" +
                "├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤\n" +
                "│ Argumentación       │ Explica      │ Explica      │ Explica      │ No explica   │\n" +
                "│ y comunicación      │ claramente   │ adecuada-    │ con          │ sus          │\n" +
                "│                     │ sus procesos │ mente sus    │ dificultad   │ procedimien- │\n" +
                "│                     │              │ procesos     │              │ tos          │\n" +
                "├─────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤\n" +
                "│ Presentación        │ Trabajo      │ Trabajo      │ Trabajo poco │ Trabajo      │\n" +
                "│ del trabajo         │ ordenado,    │ ordenado y   │ ordenado     │ desordenado  │\n" +
                "│                     │ limpio y     │ legible      │              │              │\n" +
                "│                     │ creativo     │              │              │              │\n" +
                "└─────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘\n\n" +
                "PUNTAJE TOTAL: _____ / 20 puntos\n\n" +
                "NIVEL DE LOGRO:\n" +
                "- Logro destacado (18-20): AD\n" +
                "- Logro esperado (14-17): A\n" +
                "- En proceso (11-13): B\n" +
                "- En inicio (0-10): C\n\n" +
                "OBSERVACIONES Y RECOMENDACIONES:\n" +
                "_________________________________________________________________\n" +
                "_________________________________________________________________",
                subject, grade, topic, topic);
    }

    private String generateLearningUnit(String grade, String subject, String topic) {
        return String.format("UNIDAD DE APRENDIZAJE\n\n" +
                "I. DATOS INFORMATIVOS:\n" +
                "- Área: %s\n" +
                "- Grado: %s\n" +
                "- Título: \"%s\"\n" +
                "- Duración: 4 semanas (20 horas pedagógicas)\n\n" +
                "II. SITUACIÓN SIGNIFICATIVA:\n" +
                "Los estudiantes de %s necesitan comprender %s para aplicarlo en situaciones cotidianas y desarrollar su pensamiento crítico en %s.\n\n"
                +
                "III. PROPÓSITOS DE APRENDIZAJE:\n\n" +
                "Competencias:\n" +
                "1. Resuelve problemas relacionados con %s\n" +
                "2. Gestiona su aprendizaje de manera autónoma\n\n" +
                "Capacidades:\n" +
                "- Comprende conceptos de %s\n" +
                "- Aplica estrategias de resolución\n" +
                "- Argumenta y comunica sus ideas\n" +
                "- Reflexiona sobre su proceso de aprendizaje\n\n" +
                "IV. SECUENCIA DE SESIONES:\n\n" +
                "SEMANA 1: Introducción a %s\n" +
                "- Sesión 1: Conceptos básicos y definiciones\n" +
                "- Sesión 2: Ejemplos y aplicaciones iniciales\n" +
                "- Sesión 3: Práctica guiada\n" +
                "- Sesión 4: Evaluación formativa\n\n" +
                "SEMANA 2: Desarrollo y profundización\n" +
                "- Sesión 5: Estrategias de resolución\n" +
                "- Sesión 6: Problemas de aplicación\n" +
                "- Sesión 7: Trabajo colaborativo\n" +
                "- Sesión 8: Retroalimentación\n\n" +
                "SEMANA 3: Aplicación práctica\n" +
                "- Sesión 9: Proyectos de aplicación\n" +
                "- Sesión 10: Presentaciones grupales\n" +
                "- Sesión 11: Análisis de casos\n" +
                "- Sesión 12: Evaluación de proceso\n\n" +
                "SEMANA 4: Consolidación y evaluación\n" +
                "- Sesión 13: Repaso general\n" +
                "- Sesión 14: Resolución de problemas complejos\n" +
                "- Sesión 15: Evaluación final\n" +
                "- Sesión 16: Metacognición y cierre\n\n" +
                "V. MATERIALES Y RECURSOS:\n" +
                "- Textos escolares\n" +
                "- Fichas de trabajo\n" +
                "- Material concreto\n" +
                "- Recursos digitales\n" +
                "- Plataformas educativas\n\n" +
                "VI. EVALUACIÓN:\n" +
                "- Evaluación diagnóstica (inicio)\n" +
                "- Evaluación formativa (continua)\n" +
                "- Evaluación sumativa (final)\n" +
                "- Instrumentos: Rúbricas, listas de cotejo, pruebas escritas\n\n" +
                "VII. REFERENCIAS BIBLIOGRÁFICAS:\n" +
                "- Currículo Nacional de Educación Básica\n" +
                "- Textos de %s - MINEDU\n" +
                "- Recursos pedagógicos complementarios",
                subject, grade, topic, grade, topic, subject, topic, topic, topic, subject);
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