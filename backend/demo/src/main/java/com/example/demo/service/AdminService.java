package com.example.demo.service;

import com.example.demo.dto.request.AddBookRequest;
import com.example.demo.entity.Book;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CheckoutRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.dto.response.BookResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final CheckoutRepository checkoutRepository;
    //TODO BookからBookResponseへの切り替えあり
    public ResponseEntity<BookResponse> increaseBookQuantity(Long bookId) {
        Optional<Book> book = bookRepository.findBookById(bookId);

        if(!book.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        book.get().setCopies(book.get().getCopies() + 1);
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
        bookRepository.save(book.get());

        return ResponseEntity.ok(BookResponse.fromEntity(book.get()));

    }

    public void postBook(AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setAuthor(addBookRequest.getAuthor());
        book.setDescription(addBookRequest.getDescription());
        book.setCopies(addBookRequest.getCopies());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setCategory(addBookRequest.getCategory());
        book.setImg(addBookRequest.getImg());

        bookRepository.save(book);
    }

    public void deleteBook(Long bookId) throws Exception {
        Optional<Book> book = bookRepository.findBookById(bookId);

        if(!book.isPresent()) {
            throw new Exception("本がありません");
        }

        bookRepository.delete(book.get());
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }

}
