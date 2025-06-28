package com.example.demo.dto.response;

import com.example.demo.entity.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookResponse {

    private Long id;
    private String title;
    private String author;
    private String category;
    private String img;
    private String description;
    private int copies;
    private int copiesAvailable;

    public static BookResponse fromEntity(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getCategory(),
                book.getImg(),
                book.getDescription(),
                book.getCopies(),
                book.getCopiesAvailable()
        );
    }
}
