package com.example.demo.repository;

import com.example.demo.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Boolean existsReviewByUserEmailAndBookId(String userEmail, Long bookId);

    Page<Review> findReviewByBookId(Long bookId, Pageable pageable);

    @Modifying
    @Query("delete from Review where bookId = :bookId")
    void deleteAllByBookId(@Param("bookId")Long bookId);
}
