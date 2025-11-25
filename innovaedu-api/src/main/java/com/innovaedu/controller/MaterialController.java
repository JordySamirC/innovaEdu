package com.innovaedu.controller;

import com.innovaedu.dto.request.MaterialGenerationRequest;
import com.innovaedu.dto.response.MaterialResponse;
import com.innovaedu.entity.Material;
import com.innovaedu.entity.User;
import com.innovaedu.repository.MaterialRepository;
import com.innovaedu.service.MaterialService;
import com.innovaedu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Autowired
    private MaterialService materialService;

    @Autowired
    private UserService userService;

    @Autowired
    private MaterialRepository materialRepository;

    @PostMapping("/generate")
    public ResponseEntity<MaterialResponse> generateMaterial(@RequestBody MaterialGenerationRequest request,
            Authentication authentication) {
        String email = authentication.getName(); // El JWT tiene el email en el subject
        User user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        Material material = materialService.generateMaterial(request.getType(), request.getGrade(),
                request.getSubject(), request.getTopic(), user);

        MaterialResponse response = new MaterialResponse(
                material.getId(),
                material.getType(),
                material.getContent(),
                material.getGrade(),
                material.getSubject(),
                material.getTopic());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportPDF(@PathVariable Long id) throws IOException {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        byte[] pdfBytes = materialService.generatePDF(material);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "material_" + id + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/{id}/export/docx")
    public ResponseEntity<byte[]> exportDOCX(@PathVariable Long id) throws IOException {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material not found"));
        byte[] docxBytes = materialService.generateDOCX(material);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", "material_" + id + ".docx");

        return ResponseEntity.ok()
                .headers(headers)
                .body(docxBytes);
    }
}