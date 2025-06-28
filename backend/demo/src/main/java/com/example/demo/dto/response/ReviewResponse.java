package com.example.demo.dto.response;


import com.example.demo.entity.Review;

import java.time.format.DateTimeFormatter;

public record ReviewResponse(
        Long id,
        String userEmail,
        Long bookId,
        String date,
        double rating,
        String reviewDescription
        ) {
    public static ReviewResponse fromEntity(Review review) {
        String formattedDate = review.getDate()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd")); // 例: 2025-06-17

        return new ReviewResponse(
            review.getId(),
            review.getUserEmail(),
            review.getBookId(),
            formattedDate,
            review.getRating(),
            review.getReviewDescription());
    }
}
