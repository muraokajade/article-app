package com.example.demo.controller;

import com.example.demo.dto.response.ReviewListResponse;
import com.example.demo.dto.request.ReviewRequest;
import com.example.demo.service.ReviewService;
import com.example.demo.util.FirebaseUtil;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ReviewListResponse getReviewByBookId(@RequestParam Long bookId,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "5") int size) {
        return reviewService.findReviewByBookId(bookId,page, size);
    }

    //TODO ユーザーが既にレビュー済みか確認（isReviewLeft）
    @GetMapping("/secure/user/reviewed")
    public ResponseEntity<Boolean> isReviewLeft(@RequestHeader("Authorization") String token,
                                                @RequestParam Long bookId) throws Exception
    {
        try{
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String UserEmail = decodedToken.getEmail();
            Boolean isReview = reviewService.isReviewLeftByUser(UserEmail, bookId);
            return ResponseEntity.ok(isReview);
        } catch(Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
    }


    @PostMapping("/secure")
    public ResponseEntity<?> postReview(@RequestHeader("Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest)
    {
        try{
            String userEmail = FirebaseUtil.extractUserEmailFromToken(token);
            reviewService.postReview(userEmail, reviewRequest);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch(FirebaseAuthException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "認証に失敗しました", e);
        }
    }
}
