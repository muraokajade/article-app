package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {

    public Message(){}

    public Message(String title, String question) {
        this.title = title;
        this.question = question;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    private String title;

    private String question;

    @Column(name = "admin_email")
    private String adminEmail;

    private String response;

    private boolean closed;

}
