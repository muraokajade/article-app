package com.article.backend.controller;

import com.article.backend.dto.ArticleDTO;
import com.article.backend.dto.request.ArticleRequest;
import com.article.backend.service.ArticleService;
import com.article.backend.service.FirebaseAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final FirebaseAuthService firebaseAuthService;
    private final ArticleService articleService;
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public String adminOnly() {
        return "Welcome, Admin!";
    }

    @PostMapping("/articles")
    ResponseEntity<ArticleDTO> createPost(@RequestHeader(name = "Authorization")String token,
                                          @ModelAttribute ArticleRequest request)
    {
        String email = firebaseAuthService.verifyAdminAndGetEmail(token);
        ArticleDTO saved = articleService.createArticle(request, email);
        return ResponseEntity.ok(saved);
    }
}
