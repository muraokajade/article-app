package com.example.demo.service;

import com.example.demo.entity.Book;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CheckoutRepository;
import com.example.demo.repository.HistoryRepository;
import com.example.demo.dto.response.BookPageResponse;
import com.example.demo.dto.response.BookResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final CheckoutRepository checkoutRepository;
    private final HistoryRepository historyRepository;
    public BookPageResponse findAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Book> bookPage = bookRepository.findAll(pageable);

        List<BookResponse> books = bookPage.getContent()
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
        return new BookPageResponse(
                books,
                bookPage.getNumber(),
                bookPage.getTotalPages(),
                bookPage.getTotalElements()
        );
    }

    public BookPageResponse searchBooksByTitle(String title, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findByTitleContaining(title, pageable);

        List<BookResponse> books = bookPage.getContent()
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
        return new BookPageResponse(
                books,
                bookPage.getNumber(),
                bookPage.getTotalPages(),
                bookPage.getTotalElements()
        );

    }

    public BookPageResponse searchBookByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Book> bookPage = bookRepository.findByCategory(category,pageable);

        List<BookResponse> bookList = bookPage.getContent()
                .stream()
                .map(BookResponse::fromEntity)
                .toList();
        return new BookPageResponse(
                bookList,
                bookPage.getNumber(),
                bookPage.getTotalPages(),
                bookPage.getTotalElements()
        );
    }

    //TODO Entity DTOの切り替え
    public BookResponse findBookById(Long bookId) {
        Optional<Book> book = bookRepository.findBookById(bookId);

        if(!book.isPresent()) {
            throw new RuntimeException();
        }

        return BookResponse.fromEntity(book.get());
    }

}
