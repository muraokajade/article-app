package com.article.backend.repository;

import com.article.backend.entity.TechDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechDetailRepository extends JpaRepository<TechDetail, Long> {

    Optional<TechDetail> findBySlug(String slug);
}
