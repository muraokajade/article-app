package com.article.backend.repository;

import com.article.backend.entity.ArticleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {

    Optional<ArticleEntity> findBySlug(String slug);

    @Query("SELECT a FROM ArticleEntity a WHERE a.isPublished = true")
    List<ArticleEntity> findByIsPublishedTrue();
}
