package com.example.demo.dto.response;

import java.util.List;


public record ReviewListResponse(
         List<ReviewResponse> reviews,
         int currentPage,
         int totalPages,
         long totalElements
) {

}
