package com.article.backend.service;

import com.article.backend.dto.TechDetailDTO;
import com.article.backend.entity.TechDetail;
import com.article.backend.repository.TechDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TechDetailService {

    private final TechDetailRepository techDetailRepository;

    public Optional<TechDetailDTO> getBySlug(String slug) {
        return techDetailRepository.findBySlug(slug)
                .map(this::convertToDTO);
    }

    private TechDetailDTO convertToDTO(TechDetail entity) {
        return new TechDetailDTO(
                entity.getSlug(),
                entity.getTitle(),
                entity.getSectionTitle(),
                entity.getContent(),
                entity.getImageUrl()
        );
    }
}
