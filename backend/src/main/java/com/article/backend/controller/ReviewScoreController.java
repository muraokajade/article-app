package com.article.backend.controller;

import com.article.backend.dto.ScoreDTO;
import com.article.backend.dto.request.ReviewScoreRequest;
import com.article.backend.service.FirebaseAuthService;
import com.article.backend.service.ReviewScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/review-scores")
@RequiredArgsConstructor
public class ReviewScoreController {

    private final ReviewScoreService reviewScoreService;
    private final FirebaseAuthService firebaseAuthService;

    @GetMapping()
    public ResponseEntity<List<ScoreDTO>> getScore(@RequestHeader(value = "Authorization")String token,
                                             @RequestParam Long articleId)
    {
        String userEmail = firebaseAuthService.verifyAdminAndGetEmail(token);
        List<ScoreDTO> scores = reviewScoreService.getScore(articleId);

        return ResponseEntity.ok(scores);
    }

    @PostMapping
    public ResponseEntity<?> postScore(@RequestHeader(value = "Authorization")String token,
                                       @RequestBody ReviewScoreRequest request) {
        String userEmail = firebaseAuthService.verifyAdminAndGetEmail(token);
        reviewScoreService.postScore(request,userEmail);
        return ResponseEntity.ok("ポスト成功");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> putScore(@RequestHeader(value = "Authorization")String token,
                                      @RequestBody ReviewScoreRequest request)
    {
        String userEmail = firebaseAuthService.verifyAdminAndGetEmail(token);
        reviewScoreService.putScore(request, userEmail);
        return ResponseEntity.ok("変更成功");
    }
}
