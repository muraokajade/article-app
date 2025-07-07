package com.article.backend.service;

import com.article.backend.dto.ArticleDTO;
import com.article.backend.dto.request.ArticleRequest;
import com.article.backend.entity.ArticleEntity;
import com.article.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    public Optional<ArticleDTO> getBySlug(String slug) {
        return articleRepository.findBySlug(slug)
                .map(this::convertToDTO);
    }

    private ArticleDTO convertToDTO(ArticleEntity entity) {
        return new ArticleDTO(
                entity.getSlug(),
                entity.getTitle(),
                entity.getSectionTitle(),
                entity.getContent(),
                entity.getImageUrl(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.isPublished()
        );
    }

    public ArticleDTO createArticle(ArticleRequest request, String email) {
        ArticleEntity entity = convertToEntity(request,email);


        ArticleEntity saved = articleRepository.save(entity);
        return convertToDTO(saved);

    }

    private ArticleEntity convertToEntity(ArticleRequest request, String email) {
        ArticleEntity entity = new ArticleEntity();
        entity.setSlug(request.getSlug());
        entity.setTitle(request.getTitle());
        entity.setSectionTitle(request.getSectionTitle());
        entity.setContent(request.getContent());

        System.out.println("アップロード画像: " + request.getImage());

        String imageUrl = saveImageAndGetUrl(request.getImage());
        entity.setImageUrl(imageUrl);

        entity.setUserEmail(email);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setPublished(true);
        return entity;
    }

    private String saveImageAndGetUrl(MultipartFile image) {
        if (image == null || image.isEmpty()) return null;

        try {
            String filename = UUID.randomUUID() + "_" + image.getOriginalFilename();
            Path uploadPath = Paths.get("uploads");
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(filename);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 例： http://localhost:8080/uploads/filename.jpg
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("画像の保存に失敗しました", e);
        }
    }

    public List<ArticleDTO> getAllArticles() {
        return articleRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();

    }

    public List<ArticleDTO> getPublishedArticles() {
        return articleRepository.findByIsPublishedTrue()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    public void togglePublished(String slug) {
        ArticleEntity article = articleRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("記事が見つかりません: " + slug));

        article.setPublished(!article.isPublished()); // 状態を反転
        articleRepository.save(article);
    }
}
