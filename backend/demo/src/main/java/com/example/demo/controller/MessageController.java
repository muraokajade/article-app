package com.example.demo.controller;

import com.example.demo.dto.request.AdminQuestionRequest;
import com.example.demo.dto.response.MessagePageResponse;
import com.example.demo.entity.History;
import com.example.demo.entity.Message;
import com.example.demo.service.MessageService;
import com.example.demo.util.FirebaseUtil;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/admin/questions")
    public ResponseEntity<MessagePageResponse> getAdminMessages(
            @RequestHeader(value = "Authorization") String token,
            @RequestParam int page,
            @RequestParam int size)
    {
        try{
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            boolean isAdmin = Boolean.TRUE.equals(decodedToken.getClaims().get("admin"));

            if(!isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            MessagePageResponse messages = messageService.getMessages(false, page,size);
            return ResponseEntity.ok(messages);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }

    @PostMapping("/secure/add/message")
    public ResponseEntity<?> postMessage(@RequestHeader(value = "Authorization") String token,
                                         @RequestBody Message messageRequest) {
        try {
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            messageService.postMessage(messageRequest,email);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace(); // これ追加
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage()); //
        }
    }

    @GetMapping("/secure/questions")
    public ResponseEntity<MessagePageResponse> getMessages(@RequestHeader(value = "Authorization")String token,
                                     @RequestParam int page,
                                     @RequestParam int size) {
        Pageable pageable = PageRequest.of(page,size);
        try {
            String email = FirebaseUtil.extractUserEmailFromToken(token);
            MessagePageResponse messages =  messageService.getMessages(email,pageable);
            return ResponseEntity.ok(messages);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/secure/admin/message")
    public ResponseEntity<?> putMessage(@RequestHeader(value = "Authorization") String token,
                           @RequestBody AdminQuestionRequest adminQuestionRequest) {
        try{
            String idToken = token.replace("Bearer ", "");
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            boolean isAdmin = Boolean.TRUE.equals(decodedToken.getClaims().get("admin"));
            if(!isAdmin) {
                throw new RuntimeException("adminユーザーのみ許可された操作です。");
            }
            String adminEmail = decodedToken.getEmail();
            messageService.putMessage(adminQuestionRequest,adminEmail);
            return ResponseEntity.ok().build();
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

    }


}
