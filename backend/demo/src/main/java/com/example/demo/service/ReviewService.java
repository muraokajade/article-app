package com.example.demo.service;

import com.example.demo.dto.response.ReviewListResponse;
import com.example.demo.dto.request.ReviewRequest;
import com.example.demo.dto.response.ReviewResponse;
import com.example.demo.entity.Review;
import com.example.demo.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;


    public Boolean isReviewLeftByUser(String userEmail, Long bookId) {
        return reviewRepository.existsReviewByUserEmailAndBookId(userEmail, bookId);
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) {
        //
        Review review = new Review(
                reviewRequest.getBookId(),
                userEmail,
                LocalDateTime.now(),
                reviewRequest.getRating(),
                reviewRequest.getReviewDescription()
        );

        reviewRepository.save(review);
    }

    public ReviewListResponse findReviewByBookId(Long bookId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Review> pageReview = reviewRepository.findReviewByBookId(bookId, pageable);

        List<ReviewResponse> reviewList = pageReview.getContent()
                .stream()
                .map(ReviewResponse::fromEntity)
                .toList();
        return new ReviewListResponse(
                reviewList,
                pageReview.getNumber(),
                pageReview.getTotalPages(),
                pageReview.getTotalElements()
        );

    }
}
