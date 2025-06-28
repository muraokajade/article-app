package com.example.demo.controller;

import com.example.demo.entity.History;
import com.example.demo.service.HistoryService;
import com.example.demo.util.FirebaseUtil;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/histories")
@RequiredArgsConstructor
public class HistoryController {
    private final HistoryService historyService;

    @GetMapping("/secure/user/history")
    public ResponseEntity<Page<History>> getUserHistory(@RequestHeader(value = "Authorization")String token,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "5") int size)
    {
        try {
            String email = FirebaseUtil.extractUserEmailFromToken(token);
            Page<History> history = historyService.getHistory(email,page,size);
            return ResponseEntity.ok().body(history);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
