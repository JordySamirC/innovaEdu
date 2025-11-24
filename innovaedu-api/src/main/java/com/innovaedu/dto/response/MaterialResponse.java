package com.innovaedu.dto.response;

public class MaterialResponse {
    private Long id;
    private String type;
    private String content;
    private String grade;
    private String subject;
    private String topic;

    // Constructor, getters and setters
    public MaterialResponse(Long id, String type, String content, String grade, String subject, String topic) {
        this.id = id;
        this.type = type;
        this.content = content;
        this.grade = grade;
        this.subject = subject;
        this.topic = topic;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}