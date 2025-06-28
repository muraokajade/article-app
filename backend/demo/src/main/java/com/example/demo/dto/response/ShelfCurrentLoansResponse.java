package com.example.demo.dto.response;

import com.example.demo.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ShelfCurrentLoansResponse {
    private Book book;
    private int daysLeft;
    private boolean isReviewLeft;
    //private Long reviewId;
}
