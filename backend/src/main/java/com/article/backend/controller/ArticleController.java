package com.article.backend.controller;

import com.article.backend.dto.ArticleDTO;
import com.article.backend.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping("/{slug}")
    public ResponseEntity<ArticleDTO> getArticleBySlug(@PathVariable String slug) {
        return articleService.getBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
