package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessagePageResponse {
    private List<MessageResponse> messages;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
