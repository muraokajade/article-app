package com.example.demo.controller;

import com.example.demo.dto.request.AddBookRequest;
import com.example.demo.dto.response.BookResponse;
import com.example.demo.service.AdminService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PutMapping("/secure/increase/book/quantity")
    public ResponseEntity<BookResponse> increaseBookQuantity(@RequestHeader(value = "Authorization") String token,
                                                             @RequestParam Long bookId)
    {
        try {
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            Boolean isAdmin = (Boolean) decodedToken.getClaims().get("admin");

            if (isAdmin == null || !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            return adminService.increaseBookQuantity(bookId);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/secure/add/book")
    public ResponseEntity<?> postBook(@RequestHeader("Authorization") String token,
                                      @RequestBody AddBookRequest addBookRequest) {
        try {
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            Boolean isAdmin = (Boolean) decodedToken.getClaims().get("admin");

            if (isAdmin == null || !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("管理者専用です");
            }

            adminService.postBook(addBookRequest);
            return ResponseEntity.ok().build();
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("トークンが不正です");
        }
    }

    @DeleteMapping("/secure/delete/book")
    public ResponseEntity<?> deleteBook(@RequestHeader(value = "Authorization") String token,
                                        @RequestParam Long bookId)
    {
        try {
            String idToken = token.replace("Bearer ", "");
            System.out.println("IDToken: " + idToken); // ← トークン確認
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            System.out.println("Claims: " + decodedToken.getClaims()); // ← クレーム確認
            boolean isAdmin = (Boolean) decodedToken.getClaims().get("admin");

            if(!isAdmin) {
                System.out.println("adminエラー");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            adminService.deleteBook(bookId);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            e.printStackTrace();
            System.out.println("firebaseエラー");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }


    }

}
