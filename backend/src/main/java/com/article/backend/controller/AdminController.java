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

    @GetMapping("/article/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticleDTO> getArticle(@RequestHeader(name = "Authorization") String token,
                                                 @PathVariable Long id) {
        firebaseAuthService.verifyAdminAndGetEmail(token);
        ArticleDTO articleDTO = articleService.findById(id);
        return ResponseEntity.ok(articleDTO);
    }

    @PutMapping("/article/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticleDTO> updateArticle(@RequestHeader(name = "Authorization") String token,
                                                    @PathVariable Long id,
                                                    @ModelAttribute ArticleRequest request)
    {
        firebaseAuthService.verifyAdminAndGetEmail(token);
        ArticleDTO articleDTO = articleService.updateArticle(id,request);
        return ResponseEntity.ok(articleDTO);
    }
    @DeleteMapping("/article/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteById(@RequestHeader(name = "Authorization") String token,
                                                 @PathVariable Long id)
    {
        firebaseAuthService.verifyAdminAndGetEmail(token);
        articleService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
