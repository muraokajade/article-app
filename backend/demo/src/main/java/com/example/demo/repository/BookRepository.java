package com.example.demo.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Book;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {


    Page<Book> findByTitleContaining(String title, Pageable pageable);

    Page<Book> findByCategory(String category, Pageable pageable);

    Optional<Book> findBookById(Long bookId);

    @Query("select b from Book b where b.id in :book_ids")
    List<Book> findBooksByBookIds(@Param("book_ids")List<Long> bookIdList);
}
