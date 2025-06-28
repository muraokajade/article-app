package com.example.demo.repository;

import com.example.demo.entity.Checkout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

public interface CheckoutRepository extends JpaRepository<Checkout, Long> {
    Integer countByUserEmailAndReturnDateAfter(String email, LocalDate today);

    //TODOどういう命名？
    // SELECT CASE WHEN COUNT(c) > 0 THEN TRUE ELSE FALSE END
    // FROM checkout c
    // WHERE c.user_email = :userEmail AND c.book_id = :bookId
    Boolean existsByUserEmailAndBookId(String userEmail, Long bookId);

    List<Checkout> findBookByUserEmail(String userEmail);

    Checkout findByUserEmailAndBookId(String email, Long bookId);

    @Modifying
    @Query("delete from Checkout where bookId in :bookId")
    void deleteAllByBookId(@Param("bookId")Long bookId);
}
