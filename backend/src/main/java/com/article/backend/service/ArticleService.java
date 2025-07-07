package com.article.backend.service;

import com.article.backend.dto.ArticleDTO;
import com.article.backend.entity.ArticleDetail;
import com.article.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository techDetailRepository;

    public Optional<ArticleDTO> getBySlug(String slug) {
        return techDetailRepository.findBySlug(slug)
                .map(this::convertToDTO);
    }

    private ArticleDTO convertToDTO(ArticleDetail entity) {
        return new ArticleDTO(
                entity.getSlug(),
                entity.getTitle(),
                entity.getSectionTitle(),
                entity.getContent(),
                entity.getImageUrl()
        );
    }
}
