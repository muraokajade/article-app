package com.example.demo.service;

import com.example.demo.entity.History;
import com.example.demo.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistoryService {

    private final HistoryRepository historyRepository;

    public Page<History> getHistory(String email,int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return historyRepository.findBooksByUserEmail(email,pageable);
    }
}
