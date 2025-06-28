package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "history")
@Data
@NoArgsConstructor
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "checkout_date")
    private LocalDate checkoutDate;
    @Column(name = "returned_date")
    private LocalDate returnedDate;
    private String title;
    private String author;
    private String description;
    private String img;

    public History(String userEmail, LocalDate checkoutDate, LocalDate returnedDate,
                   String title, String author, String description, String img) {
        this.userEmail = userEmail;
        this.checkoutDate = checkoutDate;
        this.returnedDate = returnedDate;
        this.title = title;
        this.author = author;
        this.description = description;
        this.img = img;
    }



}
