
package com.example.demo.service;

import com.example.demo.entity.Book;
import com.example.demo.entity.Checkout;
import com.example.demo.entity.History;
import com.example.demo.exception.*;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.CheckoutRepository;
import com.example.demo.repository.HistoryRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.dto.response.ShelfCurrentLoansResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CheckoutRepository checkoutRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    private final HistoryRepository historyRepository;

    public Integer countLoansCountByUserEmail(String email) {
        return checkoutRepository.countByUserEmailAndReturnDateAfter(email, LocalDate.now());
    }

    public Boolean isCheckedOutByUser(String userEmail, Long bookId) {
        return checkoutRepository.existsByUserEmailAndBookId(userEmail, bookId);
    }

    // TODO　本貸出
    public void checkoutBookByUserAndEmail(String userEmail, Long bookId) throws Exception {
        //存在確認
        Optional<Book> bookOptional = bookRepository.findBookById(bookId);

        if(bookOptional.isEmpty()) {
            throw new BookNotFoundException("書籍は存在しません");
        }
        Book book = bookOptional.get();

        //在庫確認
        if(book.getCopiesAvailable() <= 0) {
            throw new NoStockAvailableException("在庫が不足しています");
        }

        Boolean isCheckedOut = checkoutRepository.existsByUserEmailAndBookId(userEmail, bookId);

        if(isCheckedOut) {
            throw new DuplicateCheckoutException("この書籍はすでに貸出済みです");
        }

        book.setCopiesAvailable(book.getCopiesAvailable() -1);
        bookRepository.save(book);

        LocalDate now = LocalDate.now();
        LocalDate returnDate = now.plusDays(7);

        Checkout checkout = new Checkout(
                userEmail,
                now,
                returnDate,
                bookId
        );
        checkoutRepository.save(checkout);
    }

    //TODO 現在貸出中の書籍情報を取得するメソッド
    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
        System.out.println("【確認用】currentLoans() 呼び出し成功 - userEmail: " + userEmail);
       List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

       List<Checkout> checkoutList = checkoutRepository.findBookByUserEmail(userEmail);
        System.out.println("取得した checkoutList = " + checkoutList);
       List<Long> bookIds = new ArrayList<>();

        for (Checkout c : checkoutList) {
            if (c.getBookId() != null) {
                System.out.println("  Book ID = " + c.getBookId());
                bookIds.add(c.getBookId());
            }
        }


        System.out.println("抽出された bookIds = " + bookIds);
        List<Book> bookList = bookRepository.findBooksByBookIds(bookIds);
        System.out.println("取得した bookList = " + bookList);


       for(Book book: bookList) {
           Optional<Checkout> checkoutOptional = checkoutList
                   .stream()
                   .filter(c -> c.getBookId().equals(book.getId()))
                   .findFirst();
           if(checkoutOptional.isEmpty()) {
               throw new CheckoutNotFoundException("貸し出された本はありません。");
           }

           Checkout checkout = checkoutOptional.get();

           LocalDate returnDate = checkout.getReturnDate();
           LocalDate today = LocalDate.now();

           int daysLeft = (int) ChronoUnit.DAYS.between(today, returnDate);

           Long bookId = book.getId();
           Boolean isReview = reviewRepository.existsReviewByUserEmailAndBookId(userEmail,bookId);
           ShelfCurrentLoansResponse response = new ShelfCurrentLoansResponse(book, daysLeft, isReview);
           shelfCurrentLoansResponses.add(response);
       }
       return shelfCurrentLoansResponses;
    }


    //TODO 本返却
    public void returnBook(String userEmail, Long bookId) throws Exception {

        Optional<Book> bookOptional = bookRepository.findBookById(bookId);

        if(bookOptional.isEmpty()) {
            throw new BookNotFoundException("本が存在しません");
        }
        Book book = bookOptional.get();
        //貸出情報の取得
        Checkout checkout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(checkout == null) {
            throw new CheckoutNotFoundException("本はまだ貸し出されていません");
        }

        book.setCopiesAvailable(book.getCopiesAvailable() - 1);
        bookRepository.save(book);

        checkoutRepository.deleteById(bookId);

//        History history = new History(
//
//        );

    }

    //TODO 貸出期限を7日間伸ばす。ただし延滞していない場合に限る
    public void renewLoan(String email, Long bookId) throws Exception {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(email, bookId);

        if(validateCheckout == null) {
            throw new CheckoutNotFoundException("本は無いか、貸出がされていません。");
        }

        //現在の日付
        LocalDate today = LocalDate.now();

        //返却日
        LocalDate returnDate = validateCheckout.getReturnDate();

        if(returnDate.isBefore(today)) {
            throw new OverdueLoanException("延滞中の本は貸出できません");
        }

        //7日プラス
        validateCheckout.setReturnDate(returnDate.plusDays(7));

        checkoutRepository.save(validateCheckout);

    }
}
