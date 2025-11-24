package com.innovaedu.dto.request;

public class MaterialGenerationRequest {
    private String type;
    private String grade;
    private String subject;
    private String topic;

    // Getters and setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getTopic() { return topic; }
    public void setTopic(String topic) { this.topic = topic; }
}