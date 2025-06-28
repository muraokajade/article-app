package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookPageResponse {
    List<BookResponse> books;
    int currentPage;
    int totalPages;
    long totalElements;
}