package com.article.backend.controller;

import com.article.backend.dto.TechDetailDTO;
import com.article.backend.service.TechDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class TechDetailController {

    private final TechDetailService techDetailService;

    @GetMapping("/{slug}")
    public ResponseEntity<TechDetailDTO> getArticleBySlug(@PathVariable String slug) {
        return techDetailService.getBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
