package com.article.backend.repository;

import com.article.backend.entity.ReviewScoreEntity;
import com.article.backend.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewScoreRepository extends JpaRepository<ReviewScoreEntity,Long> {

    Optional<UserEntity> findByUserEmail(String userEmail);


    Optional<ReviewScoreEntity> findByUserIdAndArticleId(Long id, Long articleId);

    List<ReviewScoreEntity> findByArticleId(Long articleId);
}
