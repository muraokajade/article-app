package com.article.backend.service;

import com.article.backend.dto.ScoreDTO;
import com.article.backend.dto.request.ReviewScoreRequest;
import com.article.backend.entity.ReviewScoreEntity;
import com.article.backend.entity.UserEntity;
import com.article.backend.repository.ReviewScoreRepository;
import com.article.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewScoreService {
    private final ReviewScoreRepository reviewScoreRepository;
    private final UserRepository userRepository;
    public void postScore(ReviewScoreRequest request, String userEmail) {
        UserEntity userEntity = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        ReviewScoreEntity entity = new ReviewScoreEntity();
        entity.setUserId(userEntity.getId());
        entity.setScore(request.getScore());
        entity.setArticleId(request.getArticleId());
        reviewScoreRepository.save(entity);
    }

    public void putScore(ReviewScoreRequest request, String userEmail) {
        UserEntity userEntity = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません。"));
        ReviewScoreEntity existing = reviewScoreRepository.
                                findByUserIdAndArticleId(userEntity.getId(), request.getArticleId())
                .orElseThrow(() -> new RuntimeException("スコアが存在しません。"));

        existing.setScore(request.getScore());
        existing.setUpdatedAt(LocalDateTime.now());
        reviewScoreRepository.save(existing);
    }

    public List<ScoreDTO> getScore(Long articleId) {
        List<ReviewScoreEntity> entities = reviewScoreRepository.findByArticleId(articleId);
        return entities.stream().map(this::convertToDTO).toList();
    }

    private ScoreDTO convertToDTO(ReviewScoreEntity entity) {
        ScoreDTO dto = new ScoreDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUserId());
        dto.setArticleId(entity.getArticleId());
        dto.setScore(entity.getScore());
        return dto;
    }
}
