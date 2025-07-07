package com.article.backend.repository;

import com.article.backend.entity.ArticleDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleRepository extends JpaRepository<ArticleDetail, Long> {

    Optional<ArticleDetail> findBySlug(String slug);
}
