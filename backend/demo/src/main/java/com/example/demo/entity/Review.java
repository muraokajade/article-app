package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Data
@Table(name = "review")
@AllArgsConstructor
@NoArgsConstructor
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "date")
    @CreationTimestamp
    private LocalDateTime date;

    @Column(name = "rating")
    private double rating;

    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "review_description")
    private String reviewDescription;

    // 投稿処理専用のコンストラクタ（idを除く）
    public Review(Long bookId, String userEmail, LocalDateTime date, double rating, String reviewDescription) {
        this.bookId = bookId;
        this.userEmail = userEmail;
        this.date = date;
        this.rating = rating;
        this.reviewDescription = reviewDescription;
    }
}
