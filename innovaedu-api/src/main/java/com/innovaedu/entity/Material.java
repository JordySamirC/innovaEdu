package com.innovaedu.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "materials")
@Data
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // SESION, FICHA, RUBRICA, UNIDAD

    @Lob
    @Column(nullable = false)
    private String content; // JSON o texto del material generado

    @Column(nullable = false)
    private String grade; // 1° Grado, etc.

    @Column(nullable = false)
    private String subject; // Matemáticas, etc.

    @Column(nullable = false)
    private String topic; // Tema específico

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Usuario que generó

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}