package com.article.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ArticleDTO {
    private String slug;
    private String title;
    private String sectionTitle;
    private String content;
    private String imageUrl;
}
