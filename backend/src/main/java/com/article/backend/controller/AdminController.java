package com.article.backend.controller;

import com.article.backend.dto.ArticleDTO;
import com.article.backend.dto.request.ArticleRequest;
import com.article.backend.service.ArticleService;
import com.article.backend.service.FirebaseAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<ArticleDTO> createPost(@RequestHeader(name = "Authorization")String token,
                                          @ModelAttribute ArticleRequest request)
    {
        String email = firebaseAuthService.verifyAdminAndGetEmail(token);
        ArticleDTO saved = articleService.createArticle(request, email);
        return ResponseEntity.ok(saved);
    }
    @GetMapping("/articles")
    public ResponseEntity<List<ArticleDTO>> getAllArticles(@RequestHeader (name = "Authorization") String token)
    {
        firebaseAuthService.verifyAdminAndGetEmail(token);
        List<ArticleDTO> articles = articleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }
    @PutMapping("/articles/{slug}/toggle")
    public ResponseEntity<Void> togglePublishStatus(
            @PathVariable String slug,
            @RequestHeader(name = "Authorization") String token) {

        firebaseAuthService.verifyAdminAndGetEmail(token);
        articleService.togglePublished(slug);
        return ResponseEntity.ok().build();
    }


}
